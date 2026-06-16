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
  X,
  Edit2,
  Camera,
  Scan,
  Layers,
  Calendar
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import JSZip from 'jszip';
import { apiRequest } from '../services/apiService';

export default function OneQr() {
  const [qrs, setQrs] = useState([]);
  const [users, setUsers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [generateQuantity, setGenerateQuantity] = useState(10);
  const [generateQrType, setGenerateQrType] = useState('4x6');
  const [activeTab, setActiveTab] = useState('inactive');
  const [managerView, setManagerView] = useState('batches');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState({});
  const [downloadProgress, setDownloadProgress] = useState({});

  // Quick Scan & Edit States
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [scanTab, setScanTab] = useState('camera'); // 'camera' | 'search'
  const [manualSearchId, setManualSearchId] = useState('');
  const [modalScanStatus, setModalScanStatus] = useState('idle'); // 'idle' | 'scanning' | 'success' | 'error' | 'editing'
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [scannedQr, setScannedQr] = useState(null);
  const [modalSelectedUser, setModalSelectedUser] = useState('');
  const [modalSelectedPlan, setModalSelectedPlan] = useState('free');
  const [modalUserSearchActive, setModalUserSearchActive] = useState(false);
  const [modalSaving, setModalSaving] = useState(false);


  const fetchData = async () => {
    setError('');
    try {
      const qrsRes = await apiRequest('/admin/qrs');
      const usersRes = await apiRequest('/admin/users');
      const batchesRes = await apiRequest('/admin/batches');

      if (qrsRes.status === 'success') {
        setQrs(qrsRes.data);
      }
      if (usersRes.status === 'success') {
        setUsers(usersRes.data);
      }
      if (batchesRes.status === 'success') {
        setBatches(batchesRes.data);
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

  const parseQrIdFromScannedText = (text) => {
    if (!text) return '';
    try {
      let cleanText = text.trim();
      if (!cleanText) return '';
      
      if (cleanText.toLowerCase().startsWith('http://') || cleanText.toLowerCase().startsWith('https://')) {
        const url = new URL(cleanText);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length > 0) {
          return parts[parts.length - 1];
        }
      }
      
      if (cleanText.includes('/')) {
        const parts = cleanText.split('/').filter(Boolean);
        if (parts.length > 0) {
          return parts[parts.length - 1];
        }
      }
      
      return cleanText;
    } catch (e) {
      console.error("Error parsing QR ID from scan:", e);
      return text.trim();
    }
  };

  const processFoundQrId = (qrId) => {
    if (!qrId || !qrId.trim()) {
      setModalScanStatus('error');
      setModalErrorMessage('Please enter a valid QR Code ID.');
      return;
    }

    const match = qrs.find(q => q.qrId.toLowerCase() === qrId.trim().toLowerCase());
    if (!match) {
      setModalScanStatus('error');
      setModalErrorMessage(`QR Code "${qrId}" not found in the system.`);
      return;
    }

    setScannedQr(match);
    setModalSelectedUser(match.assignedTo ? match.assignedTo.phone : '');
    setModalSelectedPlan(getBasePlanId(match.plan));
    setModalErrorMessage('');
    setModalScanStatus('editing');
  };

  const handleScannedText = (text) => {
    const parsedId = parseQrIdFromScannedText(text);
    if (!parsedId) {
      setModalScanStatus('error');
      setModalErrorMessage('Invalid QR Code format.');
      return;
    }
    processFoundQrId(parsedId);
  };

  const executeAssignFlow = async (userId, planId, qrId) => {
    // 1. Fetch user's profiles
    const profilesRes = await apiRequest(`/admin/users/${userId}/profiles`);
    if (profilesRes.status !== 'success') {
      throw new Error(profilesRes.message || 'Failed to fetch user profiles.');
    }
    
    const profiles = profilesRes.data || [];
    
    // 2. Find an existing slot of the same plan tier that has no QR connected
    const existingSlot = profiles.find(p => p.plan === planId && !p.slug);
    
    let targetProfileId;
    if (existingSlot) {
      targetProfileId = existingSlot._id;
    } else {
      // 3. Create a new plan slot first
      const assignPlanRes = await apiRequest('/admin/users/assign-plan', {
        method: 'POST',
        body: JSON.stringify({ userId, planId })
      });
      if (assignPlanRes.status !== 'success') {
        throw new Error(assignPlanRes.message || 'Failed to assign plan to user.');
      }
      targetProfileId = assignPlanRes.data._id;
    }
    
    // 4. Connect the QR to the profile slot
    const connectRes = await apiRequest('/admin/profiles/connect-qr', {
      method: 'POST',
      body: JSON.stringify({ profileId: targetProfileId, qrId })
    });
    
    if (connectRes.status !== 'success') {
      throw new Error(connectRes.message || 'Failed to connect QR to profile.');
    }
    
    return connectRes;
  };

  const handleModalSave = async () => {
    if (!scannedQr) return;

    if (!modalSelectedUser) {
      setModalErrorMessage('Please select or type a user mobile number.');
      return;
    }

    const matchedUser = users.find(u => u.phone === modalSelectedUser.trim());
    if (!matchedUser) {
      setModalErrorMessage('Selected mobile number is invalid or not registered.');
      return;
    }

    const qrId = scannedQr.qrId;
    const userId = matchedUser.id;
    const planId = modalSelectedPlan || 'free';

    setModalSaving(true);
    setModalErrorMessage('');

    try {
      const res = await executeAssignFlow(userId, planId, qrId);

      if (res.status === 'success') {
        setSuccess(`Successfully updated QR Code ${qrId}`);
        setScanModalOpen(false);
        setScannedQr(null);
        setModalSelectedUser('');
        setModalSelectedPlan('free');
        setModalScanStatus('idle');
        fetchData();
      }
    } catch (err) {
      setModalErrorMessage(err.message || 'Failed to update assignment.');
    } finally {
      setModalSaving(false);
    }
  };

  // Camera scanner lifecycle for Admin Quick Scan modal
  useEffect(() => {
    let html5QrcodeInstance = null;

    if (scanModalOpen && scanTab === 'camera' && modalScanStatus === 'idle') {
      setCameraError('');
      const timer = setTimeout(() => {
        const scannerId = "admin-qr-reader-container";
        const container = document.getElementById(scannerId);
        if (!container) {
          console.error("Admin scanner container not found in DOM");
          return;
        }

        html5QrcodeInstance = new Html5Qrcode(scannerId);
        html5QrcodeInstance.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 220, height: 220 },
          },
          (decodedText) => {
            handleScannedText(decodedText);
            if (html5QrcodeInstance && html5QrcodeInstance.isScanning) {
              html5QrcodeInstance.stop().catch(err => console.error("Error stopping scanner:", err));
            }
          },
          (errorMessage) => {
            // Verbose debug info from scanner, safe to ignore
          }
        ).catch(err => {
          console.error("Admin camera access error:", err);
          setCameraError("Camera access denied or no camera device available. Please check permissions.");
        });
      }, 300);

      return () => {
        clearTimeout(timer);
        if (html5QrcodeInstance && html5QrcodeInstance.isScanning) {
          html5QrcodeInstance.stop()
            .then(() => html5QrcodeInstance.clear())
            .catch(err => console.error("Error stopping/clearing scanner:", err));
        }
      };
    }
  }, [scanModalOpen, scanTab, modalScanStatus]);

  const handleGenerate = async (quantityVal, qrTypeVal) => {
    setGenerating(true);
    setError('');
    setSuccess('');
    const qty = parseInt(quantityVal) || 1;
    const type = qrTypeVal || '4x6';
    try {
      const res = await apiRequest('/admin/qrs/generate', {
        method: 'POST',
        body: JSON.stringify({ quantity: qty, qrType: type })
      });
      if (res.status === 'success') {
        setSuccess(`Successfully generated ${qty} new unique QR code(s) in batch ${res.data?.batch?.batchId || ''}!`);
        setGenerateModalOpen(false);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Failed to generate QR code.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (qrId) => {
    try {
      const qrUrlPrefix = import.meta.env.VITE_QR_URL_PREFIX || 'http://localhost:5000/qr';
      const cleanPrefix = qrUrlPrefix.endsWith('/') ? qrUrlPrefix : `${qrUrlPrefix}/`;
      const finalQrUrl = `${cleanPrefix}${qrId}`;

      // Find QR in state to check its batch template type
      const matchedQr = qrs.find(q => q.qrId === qrId);
      const qrType = (matchedQr && matchedQr.batchId && matchedQr.batchId.qrType) || '4x6';

      // Set coordinates & template according to QR type
      let templateSrc = '/All In One 6x4.png';
      let canvasWidth = 1024;
      let canvasHeight = 1536;
      let qx = 340;
      let qy = 700;
      let qSize = 343;
      let radius = 24;

      if (qrType === '4x4') {
        templateSrc = '/All In One 4x4.png';
        canvasWidth = 1254;
        canvasHeight = 1254;
        const cx = 628;
        const cy = 761.5;
        const qrSize = 430;
        qx = cx - qrSize / 2;
        qy = cy - qrSize / 2;
        qSize = qrSize;
        radius = 26;
      }

      // 1. Fetch QR Code Image
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(finalQrUrl)}`;
      
      // Load both images using Promises
      const loadBackground = new Promise((resolve, reject) => {
        const img = new Image();
        img.src = templateSrc;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load background template.'));
      });

      const loadQr = new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Avoid tainted canvas
        img.src = qrApiUrl;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load QR code image from API.'));
      });

      const [bgImg, qrImg] = await Promise.all([loadBackground, loadQr]);

      // 2. Create Canvas matching the template dimensions
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');

      // 3. Draw Background
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // 4. Draw QR Code in the centered box with rounded corners and padding
      ctx.save();
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(qx, qy, qSize, qSize, radius);
      } else {
        ctx.moveTo(qx + radius, qy);
        ctx.arcTo(qx + qSize, qy, qx + qSize, qy + qSize, radius);
        ctx.arcTo(qx + qSize, qy + qSize, qx, qy + qSize, radius);
        ctx.arcTo(qx, qy + qSize, qx, qy, radius);
        ctx.arcTo(qx, qy, qx + qSize, qy, radius);
      }
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(qrImg, qx, qy, qSize, qSize);
      ctx.restore();

      // 5. Trigger download of the merged image
      canvas.toBlob((blob) => {
        if (!blob) {
          setError('Failed to generate final image.');
          return;
        }
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `oneqr_${qrId}.png`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 'image/png');

    } catch (err) {
      console.error(err);
      setError('Failed to download QR code image. Please try again.');
    }
  };



  const handleStatusChange = async (batchObjectId, newStatus) => {
    setError('');
    setSuccess('');
    try {
      const res = await apiRequest(`/admin/batches/${batchObjectId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.status === 'success') {
        setSuccess('Batch status updated successfully.');
        setBatches(prev => prev.map(b => b._id === batchObjectId ? { ...b, status: newStatus } : b));
        setSelectedBatch(prev => prev && prev._id === batchObjectId ? { ...prev, status: newStatus } : prev);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(res.message || 'Failed to update batch status.');
      }
    } catch (err) {
      setError(err.message || 'Failed to update batch status.');
    }
  };

  const handleDownloadBatch = async (batchObjectId, batchId, qrCount) => {
    setError('');
    setSuccess('');
    setDownloadLoading(prev => ({ ...prev, [batchObjectId]: true }));
    setDownloadProgress(prev => ({ ...prev, [batchObjectId]: { current: 0, total: qrCount } }));

    try {
      const matchedBatch = batches.find(b => b._id === batchObjectId);
      const qrType = (matchedBatch && matchedBatch.qrType) || '4x6';

      // Set coordinates & template according to QR type
      let templateSrc = '/All In One 6x4.png';
      let canvasWidth = 1024;
      let canvasHeight = 1536;
      let qx = 340;
      let qy = 700;
      let qSize = 343;
      let radius = 24;

      if (qrType === '4x4') {
        templateSrc = '/All In One 4x4.png';
        canvasWidth = 1254;
        canvasHeight = 1254;
        const cx = 628;
        const cy = 761.5;
        const qrSize = 430;
        qx = cx - qrSize / 2;
        qy = cy - qrSize / 2;
        qSize = qrSize;
        radius = 26;
      }

      // 1. Fetch all QR codes in this batch
      const res = await apiRequest(`/admin/batches/${batchObjectId}/qrs`);
      if (res.status !== 'success') {
        throw new Error(res.message || 'Failed to fetch QR codes for batch.');
      }

      const qrs = res.data || [];
      if (qrs.length === 0) {
        throw new Error('This batch has no QR codes to download.');
      }

      const zip = new JSZip();

      // 2. Load the background template image once
      const bgImg = await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = templateSrc;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load background template.'));
      });

      const qrUrlPrefix = import.meta.env.VITE_QR_URL_PREFIX || 'http://localhost:5000/qr';
      const cleanPrefix = qrUrlPrefix.endsWith('/') ? qrUrlPrefix : `${qrUrlPrefix}/`;

      // 3. Process each QR sequentially
      for (let idx = 0; idx < qrs.length; idx++) {
        const qr = qrs[idx];
        const finalQrUrl = `${cleanPrefix}${qr.qrId}`;
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(finalQrUrl)}`;

        // Update progress count
        setDownloadProgress(prev => ({
          ...prev,
          [batchObjectId]: { current: idx + 1, total: qrs.length }
        }));

        try {
          const qrImg = await new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Avoid tainted canvas
            img.src = qrApiUrl;
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load QR image for ${qr.qrId}`));
          });

          // Draw on canvas
          const canvas = document.createElement('canvas');
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          const ctx = canvas.getContext('2d');

          // Draw Background
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

          // Draw QR Code inside box
          ctx.save();
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(qx, qy, qSize, qSize, radius);
          } else {
            ctx.moveTo(qx + radius, qy);
            ctx.arcTo(qx + qSize, qy, qx + qSize, qy + qSize, radius);
            ctx.arcTo(qx + qSize, qy + qSize, qx, qy + qSize, radius);
            ctx.arcTo(qx, qy + qSize, qx, qy, radius);
            ctx.arcTo(qx, qy, qx + qSize, qy, radius);
          }
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(qrImg, qx, qy, qSize, qSize);
          ctx.restore();

          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
          if (blob) {
            zip.file(`oneqr_${qr.qrId}.png`, blob);
          }
        } catch (err) {
          console.error(`Error processing QR ${qr.qrId}:`, err);
        }
      }

      // 4. Generate and download ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `oneqr_batch_${batchId}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setSuccess(`Batch ${batchId} downloaded successfully!`);
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to download batch QR codes.');
    } finally {
      setDownloadLoading(prev => ({ ...prev, [batchObjectId]: false }));
      setDownloadProgress(prev => {
        const copy = { ...prev };
        delete copy[batchObjectId];
        return copy;
      });
    }
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
    setScannedQr(qr);
    setModalSelectedUser(qr.assignedTo ? qr.assignedTo.phone : '');
    setModalSelectedPlan(getBasePlanId(qr.plan));
    setModalErrorMessage('');
    setModalScanStatus('editing');
    setScanModalOpen(true);
  };



  // Filter QR codes by active/inactive tab, current selected batch (if in batch view), and search query
  const filteredQrs = qrs
    .filter(qr => activeTab === 'active' ? !!qr.assignedTo : !qr.assignedTo)
    .filter(qr => {
      if (managerView === 'batches' && selectedBatch) {
        return qr.batchId && qr.batchId._id === selectedBatch._id;
      }
      return true; // No batch filter in search view
    })
    .filter(qr => 
      qr.qrId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (qr.assignedTo && qr.assignedTo.phone && qr.assignedTo.phone.includes(searchQuery))
    );

  const totalQrs = qrs.length;
  const assignedQrs = qrs.filter(qr => qr.assignedTo).length;
  const unassignedQrs = totalQrs - assignedQrs;

  const renderQrTable = (qrsList) => {
    if (loading) {
      return (
        <div className="table-loading">
          <div className="spinner"></div>
          <p>Loading QR codes...</p>
        </div>
      );
    }

    if (qrsList.length === 0) {
      return (
        <div className="table-empty" style={{ border: '1px dashed #e2e8f0', borderRadius: '16px', padding: '32px' }}>
          <p>No QR codes found matching your filters.</p>
        </div>
      );
    }

    return (
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>QR ID</th>
              <th>Batch ID</th>
              <th>Created At</th>
              <th>Status</th>
              <th>Plan</th>
              <th>Assigned Mobile</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {qrsList.map((qr) => (
              <tr key={qr._id}>
                <td data-label="QR ID">
                  <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.9rem' }}>{qr.qrId}</span>
                </td>
                <td data-label="Batch ID">
                  {qr.batchId ? (
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', fontWeight: '600' }}>
                      {qr.batchId.batchId}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>-</span>
                  )}
                </td>
                <td data-label="Created At" style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {formatDate(qr.createdAt)}
                </td>
                <td data-label="Status">
                  {qr.assignedTo ? (
                    <span className="badge badge-status-active">Active</span>
                  ) : (
                    <span className="badge badge-status-inactive">Inactive</span>
                  )}
                </td>
                <td data-label="Plan">
                  {qr.assignedTo ? (
                    <span className={`badge ${getPlanBadgeClass(qr.plan)}`}>
                      {formatPlanName(qr.plan)}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                  )}
                </td>
                <td data-label="Assigned Mobile">
                  {qr.assignedTo ? (
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{qr.assignedTo.phone}</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                  )}
                </td>
                <td data-label="Actions" className="stack-mobile actions-cell">
                  <div className="actions-wrapper">
                    <button 
                      onClick={() => handleDownload(qr.qrId)}
                      className="btn-primary btn-action-icon"
                      title="Download QR Image"
                    >
                      <Download size={14} />
                    </button>

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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      <header className="dashboard-header">
        <div className="header-title">
          <h1>One QR Manager</h1>
          <p>Generate, download, and assign unique redirect QR codes to users</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
          <button 
            onClick={() => {
              setScanModalOpen(true);
              setScanTab('camera');
              setModalScanStatus('idle');
              setScannedQr(null);
              setManualSearchId('');
              setModalErrorMessage('');
            }}
            className="btn-primary"
            style={{ width: 'auto', padding: '12px 20px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, var(--accent-secondary), #0284c7)' }}
          >
            <Scan size={18} />
            <span>Scan & Edit QR</span>
          </button>

          <button 
            onClick={() => {
              setGenerateQuantity(10);
              setGenerateModalOpen(true);
            }} 
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

      {/* View Switcher Tabs */}
      <div className="view-tabs" style={{ marginBottom: '24px' }}>
        <button
          className={`view-tab-btn ${managerView === 'batches' ? 'active' : ''}`}
          onClick={() => {
            setManagerView('batches');
            if (managerView === 'batches') {
              setSelectedBatch(null);
            }
          }}
        >
          Batches Directory
        </button>
        <button
          className={`view-tab-btn ${managerView === 'search' ? 'active' : ''}`}
          onClick={() => {
            setManagerView('search');
          }}
        >
          Global QR Search
        </button>
      </div>

      {/* Batches View */}
      {managerView === 'batches' && !selectedBatch && (
        <section className="section-card glass-panel" style={{ marginBottom: '32px' }}>
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
            <h2 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} color="var(--accent-primary)" />
              <span>QR Code Batches Directory</span>
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              Total Batches: {batches.length}
            </span>
          </div>

          {loading ? (
            <div className="table-loading">
              <div className="spinner"></div>
              <p>Loading batches...</p>
            </div>
          ) : batches.length === 0 ? (
            <div className="table-empty" style={{ border: '1px dashed #e2e8f0', borderRadius: '16px', padding: '32px' }}>
              <p>No batches generated yet. Click "Generate QR Code" to create one.</p>
            </div>
          ) : (
            <div className="batch-grid">
              {batches.map((batch) => {
                const isDownloading = downloadLoading[batch._id];
                const progress = downloadProgress[batch._id];
                const totalInBatch = batch.qrCount || 0;
                const assignedInBatch = qrs.filter(q => q.batchId && q.batchId._id === batch._id && q.assignedTo).length;
                const percent = totalInBatch > 0 ? Math.round((assignedInBatch / totalInBatch) * 100) : 0;
                
                return (
                  <div key={batch._id} className="batch-card">
                    <div>
                      <div className="batch-card-header">
                        <div className="batch-card-id" title={batch.batchId}>
                          Batch: {batch.batchId.substring(0, 8)}...
                        </div>
                        <span className={`badge`} style={{
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          color: batch.status === 'ordered' ? '#d97706' : 
                                 batch.status === 'printed' ? '#2563eb' : 
                                 batch.status === 'shipped' ? '#7c3aed' : '#059669',
                          background: batch.status === 'ordered' ? 'rgba(217, 119, 6, 0.08)' : 
                                      batch.status === 'printed' ? 'rgba(37, 99, 235, 0.08)' : 
                                      batch.status === 'shipped' ? 'rgba(124, 58, 237, 0.08)' : 'rgba(5, 150, 105, 0.08)',
                          border: batch.status === 'ordered' ? '1px solid rgba(217, 119, 6, 0.15)' : 
                                  batch.status === 'printed' ? '1px solid rgba(37, 99, 235, 0.15)' : 
                                  batch.status === 'shipped' ? '1px solid rgba(124, 58, 237, 0.15)' : '1px solid rgba(5, 150, 105, 0.15)',
                          padding: '4px 10px',
                          borderRadius: '20px'
                        }}>
                          {batch.status}
                        </span>
                      </div>

                      <div className="batch-card-meta">
                        <div className="batch-meta-item">
                          <Calendar size={14} />
                          <span>
                            {new Date(batch.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="batch-meta-item">
                          <Layers size={14} />
                          <span>Layout: {batch.qrType || '4x6'}</span>
                        </div>
                        <div className="batch-meta-item" style={{ justifyContent: 'space-between', width: '100%', marginTop: '8px' }}>
                          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                            Fulfillment Progress:
                          </span>
                          <span style={{ fontWeight: '700', color: percent === 100 ? '#059669' : 'var(--text-primary)' }}>
                            {assignedInBatch}/{totalInBatch} ({percent}%)
                          </span>
                        </div>
                      </div>

                      <div className="progress-bar-container">
                        <div 
                          className={`progress-bar-fill ${percent === 100 ? 'complete' : ''}`} 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="batch-card-footer">
                      <button
                        onClick={() => setSelectedBatch(batch)}
                        className="btn-primary"
                        style={{
                          margin: 0,
                          flex: 1,
                          padding: '10px',
                          background: 'linear-gradient(135deg, var(--accent-primary), #4f46e5)',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '10px'
                        }}
                      >
                        View QRs
                      </button>
                      <button
                        onClick={() => handleDownloadBatch(batch._id, batch.batchId, totalInBatch)}
                        disabled={isDownloading}
                        className="btn-primary"
                        style={{
                          margin: 0,
                          flex: 1,
                          padding: '10px',
                          background: isDownloading 
                            ? '#f1f5f9' 
                            : 'linear-gradient(135deg, var(--accent-secondary), #0ea5e9)',
                          color: isDownloading ? '#94a3b8' : '#fff',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          border: 'none',
                          borderRadius: '10px'
                        }}
                      >
                        {isDownloading ? (
                          <>
                            <RefreshCw size={14} className="spinner" />
                            <span>
                              {progress ? `${progress.current}/${progress.total}` : 'Prep...'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Download size={14} />
                            <span>Download Zip</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Batch Details View */}
      {managerView === 'batches' && selectedBatch && (
        <div>
          <div className="detail-header-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <button
                  onClick={() => setSelectedBatch(null)}
                  className="btn-primary"
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                    width: 'auto',
                    marginTop: 0
                  }}
                >
                  <span>&larr; Back to Batches</span>
                </button>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  Batch: {selectedBatch.batchId}
                </h2>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    Created: {new Date(selectedBatch.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={14} />
                    Layout: {selectedBatch.qrType || '4x6'}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Total QR Codes: {selectedBatch.qrCount}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Fulfillment Status
                </span>
                <select
                  value={selectedBatch.status}
                  onChange={(e) => handleStatusChange(selectedBatch._id, e.target.value)}
                  className="form-input"
                  style={{
                    padding: '10px 16px',
                    margin: 0,
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    borderRadius: '12px',
                    width: 'auto',
                    minWidth: '150px',
                    background: '#ffffff',
                    borderColor: '#cbd5e1',
                    color: selectedBatch.status === 'ordered' ? '#d97706' : 
                           selectedBatch.status === 'printed' ? '#2563eb' : 
                           selectedBatch.status === 'shipped' ? '#7c3aed' : '#059669'
                  }}
                >
                  <option value="ordered" style={{ color: '#d97706' }}>Ordered</option>
                  <option value="printed" style={{ color: '#2563eb' }}>Printed</option>
                  <option value="shipped" style={{ color: '#7c3aed' }}>Shipped</option>
                  <option value="delivered" style={{ color: '#059669' }}>Delivered</option>
                </select>
              </div>
            </div>
          </div>

          <section className="section-card glass-panel" style={{ textAlign: 'left' }}>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h2 className="section-title" style={{ margin: 0 }}>QR Codes in Batch</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Manage and assign individual QR codes from this print batch.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="input-wrapper" style={{ margin: 0 }}>
                  <input
                    type="text"
                    placeholder="Search by ID or phone..."
                    className="form-input"
                    style={{ padding: '10px 12px 10px 36px', fontSize: '0.85rem', margin: 0, width: '220px' }}
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

            <div className="directory-tabs" style={{
              display: 'flex',
              gap: '8px',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '8px',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setActiveTab('inactive')}
                className={`tab-btn directory-tab-button ${activeTab === 'inactive' ? 'active' : ''}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: activeTab === 'inactive' ? 'rgba(236, 72, 153, 0.3)' : 'transparent',
                  background: activeTab === 'inactive' ? 'rgba(236, 72, 153, 0.05)' : 'transparent',
                  color: activeTab === 'inactive' ? 'var(--accent-secondary)' : 'var(--text-muted)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Inactive QRs</span>
                <span style={{
                  background: activeTab === 'inactive' ? 'var(--accent-secondary)' : '#e2e8f0',
                  color: activeTab === 'inactive' ? '#fff' : '#475569',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontSize: '0.75rem'
                }}>
                  {loading ? '...' : qrs.filter(q => q.batchId && q.batchId._id === selectedBatch._id && !q.assignedTo).length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('active')}
                className={`tab-btn directory-tab-button ${activeTab === 'active' ? 'active' : ''}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: activeTab === 'active' ? 'rgba(124, 58, 237, 0.3)' : 'transparent',
                  background: activeTab === 'active' ? 'rgba(124, 58, 237, 0.05)' : 'transparent',
                  color: activeTab === 'active' ? 'var(--accent-primary)' : 'var(--text-muted)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Active QRs</span>
                <span style={{
                  background: activeTab === 'active' ? 'var(--accent-primary)' : '#e2e8f0',
                  color: activeTab === 'active' ? '#fff' : '#475569',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontSize: '0.75rem'
                }}>
                  {loading ? '...' : qrs.filter(q => q.batchId && q.batchId._id === selectedBatch._id && q.assignedTo).length}
                </span>
              </button>
            </div>

            {renderQrTable(filteredQrs)}
          </section>
        </div>
      )}

      {/* Global QR Search View */}
      {managerView === 'search' && (
        <section className="section-card glass-panel" style={{ textAlign: 'left' }}>
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <h2 className="section-title" style={{ margin: 0 }}>Global QR Search Directory</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Search and manage all active or inactive QR codes across all generated print batches.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="input-wrapper" style={{ margin: 0 }}>
                <input
                  type="text"
                  placeholder="Search globally by ID or phone..."
                  className="form-input"
                  style={{ padding: '10px 12px 10px 36px', fontSize: '0.85rem', margin: 0, width: '250px' }}
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

          <div className="directory-tabs" style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '8px',
            marginBottom: '20px'
          }}>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`tab-btn directory-tab-button ${activeTab === 'inactive' ? 'active' : ''}`}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: activeTab === 'inactive' ? 'rgba(236, 72, 153, 0.3)' : 'transparent',
                background: activeTab === 'inactive' ? 'rgba(236, 72, 153, 0.05)' : 'transparent',
                color: activeTab === 'inactive' ? 'var(--accent-secondary)' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Inactive QRs</span>
              <span style={{
                background: activeTab === 'inactive' ? 'var(--accent-secondary)' : '#e2e8f0',
                color: activeTab === 'inactive' ? '#fff' : '#475569',
                padding: '2px 8px',
                borderRadius: '20px',
                fontSize: '0.75rem'
              }}>
                {loading ? '...' : unassignedQrs}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`tab-btn directory-tab-button ${activeTab === 'active' ? 'active' : ''}`}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: activeTab === 'active' ? 'rgba(124, 58, 237, 0.3)' : 'transparent',
                background: activeTab === 'active' ? 'rgba(124, 58, 237, 0.05)' : 'transparent',
                color: activeTab === 'active' ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Active QRs</span>
              <span style={{
                background: activeTab === 'active' ? 'var(--accent-primary)' : '#e2e8f0',
                color: activeTab === 'active' ? '#fff' : '#475569',
                padding: '2px 8px',
                borderRadius: '20px',
                fontSize: '0.75rem'
              }}>
                {loading ? '...' : assignedQrs}
              </span>
            </button>
          </div>

          {renderQrTable(filteredQrs)}
        </section>
      )}



      {/* Quick Scan & Edit Modal */}
      {scanModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '500px', padding: '24px' }}>
            <button 
              onClick={() => setScanModalOpen(false)}
              className="modal-close-btn"
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                background: 'var(--accent-glow)',
                color: 'var(--accent-primary)',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Scan size={22} />
              </div>
              <h3 className="modal-title" style={{ margin: 0 }}>Quick Scan & Edit</h3>
            </div>

            {/* Modal Navigation Tabs */}
            {modalScanStatus !== 'editing' && (
              <div style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '4px',
                borderRadius: '10px',
                marginBottom: '20px',
                border: '1px solid var(--glass-border)'
              }}>
                <button
                  onClick={() => {
                    setScanTab('camera');
                    setModalScanStatus('idle');
                    setModalErrorMessage('');
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: scanTab === 'camera' ? 'var(--accent-primary)' : 'transparent',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Camera size={14} />
                  Scan QR
                </button>
                <button
                  onClick={() => {
                    setScanTab('search');
                    setModalScanStatus('idle');
                    setModalErrorMessage('');
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: scanTab === 'search' ? 'var(--accent-primary)' : 'transparent',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Search size={14} />
                  Search by ID
                </button>
              </div>
            )}

            {/* Error Message inside modal */}
            {modalErrorMessage && (
              <div className="alert-error" style={{ marginBottom: '16px', padding: '10px 12px' }}>
                <AlertCircle size={16} />
                <span style={{ fontSize: '0.85rem' }}>{modalErrorMessage}</span>
              </div>
            )}

            {/* Tab Contents */}
            {modalScanStatus === 'idle' && scanTab === 'camera' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '10px 0' }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '260px',
                  aspectRatio: '1',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  border: '2px dashed var(--accent-primary)',
                  background: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div id="admin-qr-reader-container" style={{ width: '100%', height: '100%' }} />
                  {cameraError && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      background: 'rgba(0,0,0,0.85)',
                      color: '#f8fafc',
                      zIndex: 5
                    }}>
                      <AlertCircle size={32} style={{ color: 'var(--danger)', marginBottom: '8px' }} />
                      <p style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>{cameraError}</p>
                    </div>
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
                  Point your camera at a OneQR code redirection link to automatically detect the ID
                </p>
              </div>
            )}

            {modalScanStatus === 'idle' && scanTab === 'search' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">QR Code ID</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. static_qr_123"
                      value={manualSearchId}
                      onChange={(e) => setManualSearchId(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && manualSearchId.trim()) {
                          processFoundQrId(manualSearchId);
                        }
                      }}
                      style={{ padding: '12px 14px 12px 40px' }}
                    />
                    <Search 
                      size={16} 
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(255, 255, 255, 0.4)',
                        pointerEvents: 'none'
                      }} 
                    />
                  </div>
                </div>
                <button
                  onClick={() => processFoundQrId(manualSearchId)}
                  disabled={!manualSearchId.trim()}
                  className="btn-primary"
                  style={{ margin: 0, padding: '12px' }}
                >
                  Search and Edit
                </button>
              </div>
            )}

            {/* Error or Not Found Retry actions */}
            {modalScanStatus === 'error' && (
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    setModalScanStatus('idle');
                    setModalErrorMessage('');
                    setManualSearchId('');
                  }}
                  className="btn-primary"
                  style={{ width: 'auto', margin: 0, padding: '10px 20px' }}
                >
                  Try Again
                </button>
                <button
                  onClick={() => setScanModalOpen(false)}
                  className="btn-primary btn-danger"
                  style={{ width: 'auto', margin: 0, padding: '10px 20px' }}
                >
                  Close
                </button>
              </div>
            )}

            {/* Edit QR Details View */}
            {modalScanStatus === 'editing' && scannedQr && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--glass-border)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>QR Code ID</span>
                    <h4 style={{ margin: '4px 0 0 0', fontFamily: 'monospace', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{scannedQr.qrId}</h4>
                  </div>
                  <span className={`badge ${scannedQr.assignedTo ? 'badge-status-active' : 'badge-status-inactive'}`}>
                    {scannedQr.assignedTo ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Plan Dropdown */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Pricing Plan</label>
                  <select
                    className="form-input"
                    value={modalSelectedPlan}
                    onChange={(e) => setModalSelectedPlan(e.target.value)}
                    style={{ padding: '12px', background: 'var(--input-bg)' }}
                  >
                    <option value="free">FREE</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                {/* Assigned Mobile User Search */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Assign to Mobile Number</label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type="text"
                      placeholder="Search or type registered mobile number..."
                      className="form-input"
                      value={modalSelectedUser}
                      onChange={(e) => {
                        setModalSelectedUser(e.target.value);
                        setModalUserSearchActive(true);
                      }}
                      onFocus={() => setModalUserSearchActive(true)}
                      onBlur={() => {
                        setTimeout(() => setModalUserSearchActive(false), 200);
                      }}
                      style={{ padding: '12px 14px 12px 40px' }}
                    />
                    <UserPlus 
                      size={16} 
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(255, 255, 255, 0.4)',
                        pointerEvents: 'none'
                      }} 
                    />

                    {/* Suggestions list */}
                    {modalUserSearchActive && (
                      <div className="glass-panel" style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '140px',
                        overflowY: 'auto',
                        zIndex: 150,
                        marginTop: '4px',
                        border: '1px solid var(--glass-border)',
                        boxShadow: 'var(--shadow)',
                        background: 'var(--select-option-bg)',
                        borderRadius: '8px',
                        padding: '4px 0'
                      }}>
                        {users
                          .filter(u => u.phone && u.phone.includes(modalSelectedUser || ''))
                          .map(u => (
                            <div
                              key={u.id}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setModalSelectedUser(u.phone);
                                setModalUserSearchActive(false);
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
                        {users.filter(u => u.phone && u.phone.includes(modalSelectedUser || '')).length === 0 && (
                          <div style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'left' }}>
                            No matching users
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button
                    onClick={() => {
                      setModalScanStatus('idle');
                      setScannedQr(null);
                    }}
                    className="btn-primary btn-logout"
                    style={{ flex: 1, margin: 0, padding: '12px' }}
                    disabled={modalSaving}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleModalSave}
                    className="btn-primary"
                    style={{ flex: 1, margin: 0, padding: '12px', background: 'linear-gradient(135deg, var(--success), #059669)' }}
                    disabled={modalSaving}
                  >
                    {modalSaving ? (
                      <span className="spinner spinner-tiny"></span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generate Batch Modal */}
      {generateModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-card" style={{ maxWidth: '400px', padding: '28px' }}>
            <button 
              onClick={() => setGenerateModalOpen(false)}
              className="modal-close-btn"
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                background: 'var(--accent-glow)',
                color: 'var(--accent-primary)',
                padding: '10px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <QrCode size={24} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 className="modal-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Generate QRs</h3>
                <p className="modal-subtitle" style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Create a new batch of unique QR codes.
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                Number of QR Codes to Generate
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                className="form-input"
                style={{ padding: '12px', margin: 0 }}
                value={generateQuantity}
                onChange={(e) => setGenerateQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                QR Template Size / Layout
              </label>
              <select
                className="form-input"
                style={{ padding: '12px', margin: 0, background: 'var(--input-bg)' }}
                value={generateQrType}
                onChange={(e) => setGenerateQrType(e.target.value)}
              >
                <option value="4x6">4x6 Layout (Default)</option>
                <option value="4x4">4x4 Layout</option>
              </select>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                All generated QR codes will be grouped into a single batch and linked to the selected layout template.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setGenerateModalOpen(false)}
                className="btn-primary btn-logout"
                style={{ flex: 1, padding: '12px', margin: 0 }}
                disabled={generating}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleGenerate(generateQuantity, generateQrType)}
                className="btn-primary"
                style={{ flex: 1, padding: '12px', margin: 0 }}
                disabled={generating}
              >
                {generating ? (
                  <span className="spinner spinner-tiny"></span>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
