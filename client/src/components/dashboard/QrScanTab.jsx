import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, RefreshCw, Check, Camera, Link2, Smartphone } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { apiRequest } from '../../services/apiService';

export default function QrScanTab({ onSelectAndManageQr, onRefreshQrs }) {
  const navigate = useNavigate();
  const [pageScanTab, setPageScanTab] = useState('scan'); // 'scan' | 'manual'
  const [pageManualQrId, setPageManualQrId] = useState('');
  const [pageScanStatus, setPageScanStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [pageScanMessage, setPageScanMessage] = useState('');
  const [pageCameraError, setPageCameraError] = useState('');

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

  const handlePageQrScan = async (inputVal) => {
    const qrId = parseQrIdFromScannedText(inputVal);
    if (!qrId) {
      setPageScanStatus('error');
      setPageScanMessage('Invalid QR Code input.');
      return;
    }

    setPageScanStatus('loading');
    setPageScanMessage('Verifying QR Code status...');

    try {
      const response = await apiRequest('/profile/qrs/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ qrId })
      });

      if (response.status === 'assigned_now') {
        setPageScanStatus('success');
        setPageScanMessage(response.message || 'your qr is live and link with this property');

        // Refresh the list of allocated QR codes
        if (onRefreshQrs) {
          await onRefreshQrs();
        }

        // Wait 2.5 seconds and redirect to manage QR page
        setTimeout(async () => {
          await onSelectAndManageQr(qrId);
          // reset state
          setPageScanStatus('idle');
          setPageScanMessage('');
          setPageManualQrId('');
        }, 2500);

      } else if (response.status === 'already_assigned_to_me') {
        setPageScanStatus('success');
        setPageScanMessage(response.message || 'This QR Code is already allocated to your workspace.');

        setTimeout(async () => {
          await onSelectAndManageQr(qrId);
          // reset state
          setPageScanStatus('idle');
          setPageScanMessage('');
          setPageManualQrId('');
        }, 2000);

      } else if (response.status === 'already_assigned_to_other' || response.status === 'not_found') {
        setPageScanStatus('error');
        setPageScanMessage(response.message || 'Failed to claim QR code.');
      } else {
        setPageScanStatus('error');
        setPageScanMessage(response.message || 'An unexpected response occurred.');
      }
    } catch (err) {
      console.error('Error in page QR scanning:', err);
      setPageScanStatus('error');
      setPageScanMessage(err.message || 'An error occurred while scanning the QR code.');
    }
  };

  // Page-level QR Code camera scanning lifecycle
  useEffect(() => {
    let html5QrcodeInstance = null;

    if (pageScanTab === 'scan') {
      setPageCameraError('');
      const timer = setTimeout(() => {
        const scannerId = "page-qr-reader-container";
        const container = document.getElementById(scannerId);
        if (!container) {
          console.error("Page scanner element not found in DOM");
          return;
        }

        html5QrcodeInstance = new Html5Qrcode(scannerId);
        html5QrcodeInstance.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            handlePageQrScan(decodedText);
            if (html5QrcodeInstance && html5QrcodeInstance.isScanning) {
              html5QrcodeInstance.stop().catch(err => console.error("Error stopping page scanner:", err));
            }
          },
          (errorMessage) => {
            // Verbose error, ignore
          }
        ).catch(err => {
          console.error("Page camera access/init error:", err);
          setPageCameraError("Camera access denied or device is not available. Please verify permissions.");
        });
      }, 300);

      return () => {
        clearTimeout(timer);
        if (html5QrcodeInstance && html5QrcodeInstance.isScanning) {
          html5QrcodeInstance.stop()
            .then(() => {
              html5QrcodeInstance.clear();
            })
            .catch(err => console.error("Error clearing page scanner on unmount:", err));
        }
      };
    }
  }, [pageScanTab]);

  return (
    <div className="space-y-8 animate-fade-in max-w-xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass border border-slate-200 dark:border-white/10 rounded-3xl relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Scan className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">QR Code scanner</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            Scan & Activate QR
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">
            Verify QR assignment status and link it to your dynamic property profiles.
          </p>
        </div>
        <div>
          <button
            onClick={() => { navigate('/dashboard'); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-350 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            &larr; Back to Dashboard
          </button>
        </div>
      </div>

      {/* Scanner Card */}
      <div className="p-6 glass border border-slate-200 dark:border-white/10 rounded-3xl relative overflow-hidden space-y-6">

        {/* Tab Selector */}
        {pageScanStatus !== 'loading' && pageScanStatus !== 'success' && (
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => {
                setPageScanTab('scan');
                setPageScanStatus('idle');
                setPageScanMessage('');
              }}
              className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                pageScanTab === 'scan' 
                  ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              Scan with Camera
            </button>
            <button
              onClick={() => {
                setPageScanTab('manual');
                setPageScanStatus('idle');
                setPageScanMessage('');
              }}
              className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                pageScanTab === 'manual' 
                  ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              Manual Entry
            </button>
          </div>
        )}

        {/* Scanning & Status Area */}
        <div className="space-y-4">
          {pageScanStatus === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{pageScanMessage}</p>
            </div>
          )}

          {pageScanStatus === 'success' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-md">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">QR Live & Assigned</h4>
              <p className="text-xs text-slate-655 dark:text-slate-300 max-w-xs leading-relaxed font-bold">{pageScanMessage}</p>
              <p className="text-[10px] text-slate-400">Redirecting to profile management...</p>
            </div>
          )}

          {pageScanStatus !== 'loading' && pageScanStatus !== 'success' && (
            <>
              {pageScanTab === 'scan' ? (
                <div className="space-y-4">
                  <div className="relative w-full aspect-square max-w-[280px] mx-auto overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-black flex items-center justify-center">
                    <div id="page-qr-reader-container" className="w-full h-full" />
                    {pageCameraError && (
                      <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center bg-slate-950/90 text-white z-10 space-y-3">
                        <Smartphone className="w-10 h-10 text-red-500 opacity-80" />
                        <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">{pageCameraError}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-550 dark:text-slate-400 text-center leading-relaxed max-w-xs mx-auto">
                    Allow camera access and point your camera at the OneQR code printed/displayed.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">QR Code ID</label>
                    <input
                      type="text"
                      value={pageManualQrId}
                      onChange={(e) => setPageManualQrId(e.target.value)}
                      placeholder="e.g. 3szp61st"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={!pageManualQrId.trim()}
                    onClick={() => handlePageQrScan(pageManualQrId)}
                    className="w-full py-3 rounded-xl bg-[#2563eb] text-white font-bold text-xs hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/20 transition-all border border-transparent dark:border-white/10 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Verify & Claim QR</span>
                  </button>
                </div>
              )}

              {/* Error Banner */}
              {pageScanStatus === 'error' && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-xl text-center text-xs font-bold leading-normal">
                  {pageScanMessage}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
