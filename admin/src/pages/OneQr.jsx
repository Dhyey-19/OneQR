import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Download, 
  UserPlus, 
  RefreshCw, 
  Search, 
  CheckCircle, 
  Link as LinkIcon,
  AlertCircle
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
      // Fetch the QR code image from the public qrserver API
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

  const handleSelectUser = (qrId, userId) => {
    setSelectedUserForQr(prev => ({ ...prev, [qrId]: userId }));
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

        <button 
          onClick={handleGenerate} 
          className="btn-primary"
          style={{ width: 'auto', padding: '12px 24px', marginTop: 0 }}
          disabled={generating}
        >
          {generating ? (
            <span className="spinner" style={{ width: '18px', height: '18px', margin: 0 }}></span>
          ) : (
            <>
              <QrCode size={18} />
              Generate QR Code
            </>
          )}
        </button>
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

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="input-wrapper" style={{ minWidth: '240px' }}>
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
            <>
              {/* Desktop Table View */}
              <table className="admin-table desktop-only">
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
                      <td>
                        <div className="user-phone-cell">
                          <div className="user-avatar" style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent-secondary)' }}>
                            QR
                          </div>
                          <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{qr.qrId}</span>
                        </div>
                      </td>
                      <td>
                        <a 
                          href={qr.qrUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', textDecoration: 'underline' }}
                        >
                          <LinkIcon size={12} />
                          {qr.qrUrl.replace('https://', '')}
                        </a>
                      </td>
                      <td>
                        {/* Mini visual QR code preview using API */}
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=48&hidesource=1&data=${encodeURIComponent(qr.qrUrl)}`} 
                          alt="Preview" 
                          style={{ width: '36px', height: '36px', borderRadius: '4px', background: '#fff', padding: '2px', border: '1px solid var(--glass-border)' }}
                        />
                      </td>
                      <td>
                        {qr.assignedTo ? (
                          <span className="badge badge-status-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle size={10} />
                            Assigned: {qr.assignedTo.phone}
                          </span>
                        ) : (
                          <span className="badge badge-status-inactive" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.1)', color: '#fcd34d', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                            <AlertCircle size={10} />
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          {/* Download button */}
                          <button 
                            onClick={() => handleDownload(qr.qrId, qr.qrUrl)}
                            className="btn-primary"
                            style={{ width: 'auto', padding: '8px 12px', margin: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', boxShadow: 'none' }}
                            title="Download QR Image"
                          >
                            <Download size={14} />
                          </button>

                          {/* Assign form (only if unassigned) */}
                          {!qr.assignedTo && (
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <select
                                className="form-input"
                                style={{ padding: '6px 12px', fontSize: '0.85rem', width: '160px', height: '34px', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
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
                                className="btn-primary"
                                style={{ width: 'auto', padding: '8px 12px', margin: 0, height: '34px', background: 'var(--accent-secondary)' }}
                                disabled={assigningState[qr.qrId] || !selectedUserForQr[qr.qrId]}
                              >
                                {assigningState[qr.qrId] ? (
                                  <span className="spinner" style={{ width: '14px', height: '14px', margin: 0 }}></span>
                                ) : (
                                  <>
                                    <UserPlus size={14} />
                                    Assign
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

              {/* Mobile Cards View */}
              <div className="mobile-only mobile-cards-grid">
                {filteredQrs.map((qr) => (
                  <div key={qr._id} className="mobile-user-card glass-panel">
                    <div className="mobile-user-header">
                      <div className="user-phone-cell">
                        <div className="user-avatar" style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent-secondary)' }}>
                          QR
                        </div>
                        <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{qr.qrId}</span>
                      </div>
                      
                      {/* Visual QR Code mini preview */}
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=48&hidesource=1&data=${encodeURIComponent(qr.qrUrl)}`} 
                        alt="Preview" 
                        style={{ width: '36px', height: '36px', borderRadius: '4px', background: '#fff', padding: '2px', border: '1px solid var(--glass-border)' }}
                      />
                    </div>

                    <div className="mobile-user-details">
                      <div className="detail-row flex-col items-start gap-1">
                        <span className="detail-label">Target URL</span>
                        <a 
                          href={qr.qrUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs truncate max-w-full text-indigo-400 underline flex items-center gap-1"
                        >
                          <LinkIcon size={12} className="shrink-0" />
                          <span className="truncate">{qr.qrUrl.replace('https://', '')}</span>
                        </a>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">Status</span>
                        {qr.assignedTo ? (
                          <span className="badge badge-status-active" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle size={10} />
                            Assigned: {qr.assignedTo.phone}
                          </span>
                        ) : (
                          <span className="badge badge-status-inactive" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.1)', color: '#fcd34d', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                            <AlertCircle size={10} />
                            Unassigned
                          </span>
                        )}
                      </div>

                      <div className="detail-row flex-col items-stretch gap-3 pt-3 border-t border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="detail-label">Actions</span>
                          <button 
                            onClick={() => handleDownload(qr.qrId, qr.qrUrl)}
                            className="btn-primary"
                            style={{ width: 'auto', padding: '8px 16px', margin: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', boxShadow: 'none' }}
                          >
                            <Download size={14} style={{ marginRight: '6px' }} />
                            <span>Download QR</span>
                          </button>
                        </div>

                        {/* Assign input on mobile */}
                        {!qr.assignedTo && (
                          <div className="flex flex-col gap-2 mt-1">
                            <select
                              className="form-input"
                              style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%', height: '38px', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
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
                              className="btn-primary"
                              style={{ width: '100%', padding: '10px 14px', margin: 0, height: '38px', background: 'var(--accent-secondary)' }}
                              disabled={assigningState[qr.qrId] || !selectedUserForQr[qr.qrId]}
                            >
                              {assigningState[qr.qrId] ? (
                                <span className="spinner" style={{ width: '14px', height: '14px', margin: 0 }}></span>
                              ) : (
                                <>
                                  <UserPlus size={14} />
                                  <span>Assign User</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
