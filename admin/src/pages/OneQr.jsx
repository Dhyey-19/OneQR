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
  X
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
  
  // Track selected user for each unassigned QR code: { [qrId]: userId }
  const [selectedUserForQr, setSelectedUserForQr] = useState({});
  // Track specific QR codes being assigned: { [qrId]: loadingStateBoolean }
  const [assigningState, setAssigningState] = useState({});

  // Track selected plan for each QR code: { [qrId]: planId }
  const [selectedPlanForQr, setSelectedPlanForQr] = useState({});
  // Track specific QR codes having plans assigned: { [qrId]: loadingStateBoolean }
  const [assigningPlanState, setAssigningPlanState] = useState({});

  const fetchData = async () => {
    setError('');
    try {
      const qrsRes = await apiRequest('/admin/qrs');
      const usersRes = await apiRequest('/admin/users');

      if (qrsRes.status === 'success') {
        setQrs(qrsRes.data);
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
    const userId = selectedUserForQr[qrId];
    if (!userId) {
      setError('Please select a user to assign.');
      return;
    }

    setAssigningState(prev => ({ ...prev, [qrId]: true }));
    setError('');
    setSuccess('');

    try {
      const res = await apiRequest('/admin/qrs/assign', {
        method: 'POST',
        body: JSON.stringify({ qrId, userId }),
      });

      if (res.status === 'success') {
        setSuccess(`QR code ${qrId} successfully assigned to user!`);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to assign QR code.');
    } finally {
      setAssigningState(prev => ({ ...prev, [qrId]: false }));
    }
  };

  const handleDeleteQr = async (id, qrId) => {
    const confirmation = window.prompt(`To delete QR code "${qrId}", please type 'DELETE' below:`);
    if (confirmation !== 'DELETE') {
      if (confirmation !== null) {
        setError('Incorrect confirmation text. QR code was not deleted.');
      }
      return;
    }

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

  const handleDeleteAllQrs = async () => {
    const confirmed = window.confirm('Are you absolutely sure you want to delete ALL generated QR codes? This action is permanent and will unlink them from user profiles.');
    if (!confirmed) return;

    setError('');
    setSuccess('');
    try {
      const res = await apiRequest('/admin/qrs', {
        method: 'DELETE',
      });
      if (res.status === 'success') {
        setSuccess('All QR codes deleted successfully.');
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete all QR codes.');
    }
  };

  const handleSelectUser = (qrId, userId) => {
    setSelectedUserForQr(prev => ({ ...prev, [qrId]: userId }));
  };

  const handleSelectPlan = (qrId, planId) => {
    setSelectedPlanForQr(prev => ({ ...prev, [qrId]: planId }));
  };

  const formatPlanName = (plan) => {
    if (!plan) return 'Free';
    return plan.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getPlanBadgeClass = (plan) => {
    if (!plan || plan === 'free') return 'badge-plan-free';
    if (plan.includes('pro')) return 'badge-plan-pro';
    return 'badge-plan-starter';
  };

  const handleAssignPlan = async (qrId) => {
    const planId = selectedPlanForQr[qrId];
    if (!planId) {
      setError('Please select a plan to assign.');
      return;
    }

    setAssigningPlanState(prev => ({ ...prev, [qrId]: true }));
    setError('');
    setSuccess('');

    try {
      const res = await apiRequest('/admin/qrs/assign-plan', {
        method: 'POST',
        body: JSON.stringify({ qrId, planId }),
      });

      if (res.status === 'success') {
        setSuccess(`Plan successfully updated for QR code!`);
        // Reset selection for this QR
        setSelectedPlanForQr(prev => ({ ...prev, [qrId]: '' }));
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to assign plan.');
    } finally {
      setAssigningPlanState(prev => ({ ...prev, [qrId]: false }));
    }
  };

  // Filter QR codes by QR ID or target phone number
  const filteredQrs = qrs.filter(qr => 
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
          {totalQrs > 0 && (
            <button 
              onClick={handleDeleteAllQrs} 
              className="btn-primary btn-danger"
              style={{ width: 'auto', padding: '12px 20px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Trash2 size={18} />
              <span>Delete All QRs</span>
            </button>
          )}

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
        <div className="section-header">
          <h2 className="section-title">QR Code Directory</h2>

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
                  <th>Target URL</th>
                  <th>Visuals</th>
                  <th>Assignment Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQrs.map((qr) => (
                  <tr key={qr._id}>
                    <td data-label="QR ID">
                      <div className="user-phone-cell">
                        <div className="user-avatar" style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent-secondary)' }}>
                          QR
                        </div>
                        <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{qr.qrId}</span>
                      </div>
                    </td>
                    <td data-label="Target URL" className="stack-mobile">
                      <a 
                        href={qr.qrUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="qr-target-link"
                      >
                        <LinkIcon size={12} />
                        <span>{qr.qrUrl.replace('https://', '')}</span>
                      </a>
                    </td>
                    <td data-label="Visuals">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=48&hidesource=1&data=${encodeURIComponent(qr.qrUrl)}`} 
                        alt="Preview" 
                        className="qr-preview-img"
                      />
                    </td>
                    <td data-label="Assignment Status">
                      {qr.assignedTo ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                          <span className="badge badge-status-active">
                            Assigned: {qr.assignedTo.phone}
                          </span>
                          <span className={`badge ${getPlanBadgeClass(qr.plan)}`}>
                            Plan: {formatPlanName(qr.plan)}
                          </span>
                          {qr.planAssignedByAdmin && (
                            <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#c084fc', borderColor: 'rgba(139, 92, 246, 0.2)', fontSize: '0.65rem', padding: '2px 6px', textTransform: 'none' }}>
                              Assigned by Admin
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="badge badge-status-inactive" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fcd34d', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td data-label="Actions" className="stack-mobile actions-cell">
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
                          onClick={() => handleDeleteQr(qr._id, qr.qrId)}
                          className="btn-primary btn-action-icon btn-danger"
                          title="Delete QR Code"
                        >
                          <Trash2 size={14} />
                        </button>

                        {/* Assign form (only if unassigned) */}
                        {!qr.assignedTo && (
                          <div className="assign-inline-form">
                            <select
                              className="form-input select-user-assign"
                              value={selectedUserForQr[qr.qrId] || ''}
                              onChange={(e) => handleSelectUser(qr.qrId, e.target.value)}
                              disabled={assigningState[qr.qrId]}
                            >
                              <option value="">-- Choose User --</option>
                              {users.map(u => (
                                <option key={u.id} value={u.id}>
                                  {u.phone} ({u.plan})
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => handleAssign(qr.qrId)}
                              className="btn-primary btn-assign-submit"
                              disabled={assigningState[qr.qrId] || !selectedUserForQr[qr.qrId]}
                            >
                              {assigningState[qr.qrId] ? (
                                <span className="spinner spinner-tiny"></span>
                              ) : (
                                <>
                                  <UserPlus size={14} />
                                  <span>Assign</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {/* Assign Plan form (only if assigned) */}
                        {qr.assignedTo && (
                          <div className="assign-inline-form">
                            <select
                              className="form-input select-user-assign"
                              value={selectedPlanForQr[qr._id] || ''}
                              onChange={(e) => handleSelectPlan(qr._id, e.target.value)}
                              disabled={assigningPlanState[qr._id]}
                            >
                              <option value="">-- Choose Plan --</option>
                              <option value="free">Free</option>
                              <option value="basic_yearly">Basic Yearly</option>
                              <option value="basic_3yearly">Basic 3 Years</option>
                              <option value="premium_yearly">Premium Yearly</option>
                              <option value="premium_3yearly">Premium 3 Years</option>
                              <option value="enterprise_yearly">Enterprise Yearly</option>
                              <option value="enterprise_3yearly">Enterprise 3 Years</option>
                            </select>

                            <button
                              onClick={() => handleAssignPlan(qr._id)}
                              className="btn-primary btn-assign-submit"
                              style={{ background: 'linear-gradient(135deg, var(--accent-primary), #7c3aed)' }}
                              disabled={assigningPlanState[qr._id] || !selectedPlanForQr[qr._id]}
                            >
                              {assigningPlanState[qr._id] ? (
                                <span className="spinner spinner-tiny"></span>
                              ) : (
                                <>
                                  <UserPlus size={14} />
                                  <span>Assign Plan</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
