import React, { useState, useEffect } from 'react';
import { 
  Users, 
  QrCode, 
  LogOut, 
  Crown, 
  Shield, 
  RefreshCw,
  Search,
  Menu,
  X,
  UserPlus,
  Lock,
  Mail,
  Plus,
  Trash2,
  Link as LinkIcon,
  Unlink
} from 'lucide-react';
import { apiRequest } from '../services/apiService';
import { authService } from '../services/authService';
import OneQr from './OneQr';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'oneqr'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // New user creation state variables
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserError, setNewUserError] = useState('');
  const [newUserSuccess, setNewUserSuccess] = useState('');
  const [newUserSubmitting, setNewUserSubmitting] = useState(false);

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    setNewUserError('');
    setNewUserSuccess('');

    if (!newUserPhone.trim() || !newUserPassword) {
      setNewUserError('Mobile number and password are required.');
      return;
    }

    if (newUserPhone.trim().length < 8) {
      setNewUserError('Phone number must be at least 8 digits.');
      return;
    }

    if (newUserPassword.length < 6) {
      setNewUserError('Password must be at least 6 characters.');
      return;
    }

    setNewUserSubmitting(true);
    try {
      const res = await apiRequest('/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          phone: newUserPhone.trim(),
          password: newUserPassword,
          email: newUserEmail.trim() || undefined
        })
      });

      if (res.status === 'success') {
        setNewUserSuccess('User account created successfully!');
        // Refresh dashboard statistics and user list
        fetchData();
        // Clear fields and close modal after short delay
        setTimeout(() => {
          setNewUserModalOpen(false);
          setNewUserPhone('');
          setNewUserPassword('');
          setNewUserEmail('');
          setNewUserSuccess('');
        }, 1500);
      } else {
        setNewUserError(res.message || 'Failed to create user account.');
      }
    } catch (err) {
      setNewUserError(err.message || 'Failed to create user account.');
    } finally {
      setNewUserSubmitting(false);
    }
  };

  const [selectedUserForProfiles, setSelectedUserForProfiles] = useState(null);
  const [userProfiles, setUserProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(false);
  const [profilesError, setProfilesError] = useState('');
  
  // States for adding a new profile slot
  const [newSlotPlan, setNewSlotPlan] = useState('basic');
  const [newSlotSubmitting, setNewSlotSubmitting] = useState(false);
  
  // States for inline actions
  const [profileActionLoading, setProfileActionLoading] = useState({}); // { [profileId]: boolean }
  const [showLinkInputForProfile, setShowLinkInputForProfile] = useState({}); // { [profileId]: boolean }
  const [qrIdInputForProfile, setQrIdInputForProfile] = useState({}); // { [profileId]: string }

  const fetchUserProfiles = async (userId) => {
    setProfilesLoading(true);
    setProfilesError('');
    try {
      const res = await apiRequest(`/admin/users/${userId}/profiles`);
      if (res.status === 'success') {
        setUserProfiles(res.data);
      } else {
        setProfilesError(res.message || 'Failed to fetch profiles.');
      }
    } catch (err) {
      setProfilesError(err.message || 'Failed to fetch profiles.');
    } finally {
      setProfilesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUserForProfiles) {
      fetchUserProfiles(selectedUserForProfiles.id);
    }
  }, [selectedUserForProfiles]);

  const handleAssignPlanToUser = async (e) => {
    e.preventDefault();
    if (!selectedUserForProfiles) return;
    
    setNewSlotSubmitting(true);
    setProfilesError('');
    try {
      const res = await apiRequest('/admin/users/assign-plan', {
        method: 'POST',
        body: JSON.stringify({
          userId: selectedUserForProfiles.id,
          planId: newSlotPlan
        })
      });
      if (res.status === 'success') {
        fetchUserProfiles(selectedUserForProfiles.id);
        fetchData(); // refresh the main dashboard stats/users counts
      } else {
        setProfilesError(res.message || 'Failed to assign plan.');
      }
    } catch (err) {
      setProfilesError(err.message || 'Failed to assign plan.');
    } finally {
      setNewSlotSubmitting(false);
    }
  };

  const handleUpdateProfilePlan = async (profileId, planId) => {
    setProfileActionLoading(prev => ({ ...prev, [profileId]: true }));
    try {
      const res = await apiRequest(`/admin/profiles/${profileId}/plan`, {
        method: 'POST',
        body: JSON.stringify({ planId })
      });
      if (res.status === 'success') {
        fetchUserProfiles(selectedUserForProfiles.id);
      } else {
        alert(res.message || 'Failed to update plan.');
      }
    } catch (err) {
      alert(err.message || 'Failed to update plan.');
    } finally {
      setProfileActionLoading(prev => ({ ...prev, [profileId]: false }));
    }
  };

  const handleConnectQrToProfile = async (profileId) => {
    const qrId = qrIdInputForProfile[profileId];
    if (!qrId || !qrId.trim()) {
      alert('Please enter a QR ID.');
      return;
    }
    
    setProfileActionLoading(prev => ({ ...prev, [profileId]: true }));
    try {
      const res = await apiRequest('/admin/profiles/connect-qr', {
        method: 'POST',
        body: JSON.stringify({ profileId, qrId: qrId.trim() })
      });
      if (res.status === 'success') {
        setQrIdInputForProfile(prev => ({ ...prev, [profileId]: '' }));
        setShowLinkInputForProfile(prev => ({ ...prev, [profileId]: false }));
        fetchUserProfiles(selectedUserForProfiles.id);
        fetchData();
      } else {
        alert(res.message || 'Failed to connect QR.');
      }
    } catch (err) {
      alert(err.message || 'Failed to connect QR.');
    } finally {
      setProfileActionLoading(prev => ({ ...prev, [profileId]: false }));
    }
  };

  const handleUnlinkQr = async (profileId) => {
    if (!window.confirm('Are you sure you want to unlink the QR Standy from this profile slot?')) {
      return;
    }
    
    setProfileActionLoading(prev => ({ ...prev, [profileId]: true }));
    try {
      const res = await apiRequest(`/admin/profiles/${profileId}/unlink`, {
        method: 'POST'
      });
      if (res.status === 'success') {
        fetchUserProfiles(selectedUserForProfiles.id);
        fetchData();
      } else {
        alert(res.message || 'Failed to unlink QR.');
      }
    } catch (err) {
      alert(err.message || 'Failed to unlink QR.');
    } finally {
      setProfileActionLoading(prev => ({ ...prev, [profileId]: false }));
    }
  };

  const handleDeleteProfileSlot = async (profileId) => {
    if (!window.confirm('Are you sure you want to delete this profile slot? This will delete the profile data and unlink any QR code.')) {
      return;
    }
    
    setProfileActionLoading(prev => ({ ...prev, [profileId]: true }));
    try {
      const res = await apiRequest(`/admin/profiles/${profileId}`, {
        method: 'DELETE'
      });
      if (res.status === 'success') {
        fetchUserProfiles(selectedUserForProfiles.id);
        fetchData();
      } else {
        alert(res.message || 'Failed to delete profile slot.');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete profile slot.');
    } finally {
      setProfileActionLoading(prev => ({ ...prev, [profileId]: false }));
    }
  };

  const adminUser = authService.getCurrentUser();

  const fetchData = async () => {
    setError('');
    try {
      const statsRes = await apiRequest('/admin/stats');
      const usersRes = await apiRequest('/admin/users');

      if (statsRes.status === 'success') {
        setStats(statsRes.data);
      }
      if (usersRes.status === 'success') {
        setUsers(usersRes.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSignOut = () => {
    authService.logout();
    onLogout();
  };

  // Filter users by phone number
  const filteredUsers = users.filter(user => 
    user.phone && user.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile Top Header Bar */}
      <div className="mobile-header-bar glass-panel mobile-only" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <span className="sidebar-logo-text">OneQR Admin</span>
        </div>
      </div>

      {/* Sidebar Backdrop Overlay on Mobile */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop mobile-only" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar glass-panel ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header-mobile mobile-only">
          <span className="sidebar-logo-text">Menu</span>
          <button className="mobile-menu-btn close" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '40px', paddingRight: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="sidebar-logo-icon">
              <QrCode size={20} color="#fff" />
            </div>
            <span className="sidebar-logo-text">OneQR Admin</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <div 
            onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }} 
            className={`sidebar-item ${activeTab === 'users' ? 'active' : ''}`}
          >
            <Users size={18} />
            <span>Users Directory</span>
          </div>
          
          <div 
            onClick={() => { setActiveTab('oneqr'); setIsSidebarOpen(false); }} 
            className={`sidebar-item ${activeTab === 'oneqr' ? 'active' : ''}`}
          >
            <QrCode size={18} />
            <span>One QR Manager</span>
          </div>
        </nav>

        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={handleSignOut} className="btn-logout">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="main-content">
        {activeTab === 'oneqr' ? (
          <OneQr />
        ) : (
          <>
            <header className="dashboard-header">
              <div className="header-title">
                <h1>Overview</h1>
                <p>System metrics and user accounts management</p>
              </div>

              <div className="admin-badge">
                <div className="admin-badge-dot"></div>
                <Shield size={14} style={{ marginRight: '6px', color: 'var(--accent-primary)' }} />
                <span>Admin: {adminUser?.phone || '8200875023'}</span>
              </div>
            </header>

            {error && (
              <div className="alert-error" style={{ marginBottom: '24px' }}>
                <span>{error}</span>
              </div>
            )}

            {/* Stats Grid */}
            <section className="stats-grid">
              <div className="stat-card glass-panel">
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <div className="stat-number">
                    {loading ? '...' : stats?.totalUsers || users.length}
                  </div>
                </div>
                <div className="stat-icon">
                  <Users size={24} />
                </div>
              </div>

              <div className="stat-card glass-panel">
                <div className="stat-info">
                  <h3>Total QR Profiles</h3>
                  <div className="stat-number">
                    {loading ? '...' : stats?.totalProfiles || 0}
                  </div>
                </div>
                <div className="stat-icon">
                  <QrCode size={24} />
                </div>
              </div>

              <div className="stat-card glass-panel">
                <div className="stat-info">
                  <h3>Active Subscriptions</h3>
                  <div className="stat-number">
                    {loading ? '...' : stats?.activeSubscriptions || 0}
                  </div>
                </div>
                <div className="stat-icon" style={{ color: 'var(--accent-secondary)' }}>
                  <Crown size={24} />
                </div>
              </div>
            </section>

            {/* Users Table Card */}
            <section className="section-card glass-panel">
              <div className="section-header">
                <h2 className="section-title">Registered Accounts</h2>
                
                <div className="section-header-actions">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Search phone number..."
                      className="form-input"
                      style={{ padding: '10px 12px 10px 36px', fontSize: '0.85rem' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search size={16} className="input-icon" style={{ left: '12px' }} />
                  </div>

                  <div className="actions-button-group">
                    <button 
                      onClick={() => {
                        setNewUserError('');
                        setNewUserSuccess('');
                        setNewUserPhone('');
                        setNewUserPassword('');
                        setNewUserEmail('');
                        setNewUserModalOpen(true);
                      }} 
                      className="btn-primary" 
                      style={{ padding: '10px 16px', marginTop: 0, width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <UserPlus size={16} />
                      <span>Add User</span>
                    </button>

                    <button 
                      onClick={handleRefresh} 
                      className="btn-primary" 
                      style={{ padding: '10px 14px', marginTop: 0, width: 'auto' }}
                      disabled={refreshing || loading}
                    >
                      <RefreshCw size={16} className={refreshing ? 'spinner' : ''} style={{ margin: 0 }} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="table-container">
                {loading ? (
                  <div className="table-loading">
                    <div className="spinner"></div>
                    <p>Loading accounts list...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="table-empty">
                    <p>No user accounts found matching your query.</p>
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Mobile Number</th>
                        <th>Profiles Created</th>
                        <th>Registration Date</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td data-label="Mobile Number">
                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user.phone}</span>
                          </td>
                          <td data-label="Profiles Created" style={{ fontWeight: '600' }}>
                            {user.profilesCount || 0}
                          </td>
                          <td data-label="Registration Date" style={{ color: 'var(--text-muted)' }}>
                            {formatDate(user.createdAt)}
                          </td>
                          <td data-label="Actions" style={{ textAlign: 'right' }}>
                            <button
                              onClick={() => setSelectedUserForProfiles(user)}
                              className="btn-primary"
                              style={{
                                margin: 0,
                                width: 'auto',
                                padding: '8px 14px',
                                background: 'linear-gradient(135deg, var(--accent-primary), #7c3aed)',
                                fontSize: '0.8rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <Crown size={14} />
                              <span>Manage Profiles</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* New User Manual Entry Modal */}
      {newUserModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <button 
              onClick={() => setNewUserModalOpen(false)}
              className="modal-close-btn"
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>Add New User</h3>
            <p className="modal-subtitle">
              Create a new user account manually. Hashed credentials will be saved.
            </p>

            {newUserError && (
              <div className="alert-error" style={{ marginBottom: '16px' }}>
                <span>{newUserError}</span>
              </div>
            )}

            {newUserSuccess && (
              <div className="alert-error" style={{ marginBottom: '16px', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)', color: '#a7f3d0' }}>
                <span>{newUserSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateUserSubmit}>
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    required
                    placeholder="Enter 10-digit mobile number"
                    className="form-input"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                  />
                  <Users size={16} className="input-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    required
                    placeholder="Enter password (min 6 characters)"
                    className="form-input"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                  />
                  <Lock size={16} className="input-icon" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Optional)</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="form-input"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                  <Mail size={16} className="input-icon" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setNewUserModalOpen(false)}
                  className="btn-primary btn-logout"
                  style={{ flex: 1, padding: '12px', margin: 0 }}
                  disabled={newUserSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px', margin: 0 }}
                  disabled={newUserSubmitting}
                >
                  {newUserSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Profiles Management Modal */}
      {selectedUserForProfiles && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-card" style={{ maxWidth: '650px', padding: '28px', width: '90%' }}>
            <button 
              onClick={() => setSelectedUserForProfiles(null)}
              className="modal-close-btn"
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                background: 'var(--accent-glow)',
                color: 'var(--accent-primary)',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Crown size={24} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 className="modal-title" style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700' }}>Manage Plans & Profiles</h3>
                <p className="modal-subtitle" style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  User: <strong style={{ color: 'var(--text-primary)' }}>{selectedUserForProfiles.phone}</strong>
                </p>
              </div>
            </div>

            {profilesError && (
              <div className="alert-error" style={{ marginBottom: '16px', padding: '10px 12px' }}>
                <span style={{ fontSize: '0.85rem' }}>{profilesError}</span>
              </div>
            )}

            {/* Assign New Plan Section */}
            <div className="glass-panel" style={{
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.02)',
              marginBottom: '24px',
              marginTop: '16px',
              textAlign: 'left'
            }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>Assign New Subscription Plan</h4>
              <form onSubmit={handleAssignPlanToUser} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label className="form-label" style={{ marginBottom: '6px', fontSize: '0.75rem' }}>Select Plan Tier</label>
                  <select
                    className="form-input"
                    value={newSlotPlan}
                    onChange={(e) => setNewSlotPlan(e.target.value)}
                    style={{ padding: '10px', margin: 0, fontSize: '0.85rem' }}
                  >
                    <option value="basic">Basic Plan</option>
                    <option value="premium">Premium Plan</option>
                    <option value="enterprise">Enterprise Plan</option>
                    <option value="free">Free Plan Slot</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={newSlotSubmitting}
                  style={{
                    margin: 0,
                    width: 'auto',
                    padding: '10px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    background: 'linear-gradient(135deg, var(--accent-secondary), #ec4899)'
                  }}
                >
                  {newSlotSubmitting ? (
                    <span className="spinner spinner-tiny"></span>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Create Plan Slot</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Profiles List */}
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'left' }}>Active Profile Slots</h4>
            
            {profilesLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '32px 0' }}>
                <div className="spinner"></div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Loading profile slots...</p>
              </div>
            ) : userProfiles.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '32px',
                border: '1px dashed var(--glass-border)',
                borderRadius: '12px',
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
              }}>
                No plan profiles created for this user yet. Use the selector above to assign a plan.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
                {userProfiles.map((profile) => {
                  const isLinkActive = showLinkInputForProfile[profile._id];
                  const isLoading = profileActionLoading[profile._id];
                  const qrValue = qrIdInputForProfile[profile._id] || '';

                  return (
                    <div key={profile._id} className="glass-panel" style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(255, 255, 255, 0.01)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                        {/* Profile Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className={`badge ${
                              profile.plan === 'basic' ? 'badge-plan-basic' :
                              profile.plan === 'premium' ? 'badge-plan-premium' :
                              profile.plan === 'enterprise' ? 'badge-plan-enterprise' : 'badge-plan-free'
                            }`} style={{ padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                              {profile.plan ? profile.plan.toUpperCase() : 'FREE'}
                            </span>
                            <span style={{
                              fontSize: '0.75rem',
                              color: profile.subscriptionStatus === 'active' ? '#10b981' : 'var(--text-muted)',
                              fontWeight: '600'
                            }}>
                              {profile.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Created: {new Date(profile.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Dropdown to change plan */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tier:</label>
                          <select
                            className="form-input"
                            value={profile.plan || 'free'}
                            onChange={(e) => handleUpdateProfilePlan(profile._id, e.target.value)}
                            disabled={isLoading}
                            style={{ padding: '4px 8px', margin: 0, fontSize: '0.8rem', width: 'auto' }}
                          >
                            <option value="free">FREE</option>
                            <option value="basic">Basic</option>
                            <option value="premium">Premium</option>
                            <option value="enterprise">Enterprise</option>
                          </select>
                        </div>
                      </div>

                      {/* Standy/QR code link status */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: 'rgba(0,0,0,0.15)',
                        borderRadius: '8px',
                        fontSize: '0.85rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <QrCode size={16} style={{ color: profile.slug ? 'var(--accent-secondary)' : 'var(--text-muted)' }} />
                          {profile.slug ? (
                            <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                              {profile.slug}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>No Standy Connected</span>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          {profile.slug ? (
                            <button
                              onClick={() => handleUnlinkQr(profile._id)}
                              disabled={isLoading}
                              className="btn-primary btn-danger"
                              style={{
                                margin: 0,
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                width: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Unlink QR Code"
                            >
                              <Unlink size={12} />
                              <span>Unlink</span>
                            </button>
                          ) : (
                            !isLinkActive && (
                              <button
                                onClick={() => setShowLinkInputForProfile(prev => ({ ...prev, [profile._id]: true }))}
                                disabled={isLoading}
                                className="btn-primary"
                                style={{
                                  margin: 0,
                                  padding: '4px 10px',
                                  fontSize: '0.75rem',
                                  width: 'auto',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: 'linear-gradient(135deg, var(--accent-primary), #7c3aed)'
                                }}
                              >
                                <LinkIcon size={12} />
                                <span>Link Standy</span>
                              </button>
                            )
                          )}

                          {/* Delete profile slot */}
                          <button
                            onClick={() => handleDeleteProfileSlot(profile._id)}
                            disabled={isLoading}
                            className="btn-primary btn-danger btn-action-icon"
                            style={{ margin: 0, padding: '6px' }}
                            title="Delete Profile Slot"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Expandable Link Input */}
                      {isLinkActive && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <input
                            type="text"
                            placeholder="Enter physical QR ID"
                            className="form-input"
                            value={qrValue}
                            onChange={(e) => setQrIdInputForProfile(prev => ({ ...prev, [profile._id]: e.target.value }))}
                            disabled={isLoading}
                            style={{ padding: '8px 10px', fontSize: '0.8rem', margin: 0, flex: 1 }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleConnectQrToProfile(profile._id);
                            }}
                          />
                          <button
                            onClick={() => handleConnectQrToProfile(profile._id)}
                            disabled={isLoading || !qrValue.trim()}
                            className="btn-primary"
                            style={{ margin: 0, width: 'auto', padding: '8px 14px', fontSize: '0.8rem' }}
                          >
                            {isLoading ? <span className="spinner spinner-tiny"></span> : 'Connect'}
                          </button>
                          <button
                            onClick={() => setShowLinkInputForProfile(prev => ({ ...prev, [profile._id]: false }))}
                            disabled={isLoading}
                            className="btn-primary btn-logout"
                            style={{ margin: 0, width: 'auto', padding: '8px 14px', fontSize: '0.8rem' }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
