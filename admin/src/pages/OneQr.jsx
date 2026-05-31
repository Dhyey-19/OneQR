import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Download, 
  UserPlus, 
  RefreshCw, 
  Search, 
  CheckCircle, 
  Link as LinkIcon,
  AlertCircle,
  Trash2,
  X,
  Edit2
} from 'lucide-react';
import { apiRequest } from '../services/apiService';

export default function OneQr() {
  const [qrs, setQrs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [generating, setGenerating] = useState(false);
  const [activeQrSearchId, setActiveQrSearchId] = useState(null);
  const [editingQrId, setEditingQrId] = useState(null);
  const [activeTab, setActiveTab] = useState('inactive');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [qrToDelete, setQrToDelete] = useState(null);
  const [confirmInputText, setConfirmInputText] = useState('');
  
  // Track selected user for each unassigned QR code: { [qrId]: userId }
  const [selectedUserForQr, setSelectedUserForQr] = useState({});
  // Track specific QR codes being assigned: { [qrId]: loadingStateBoolean }
  const [assigningState, setAssigningState] = useState({});

  // Track selected plan for each QR code: { [qrId]: planId }
  const [selectedPlanForQr, setSelectedPlanForQr] = useState({});


  const fetchData = async () => {
    setError('');
    try {
      const qrsRes = await apiRequest('/admin/qrs');
      const usersRes = await apiRequest('/admin/users');

      if (qrsRes.status === 'success') {
        setQrs(qrsRes.data);

        // Prepopulate mobile numbers and plans for the forms
        const initialUsers = {};
        const initialPlans = {};
        qrsRes.data.forEach(qr => {
          initialUsers[qr.qrId] = qr.assignedTo ? qr.assignedTo.phone : '';
          initialPlans[qr.qrId] = getBasePlanId(qr.plan);
        });
        setSelectedUserForQr(prev => ({ ...initialUsers, ...prev }));
        setSelectedPlanForQr(prev => ({ ...initialPlans, ...prev }));
      }
      if (usersRes.status === 'success') {
        setUsers(usersRes.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch QR codes.');
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

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    setSuccess('');
    try {
      const res = await apiRequest('/admin/qrs/generate', {
        method: 'POST',
      });
      if (res.status === 'success') {
        setSuccess('Successfully generated a new unique QR code!');
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to generate QR code.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (qrId, qrUrl) => {
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrUrl)}`);
      if (!response.ok) throw new Error('Network error');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `oneqr_${qrId}.png`);
      document.body.appendChild(link);
      
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError('Failed to download QR code image. Please try again.');
    }
  };

  const handleAssign = async (qrId) => {
    const typedPhone = selectedUserForQr[qrId];
    if (!typedPhone) {
      setError('Please select or type a user mobile number to assign.');
      return;
    }

    const matchedUser = users.find(u => u.phone === typedPhone.trim());
    if (!matchedUser) {
      setError('Selected mobile number is invalid or not registered.');
      return;
    }

    const userId = matchedUser.id;
    const planId = selectedPlanForQr[qrId] || 'free';

    setAssigningState(prev => ({ ...prev, [qrId]: true }));
    setError('');
    setSuccess('');

    try {
      const res = await apiRequest('/admin/qrs/assign', {
        method: 'POST',
        body: JSON.stringify({ qrId, userId, planId }),
      });

      if (res.status === 'success') {
        setEditingQrId(null);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to assign QR code.');
    } finally {
      setAssigningState(prev => ({ ...prev, [qrId]: false }));
    }
  };

  const startDeleteQr = (id, qrId) => {
    setQrToDelete({ id, qrId });
    setConfirmInputText('');
    setDeleteModalOpen(true);
  };

  const confirmDeletion = async () => {
    if (!qrToDelete) return;
    if (confirmInputText !== 'DELETE') return;
    
    const { id, qrId } = qrToDelete;
    setDeleteModalOpen(false);
    
    setError('');
    setSuccess('');
    try {
      const res = await apiRequest(`/admin/qrs/${id}`, {
        method: 'DELETE',
      });
      if (res.status === 'success') {
        setSuccess(`QR code "${qrId}" deleted successfully.`);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete QR code.');
    }
  };

  const handleSelectUser = (qrId, userId) => {
    setSelectedUserForQr(prev => ({ ...prev, [qrId]: userId }));
  };

  const handleSelectPlan = (qrId, planId) => {
    setSelectedPlanForQr(prev => ({ ...prev, [qrId]: planId }));
  };

  const formatPlanName = (plan) => {
    if (!plan || plan === 'free') return 'FREE';
    switch (plan) {
      case 'basic': return 'Basic';
      case 'premium': return 'Premium';
      case 'enterprise': return 'Enterprise';
      default: return plan.replace('_yearly', '').replace('_3yearly', '');
    }
  };

  const getPlanBadgeClass = (plan) => {
    if (!plan || plan === 'free') return 'badge-plan-free';
    const cleaned = plan.toLowerCase();
    if (cleaned.includes('basic')) return 'badge-plan-basic';
    if (cleaned.includes('premium')) return 'badge-plan-premium';
    if (cleaned.includes('enterprise')) return 'badge-plan-enterprise';
    return 'badge-plan-free';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getBasePlanId = (plan) => {
    if (!plan) return 'free';
    const cleaned = plan.toLowerCase();
    if (cleaned.startsWith('basic')) return 'basic';
    if (cleaned.startsWith('premium')) return 'premium';
    if (cleaned.startsWith('enterprise')) return 'enterprise';
    return 'free';
  };

  const startEditing = (qr) => {
    setEditingQrId(qr.qrId);
    setSelectedUserForQr(prev => ({
      ...prev,
      [qr.qrId]: qr.assignedTo ? qr.assignedTo.phone : ''
    }));
    setSelectedPlanForQr(prev => ({
      ...prev,
      [qr.qrId]: getBasePlanId(qr.plan)
    }));
  };



  // Filter QR codes by active/inactive tab and QR ID or target phone number
  const filteredQrs = qrs
    .filter(qr => activeTab === 'active' ? !!qr.assignedTo : !qr.assignedTo)
    .filter(qr => 
      qr.qrId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (qr.assignedTo && qr.assignedTo.phone && qr.assignedTo.phone.includes(searchQuery))
    );

  const totalQrs = qrs.length;
  const assignedQrs = qrs.filter(qr => qr.assignedTo).length;
  const unassignedQrs = totalQrs - assignedQrs;

  return (
    <div style={{ width: '100%' }}>
      <header className="dashboard-header">
        <div className="header-title">
          <h1>One QR Manager</h1>
          <p>Generate, download, and assign unique redirect QR codes to users</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
          <button 
            onClick={handleGenerate} 
            className="btn-primary"
            style={{ width: 'auto', padding: '12px 20px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}
            disabled={generating}
          >
            {generating ? (
              <span className="spinner" style={{ width: '18px', height: '18px', margin: 0 }}></span>
            ) : (
              <>
                <QrCode size={18} />
                <span>Generate QR Code</span>
              </>
            )}
          </button>
        </div>
      </header>

      {error && (
        <div className="alert-error" style={{ marginBottom: '24px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert-error" style={{ marginBottom: '24px', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)', color: '#a7f3d0' }}>
          <CheckCircle size={18} style={{ color: '#10b981' }} />
          <span>{success}</span>
        </div>
      )}

      {/* Metrics Summary Row */}
      <section className="stats-grid" style={{ marginBottom: '32px' }}>
        <div className="stat-card glass-panel">
          <div className="stat-info">
            <h3>Total QRs</h3>
            <div className="stat-number">{loading ? '...' : totalQrs}</div>
          </div>
          <div className="stat-icon">
            <QrCode size={24} />
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-info">
            <h3>Unassigned QRs</h3>
            <div className="stat-number">{loading ? '...' : unassignedQrs}</div>
          </div>
          <div className="stat-icon" style={{ color: 'var(--warning)' }}>
            <AlertCircle size={24} />
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-info">
            <h3>Assigned QRs</h3>
            <div className="stat-number">{loading ? '...' : assignedQrs}</div>
          </div>
          <div className="stat-icon" style={{ color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
        </div>
      </section>

      {/* QR Code Index Directory */}
      <section className="section-card glass-panel">
        <div className="section-header" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>QR Code Directory</h2>

            <div className="section-header-actions">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Search QR ID or phone..."
                  className="form-input"
                  style={{ padding: '10px 12px 10px 36px', fontSize: '0.85rem' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={16} className="input-icon" style={{ left: '12px' }} />
              </div>

              <div className="actions-button-group">
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

          {/* Directory Status Tabs */}
          <div className="directory-tabs" style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--glass-border)',
            paddingBottom: '8px',
            marginTop: '8px'
          }}>
            <button
              onClick={() => {
                setActiveTab('inactive');
                setEditingQrId(null);
              }}
              className={`tab-btn directory-tab-button ${activeTab === 'inactive' ? 'active' : ''}`}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: activeTab === 'inactive' ? 'rgba(236, 72, 153, 0.3)' : 'transparent',
                background: activeTab === 'inactive' ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(236, 72, 153, 0.05))' : 'transparent',
                color: activeTab === 'inactive' ? 'var(--accent-secondary)' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Inactive QRs</span>
              <span style={{
                background: activeTab === 'inactive' ? 'var(--accent-secondary)' : 'rgba(255, 255, 255, 0.1)',
                color: activeTab === 'inactive' ? '#fff' : 'var(--text-muted)',
                padding: '2px 8px',
                borderRadius: '20px',
                fontSize: '0.75rem'
              }}>
                {loading ? '...' : unassignedQrs}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('active');
                setEditingQrId(null);
              }}
              className={`tab-btn directory-tab-button ${activeTab === 'active' ? 'active' : ''}`}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: activeTab === 'active' ? 'rgba(124, 58, 237, 0.3)' : 'transparent',
                background: activeTab === 'active' ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(124, 58, 237, 0.05))' : 'transparent',
                color: activeTab === 'active' ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Active QRs</span>
              <span style={{
                background: activeTab === 'active' ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)',
                color: activeTab === 'active' ? '#fff' : 'var(--text-muted)',
                padding: '2px 8px',
                borderRadius: '20px',
                fontSize: '0.75rem'
              }}>
                {loading ? '...' : assignedQrs}
              </span>
            </button>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="table-loading">
              <div className="spinner"></div>
              <p>Loading QR codes directory...</p>
            </div>
          ) : filteredQrs.length === 0 ? (
            <div className="table-empty">
              <p>No QR codes found matching your query.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>QR ID</th>
                  <th>Created At</th>
                  <th>Status</th>
                  <th>Plan</th>
                  <th>Assigned Mobile</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQrs.map((qr) => {
                  const isEditing = editingQrId === qr.qrId;
                  return (
                    <tr key={qr._id}>
                      <td data-label="QR ID">
                        <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.9rem' }}>{qr.qrId}</span>
                      </td>
                      <td data-label="Created At" style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {formatDate(qr.createdAt)}
                      </td>
                      <td data-label="Status">
                        {qr.assignedTo ? (
                          <span className="badge badge-status-active">
                            Active
                          </span>
                        ) : (
                          <span className="badge badge-status-inactive">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td data-label="Plan" className={isEditing ? 'editing-cell' : ''}>
                        {isEditing ? (
                          <select
                            className="form-input"
                            value={selectedPlanForQr[qr.qrId] || 'free'}
                            onChange={(e) => handleSelectPlan(qr.qrId, e.target.value)}
                            disabled={assigningState[qr.qrId]}
                            style={{ width: '100%', margin: 0, padding: '8px' }}
                          >
                            <option value="free">FREE</option>
                            <option value="basic">Basic</option>
                            <option value="premium">Premium</option>
                            <option value="enterprise">Enterprise</option>
                          </select>
                        ) : (
                          qr.assignedTo ? (
                            <span className={`badge ${getPlanBadgeClass(qr.plan)}`}>
                              {formatPlanName(qr.plan)}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>-</span>
                          )
                        )}
                      </td>
                      <td data-label="Assigned Mobile" className={isEditing ? 'editing-cell' : ''}>
                        {isEditing ? (
                          <div style={{ position: 'relative', width: '100%', maxWidth: '180px' }} className="mobile-width-full">
                            <input
                              type="text"
                              placeholder="Type mobile..."
                              className="form-input select-user-assign"
                              value={selectedUserForQr[qr.qrId] || ''}
                              onChange={(e) => {
                                handleSelectUser(qr.qrId, e.target.value);
                                setActiveQrSearchId(qr.qrId);
                              }}
                              onFocus={() => setActiveQrSearchId(qr.qrId)}
                              onBlur={() => {
                                // Delay slightly to let click register
                                setTimeout(() => setActiveQrSearchId(null), 200);
                              }}
                              disabled={assigningState[qr.qrId]}
                              style={{ width: '100%', margin: 0, padding: '8px 10px' }}
                            />
                            
                            {activeQrSearchId === qr.qrId && (
                              <div className="glass-panel" style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                maxHeight: '180px',
                                overflowY: 'auto',
                                zIndex: 10,
                                marginTop: '4px',
                                border: '1px solid var(--glass-border)',
                                boxShadow: 'var(--shadow)',
                                background: 'var(--select-option-bg)',
                                borderRadius: '8px',
                                padding: '4px 0'
                              }}>
                                {users
                                  .filter(u => u.phone && u.phone.includes(selectedUserForQr[qr.qrId] || ''))
                                  .map(u => (
                                    <div
                                      key={u.id}
                                      onMouseDown={(e) => {
                                        e.preventDefault(); // Prevents input blur
                                        handleSelectUser(qr.qrId, u.phone);
                                        setActiveQrSearchId(null);
                                      }}
                                      style={{
                                        padding: '8px 12px',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        color: 'var(--text-primary)',
                                        textAlign: 'left',
                                        transition: 'background 0.2s'
                                      }}
                                      className="suggestion-item"
                                    >
                                      {u.phone}
                                    </div>
                                  ))}
                                {users.filter(u => u.phone && u.phone.includes(selectedUserForQr[qr.qrId] || '')).length === 0 && (
                                  <div style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'left' }}>
                                    No matches
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          qr.assignedTo ? (
                            <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{qr.assignedTo.phone}</span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>-</span>
                          )
                        )}
                      </td>
                      <td data-label="Actions" className="stack-mobile actions-cell">
                        {isEditing ? (
                          <div className="actions-wrapper">
                            <button
                              onClick={() => handleAssign(qr.qrId)}
                              className="btn-primary"
                              style={{ margin: 0, width: 'auto', padding: '8px 14px' }}
                              disabled={assigningState[qr.qrId] || !selectedUserForQr[qr.qrId]}
                            >
                              {assigningState[qr.qrId] ? (
                                <span className="spinner spinner-tiny"></span>
                              ) : (
                                <span>Save</span>
                              )}
                            </button>
                            <button
                              onClick={() => setEditingQrId(null)}
                              className="btn-primary btn-danger"
                              style={{ margin: 0, width: 'auto', padding: '8px 14px' }}
                              disabled={assigningState[qr.qrId]}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="actions-wrapper">
                            {/* Download button */}
                            <button 
                              onClick={() => handleDownload(qr.qrId, qr.qrUrl)}
                              className="btn-primary btn-action-icon"
                              title="Download QR Image"
                            >
                              <Download size={14} />
                            </button>

                            {/* Delete button */}
                            <button 
                              onClick={() => startDeleteQr(qr._id, qr.qrId)}
                              className="btn-primary btn-action-icon btn-danger"
                              title="Delete QR Code"
                            >
                              <Trash2 size={14} />
                            </button>

                            {/* Edit / Assign button */}
                            {qr.assignedTo ? (
                              <button 
                                onClick={() => startEditing(qr)}
                                className="btn-primary btn-action-icon"
                                style={{ background: 'linear-gradient(135deg, var(--accent-primary), #7c3aed)' }}
                                title="Edit Fields"
                              >
                                <Edit2 size={14} />
                              </button>
                            ) : (
                              <button 
                                onClick={() => startEditing(qr)}
                                className="btn-primary btn-action-icon"
                                style={{ background: 'linear-gradient(135deg, var(--accent-secondary), #ec4899)' }}
                                title="Assign User & Plan"
                              >
                                <UserPlus size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Custom Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                padding: '10px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Trash2 size={24} />
              </div>
              <h3 className="modal-title" style={{ margin: 0 }}>
                Delete QR Code
              </h3>
            </div>

            {/* Content */}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '20px' }}>
              Are you sure you want to delete QR code <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>"{qrToDelete?.qrId}"</strong>? This action is permanent.
            </p>

            {/* Input field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: '600',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Type <strong style={{ color: 'var(--text-primary)' }}>DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                placeholder="DELETE"
                value={confirmInputText}
                onChange={(e) => setConfirmInputText(e.target.value)}
                className="form-input"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && confirmInputText === 'DELETE') {
                    confirmDeletion();
                  }
                }}
              />
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="btn-primary"
                style={{
                  margin: 0,
                  width: 'auto',
                  padding: '10px 18px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletion}
                disabled={confirmInputText !== 'DELETE'}
                className="btn-primary"
                style={{
                  margin: 0,
                  width: 'auto',
                  padding: '10px 18px',
                  background: confirmInputText === 'DELETE' 
                    ? 'var(--danger)' 
                    : 'rgba(239, 68, 68, 0.1)',
                  color: confirmInputText === 'DELETE' ? '#fff' : 'rgba(239, 68, 68, 0.4)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: confirmInputText === 'DELETE' ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  fontWeight: '600'
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
