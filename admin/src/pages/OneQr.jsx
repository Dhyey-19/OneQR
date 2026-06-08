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
  const [activeQrSearchId, setActiveQrSearchId] = useState(null);
  const [editingQrId, setEditingQrId] = useState(null);
  const [activeTab, setActiveTab] = useState('inactive');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('');
  const [downloadLoading, setDownloadLoading] = useState({});
  const [downloadProgress, setDownloadProgress] = useState({});
  
  // Track selected user for each unassigned QR code: { [qrId]: userId }
  const [selectedUserForQr, setSelectedUserForQr] = useState({});
  // Track specific QR codes being assigned: { [qrId]: loadingStateBoolean }
  const [assigningState, setAssigningState] = useState({});

  // Track selected plan for each QR code: { [qrId]: planId }
  const [selectedPlanForQr, setSelectedPlanForQr] = useState({});

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
      const res = await executeAssignFlow(userId, planId, qrId);

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



  // Filter QR codes by active/inactive tab, batch filter, and QR ID or target phone number
  const filteredQrs = qrs
    .filter(qr => activeTab === 'active' ? !!qr.assignedTo : !qr.assignedTo)
    .filter(qr => {
      if (!selectedBatchFilter) return true;
      return qr.batchId && qr.batchId._id === selectedBatchFilter;
    })
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

      {/* QR Code Batches Management Section */}
      <section className="section-card glass-panel" style={{ marginBottom: '32px' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <h2 className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--accent-primary)" />
            <span>QR Code Batches</span>
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Total Batches: {batches.length}
          </span>
        </div>

        <div className="table-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
          {loading ? (
            <div className="table-loading">
              <div className="spinner"></div>
              <p>Loading batches...</p>
            </div>
          ) : batches.length === 0 ? (
            <div className="table-empty">
              <p>No batches generated yet. Click "Generate QR Code" to create one.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Layout Type</th>
                  <th>Created At</th>
                  <th>QR Count</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => {
                  const isDownloading = downloadLoading[batch._id];
                  const progress = downloadProgress[batch._id];
                  
                  return (
                    <tr key={batch._id}>
                      <td data-label="Batch ID">
                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          {batch.batchId}
                        </span>
                      </td>
                      <td data-label="Layout Type">
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--glass-border)',
                          fontWeight: '600',
                          color: 'var(--text-primary)'
                        }}>
                          {batch.qrType || '4x6'}
                        </span>
                      </td>
                      <td data-label="Created At" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} />
                          {new Date(batch.createdAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </td>
                      <td data-label="QR Count" style={{ fontWeight: 'bold' }}>
                        {batch.qrCount}
                      </td>
                      <td data-label="Status">
                        <select
                          value={batch.status}
                          onChange={(e) => handleStatusChange(batch._id, e.target.value)}
                          className="form-input"
                          style={{
                            padding: '6px 10px',
                            margin: 0,
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            borderRadius: '8px',
                            width: 'auto',
                            display: 'inline-block',
                            background: 'var(--input-bg)',
                            borderColor: 'var(--glass-border)',
                            color: batch.status === 'ordered' ? 'var(--warning)' : 
                                   batch.status === 'printed' ? 'var(--accent-secondary)' : 
                                   batch.status === 'shipped' ? 'var(--accent-primary)' : 'var(--success)'
                          }}
                        >
                          <option value="ordered" style={{ color: 'var(--warning)' }}>Ordered</option>
                          <option value="printed" style={{ color: 'var(--accent-secondary)' }}>Printed</option>
                          <option value="shipped" style={{ color: 'var(--accent-primary)' }}>Shipped</option>
                          <option value="delivered" style={{ color: 'var(--success)' }}>Delivered</option>
                        </select>
                      </td>
                      <td data-label="Actions" style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => {
                            if (selectedBatchFilter === batch._id) {
                              setSelectedBatchFilter('');
                            } else {
                              setSelectedBatchFilter(batch._id);
                            }
                          }}
                          className="btn-primary"
                          style={{
                            margin: 0,
                            width: 'auto',
                            padding: '8px 12px',
                            background: selectedBatchFilter === batch._id 
                              ? 'linear-gradient(135deg, var(--accent-primary), #4f46e5)'
                              : 'rgba(255, 255, 255, 0.05)',
                            border: selectedBatchFilter === batch._id ? 'none' : '1px solid var(--glass-border)',
                            color: selectedBatchFilter === batch._id ? '#fff' : 'var(--text-primary)',
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: '600'
                          }}
                        >
                          <span>{selectedBatchFilter === batch._id ? 'Showing QRs' : 'Filter QRs'}</span>
                        </button>
                        <button
                          onClick={() => handleDownloadBatch(batch._id, batch.batchId, batch.qrCount)}
                          disabled={isDownloading}
                          className="btn-primary"
                          style={{
                            margin: 0,
                            width: 'auto',
                            padding: '8px 12px',
                            background: isDownloading 
                              ? 'var(--table-hover)' 
                              : 'linear-gradient(135deg, var(--accent-secondary), #0ea5e9)',
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {isDownloading ? (
                            <>
                              <RefreshCw size={14} className="spinner" />
                              <span style={{ fontSize: '0.75rem' }}>
                                {progress ? `${progress.current}/${progress.total}` : 'Prep...'}
                              </span>
                            </>
                          ) : (
                            <>
                              <Download size={14} />
                              <span>Download</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* QR Code Index Directory */}
      <section className="section-card glass-panel">
        <div className="section-header" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>QR Code Directory</h2>

            <div className="section-header-actions">
              {/* Batch Filter Dropdown */}
              <select
                value={selectedBatchFilter}
                onChange={(e) => setSelectedBatchFilter(e.target.value)}
                className="form-input"
                style={{
                  padding: '10px 12px',
                  fontSize: '0.85rem',
                  width: 'auto',
                  minWidth: '160px',
                  borderRadius: '12px',
                  margin: 0,
                  background: 'var(--input-bg)',
                  borderColor: 'var(--glass-border)',
                  color: 'var(--text-primary)',
                  fontWeight: '600'
                }}
              >
                <option value="">All Batches</option>
                {batches.map(batch => (
                  <option key={batch._id} value={batch._id}>
                    {batch.batchId} ({batch.qrCount} QRs)
                  </option>
                ))}
              </select>

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
                  <th>Batch ID</th>
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
                          <div style={{ position: 'relative', width: '100%', maxWidth: '180px', zIndex: 20 }} className="mobile-width-full">
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
                                zIndex: 100,
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
                              onClick={() => handleDownload(qr.qrId)}
                              className="btn-primary btn-action-icon"
                              title="Download QR Image"
                            >
                              <Download size={14} />
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
