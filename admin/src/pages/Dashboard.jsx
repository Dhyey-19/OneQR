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
  X
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

  const formatPlanName = (plan) => {
    if (!plan) return 'Free';
    return plan.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getPlanBadgeClass = (plan) => {
    if (!plan || plan === 'free') return 'badge-plan-free';
    if (plan.includes('pro')) return 'badge-plan-pro';
    return 'badge-plan-starter';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate premium users
  const activeSubs = users.filter(u => u.subscriptionStatus === 'active').length;

  return (
    <div className="dashboard-layout">
      {/* Mobile Top Header Bar */}
      <div className="mobile-header-bar glass-panel mobile-only">
        <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <span className="sidebar-logo-text">OneQR Admin</span>
        <div className="admin-badge-dot"></div>
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

        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <QrCode size={20} color="#fff" />
          </div>
          <span className="sidebar-logo-text">OneQR Admin</span>
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

        <div className="sidebar-footer">
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
                <Shield size={14} style={{ marginRight: '6px', color: '#8b5cf6' }} />
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
                    {loading ? '...' : activeSubs}
                  </div>
                </div>
                <div className="stat-icon" style={{ color: '#ec4899' }}>
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
                        <th>Plan Level</th>
                        <th>Status</th>
                        <th>Expires At</th>
                        <th>Profiles Created</th>
                        <th>Registration Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td data-label="Mobile Number">
                            <div className="user-phone-cell">
                              <div className="user-avatar">
                                {user.phone ? user.phone.slice(-2) : 'U'}
                              </div>
                              <span style={{ fontWeight: '600' }}>{user.phone}</span>
                            </div>
                          </td>
                          <td data-label="Plan Level">
                            <span className={`badge ${getPlanBadgeClass(user.plan)}`}>
                              {formatPlanName(user.plan)}
                            </span>
                          </td>
                          <td data-label="Status">
                            <span className={`badge ${user.subscriptionStatus === 'active' ? 'badge-status-active' : 'badge-status-inactive'}`}>
                              {user.subscriptionStatus || 'inactive'}
                            </span>
                          </td>
                          <td data-label="Expires At" style={{ color: user.subscriptionExpiresAt ? '#fff' : 'var(--text-muted)' }}>
                            {user.subscriptionExpiresAt ? formatDate(user.subscriptionExpiresAt) : 'Lifetime Free'}
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
    </div>
  );
}
