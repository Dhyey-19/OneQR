import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Plus, Camera, Link2, RefreshCw, Check, Smartphone } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { apiRequest } from '../../services/apiService';

export default function ClaimQrModal({ isOpen, onClose, onSuccess }) {
  const [claimTab, setClaimTab] = useState('scan'); // 'scan' | 'manual'
  const [manualQrId, setManualQrId] = useState('');
  const [claimStatus, setClaimStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [claimMessage, setClaimMessage] = useState('');
  const [cameraError, setCameraError] = useState('');

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

  const handleQrClaim = async (inputVal) => {
    const qrId = parseQrIdFromScannedText(inputVal);
    if (!qrId) {
      setClaimStatus('error');
      setClaimMessage('Invalid QR Code input.');
      return;
    }

    setClaimStatus('loading');
    setClaimMessage('Verifying QR Code status...');

    try {
      const response = await apiRequest('/profile/qrs/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ qrId })
      });

      if (response.status === 'success') {
        setClaimStatus('success');
        setClaimMessage(response.message || 'QR Code successfully allocated!');
        
        // Refresh the list of allocated QR codes
        if (onSuccess) {
          await onSuccess();
        }

        setTimeout(() => {
          onClose();
          // reset state
          setClaimStatus('idle');
          setClaimMessage('');
          setManualQrId('');
        }, 2000);
      } else {
        setClaimStatus('error');
        setClaimMessage(response.message || 'Failed to claim QR code.');
      }
    } catch (err) {
      console.error('Error claiming QR code:', err);
      setClaimStatus('error');
      setClaimMessage(err.message || 'An error occurred while claiming the QR code.');
    }
  };

  // QR Code camera scanning lifecycle
  useEffect(() => {
    let html5QrcodeInstance = null;

    if (isOpen && claimTab === 'scan') {
      setCameraError('');
      const timer = setTimeout(() => {
        const scannerId = "qr-reader-container";
        const container = document.getElementById(scannerId);
        if (!container) {
          console.error("Scanner element not found in DOM");
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
            handleQrClaim(decodedText);
            if (html5QrcodeInstance && html5QrcodeInstance.isScanning) {
              html5QrcodeInstance.stop().catch(err => console.error("Error stopping scanner:", err));
            }
          },
          (errorMessage) => {
            // Verbose error, ignore
          }
        ).catch(err => {
          console.error("Camera access/init error:", err);
          setCameraError("Camera access denied or device is not available. Please verify permissions.");
        });
      }, 300);

      return () => {
        clearTimeout(timer);
        if (html5QrcodeInstance && html5QrcodeInstance.isScanning) {
          html5QrcodeInstance.stop()
            .then(() => {
              html5QrcodeInstance.clear();
            })
            .catch(err => console.error("Error clearing scanner on unmount:", err));
        }
      };
    }
  }, [isOpen, claimTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay background */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (claimStatus !== 'loading') onClose();
            }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-6"
          >
            {/* Background light gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/15 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Scan className="w-5 h-5 text-blue-500" />
                  Claim New QR Code
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Link a dynamic QR code to your workspace.
                </p>
              </div>
              <button 
                disabled={claimStatus === 'loading'}
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            {/* Tabs */}
            {claimStatus !== 'loading' && claimStatus !== 'success' && (
              <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                <button
                  onClick={() => {
                    setClaimTab('scan');
                    setClaimStatus('idle');
                    setClaimMessage('');
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    claimTab === 'scan' 
                      ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Scan QR Code
                </button>
                <button
                  onClick={() => {
                    setClaimTab('manual');
                    setClaimStatus('idle');
                    setClaimMessage('');
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    claimTab === 'manual' 
                      ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  Manual Entry
                </button>
              </div>
            )}

            {/* Content Area based on Tab */}
            <div className="space-y-4">
              {claimStatus === 'loading' && (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{claimMessage}</p>
                </div>
              )}

              {claimStatus === 'success' && (
                <div className="flex flex-col items-center justify-center py-8 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Allocation Successful</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">{claimMessage}</p>
                </div>
              )}

              {claimStatus !== 'loading' && claimStatus !== 'success' && (
                <>
                  {claimTab === 'scan' ? (
                    <div className="space-y-4">
                      <div className="relative w-full aspect-square max-w-[280px] mx-auto overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-black flex items-center justify-center">
                        <div id="qr-reader-container" className="w-full h-full" />
                        {cameraError && (
                          <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center bg-slate-950/90 text-white z-10 space-y-3">
                            <Smartphone className="w-10 h-10 text-red-500 opacity-80" />
                            <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">{cameraError}</p>
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center leading-relaxed max-w-xs mx-auto">
                        Point your device camera at the dynamic OneQR code.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-left">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">QR Code ID</label>
                        <input
                          type="text"
                          value={manualQrId}
                          onChange={(e) => setManualQrId(e.target.value)}
                          placeholder="e.g. 3szp61st"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={!manualQrId.trim()}
                        onClick={() => handleQrClaim(manualQrId)}
                        className="w-full py-3 rounded-xl bg-[#2563eb] text-white font-bold text-xs hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/20 transition-all border border-transparent dark:border-white/10 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Verify & Claim QR</span>
                      </button>
                    </div>
                  )}

                  {/* Error State Banner */}
                  {claimStatus === 'error' && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-xl text-center text-xs font-bold leading-normal">
                      {claimMessage}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
