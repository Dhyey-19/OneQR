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
  Sun,
  Moon
} from 'lucide-react';
import { apiRequest } from '../services/apiService';
import { authService } from '../services/authService';
import OneQr from './OneQr';

export default function Dashboard({ onLogout, theme, toggleTheme }) {
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
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s'
          }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
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
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
              opacity: 0.8
            }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
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
    </div>
  );
}
