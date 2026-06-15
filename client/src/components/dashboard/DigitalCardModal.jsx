import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, LayoutTemplate, Palette, Loader2, Link2, MapPin, Phone, Mail, Globe } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function DigitalCardModal({ profile, onClose }) {
  const [selectedDesign, setSelectedDesign] = useState('modern');
  const [selectedColor, setSelectedColor] = useState('#2563eb');
  const [isDownloading, setIsDownloading] = useState(false);
  
  const cardRef = useRef(null);

  const colors = [
    { name: 'Blue', value: '#2563eb' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Rose', value: '#e11d48' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Slate', value: '#0f172a' }
  ];

  const designs = [
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
    { id: 'minimal', name: 'Minimalist' }
  ];

  // Map Profile Data
  const businessName = profile.profileCompany || profile.profileName || 'Your Business Name';
  const logoUrl = profile.profileLogo || '';
  const mobile = profile.profilePhone || '';
  const email = profile.profileEmail || '';
  const address = profile.profileAddress || '';
  const website = profile.profileWebsite || '';
  const upiId = profile.bankUpiId || profile.socialUPI || '';
  
  const qrUrlPrefix = import.meta.env.VITE_QR_URL_PREFIX || window.location.origin;
  const cleanPrefix = qrUrlPrefix.endsWith("/") ? qrUrlPrefix : `${qrUrlPrefix}/`;
  const qrId = profile.qrId || profile.slug || "";
  const finalQrUrl = qrId ? `${cleanPrefix}${qrId}` : "";
  
  // Check if we have a valid link to generate QR
  const hasQrUrl = !!finalQrUrl;

  // Using a solid color for the QR code
  const qrGeneratedUrl = hasQrUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=${selectedColor.replace('#', '')}&data=${encodeURIComponent(finalQrUrl)}`
    : "";

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      // Small delay to ensure all fonts and images are fully rendered
      await new Promise(r => setTimeout(r, 300));
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${businessName.replace(/\s+/g, '_')}_DigitalCard.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating card image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getAlphabeticalLogo = (name) => {
    if (!name) return "";
    const cleanName = name.trim();
    if (!cleanName) return "";
    const words = cleanName.split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return cleanName.slice(0, 2).toUpperCase();
  };

  // ----------------------------------------------------
  // Card Layout Renders
  // ----------------------------------------------------
  
  // Dimensions for standard business card (landscape)
  const cardWidth = 'w-[600px]';
  const cardHeight = 'h-[350px]';

  const renderModernCard = () => (
    <div 
      ref={cardRef}
      className={`${cardWidth} ${cardHeight} bg-white shadow-xl relative overflow-hidden flex`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Left colored bar */}
      <div 
        className="w-1/3 h-full flex flex-col items-center justify-center p-6 text-white relative z-10"
        style={{ backgroundColor: selectedColor }}
      >
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden mb-4 shadow-lg border-4 border-white/20">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" crossOrigin="anonymous" />
          ) : (
            <span className="text-3xl font-black" style={{ color: selectedColor }}>
              {getAlphabeticalLogo(businessName)}
            </span>
          )}
        </div>
        {qrGeneratedUrl && (
          <div className="p-2 bg-white rounded-xl shadow-lg">
            <img src={qrGeneratedUrl} alt="QR" className="w-24 h-24" crossOrigin="anonymous" />
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="w-2/3 h-full p-8 flex flex-col justify-center bg-slate-50 relative">
        {/* Background Graphic */}
        <div 
          className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-5 pointer-events-none" 
          style={{ backgroundColor: selectedColor }}
        />

        <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
          {businessName}
        </h2>
        
        <div className="space-y-3">
          {mobile && (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${selectedColor}20`, color: selectedColor }}>
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-semibold text-slate-700">{mobile}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${selectedColor}20`, color: selectedColor }}>
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-semibold text-slate-700 truncate pr-4">{email}</span>
            </div>
          )}
          {website && (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${selectedColor}20`, color: selectedColor }}>
                <Globe className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-semibold text-slate-700 truncate pr-4">{website.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
          {address && (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${selectedColor}20`, color: selectedColor }}>
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-slate-700 leading-snug line-clamp-2 pr-4">{address}</span>
            </div>
          )}
          {upiId && (
            <div className="flex items-center gap-3 pt-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${selectedColor}20`, color: selectedColor }}>
                <img src="/assets/upi.png" alt="UPI" className="w-3.5 h-3.5 object-contain" style={{ filter: 'grayscale(1) brightness(0.5)' }} crossOrigin="anonymous" />
              </div>
              <span className="text-sm font-bold text-slate-800">UPI: <span className="font-semibold text-slate-600">{upiId}</span></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderClassicCard = () => (
    <div 
      ref={cardRef}
      className={`${cardWidth} ${cardHeight} bg-white shadow-xl relative overflow-hidden flex flex-col`}
      style={{ boxSizing: 'border-box' }}
    >
      <div 
        className="w-full h-2.5 absolute top-0 left-0" 
        style={{ backgroundColor: selectedColor }}
      />
      <div className="flex-1 flex p-8 pt-10">
        <div className="w-2/3 pr-6 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            {logoUrl && (
              <img src={logoUrl} alt="Logo" className="w-16 h-16 object-contain" crossOrigin="anonymous" />
            )}
            {!logoUrl && (
              <div className="w-16 h-16 bg-slate-100 flex items-center justify-center rounded-lg border border-slate-200">
                <span className="text-xl font-bold text-slate-400">{getAlphabeticalLogo(businessName)}</span>
              </div>
            )}
            <h2 className="text-2xl font-bold text-slate-900 leading-tight border-l-2 pl-4" style={{ borderColor: selectedColor }}>
              {businessName}
            </h2>
          </div>
          
          <div className="space-y-2.5 mt-2 border-t border-slate-100 pt-4">
            {mobile && <p className="text-sm text-slate-600 font-medium"><strong className="text-slate-900 w-16 inline-block">Mobile:</strong> {mobile}</p>}
            {email && <p className="text-sm text-slate-600 font-medium truncate"><strong className="text-slate-900 w-16 inline-block">Email:</strong> {email}</p>}
            {website && <p className="text-sm text-slate-600 font-medium truncate"><strong className="text-slate-900 w-16 inline-block">Web:</strong> {website.replace(/^https?:\/\//, '')}</p>}
            {address && <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2"><strong className="text-slate-900 w-16 inline-block">Address:</strong> {address}</p>}
            {upiId && <p className="text-sm text-slate-600 font-medium"><strong className="text-slate-900 w-16 inline-block">UPI ID:</strong> {upiId}</p>}
          </div>
        </div>
        
        <div className="w-1/3 flex flex-col items-end justify-center border-l border-slate-100 pl-6">
          {qrGeneratedUrl && (
            <div className="p-2 border border-slate-200 rounded-xl bg-white shadow-sm mb-3">
              <img src={qrGeneratedUrl} alt="QR" className="w-32 h-32" crossOrigin="anonymous" />
            </div>
          )}
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-2">Scan to Connect</span>
        </div>
      </div>
      <div 
        className="w-full h-8 absolute bottom-0 left-0 flex items-center justify-end px-6 text-[9px] text-white/80 tracking-widest" 
        style={{ backgroundColor: selectedColor }}
      >
        POWERED BY ONEQR
      </div>
    </div>
  );

  const renderMinimalistCard = () => (
    <div 
      ref={cardRef}
      className={`${cardWidth} ${cardHeight} bg-slate-900 shadow-xl relative overflow-hidden flex flex-col items-center justify-center p-10`}
      style={{ boxSizing: 'border-box' }}
    >
      {/* Accent blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-64 h-64 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: selectedColor }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: selectedColor }} />

      <div className="w-full flex items-center justify-between z-10 relative">
        <div className="w-1/2 text-left pr-4">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-16 h-16 object-contain mb-4 brightness-0 invert opacity-90" crossOrigin="anonymous" />
          ) : (
            <div className="mb-4">
              <span className="text-xl font-bold tracking-widest opacity-80" style={{ color: selectedColor }}>
                {getAlphabeticalLogo(businessName)}
              </span>
            </div>
          )}
          
          <h2 className="text-2xl font-light text-white mb-6 tracking-wide leading-tight">
            {businessName}
          </h2>
          
          <div className="space-y-2 text-sm text-slate-300 font-light">
            {mobile && <p>{mobile}</p>}
            {email && <p className="truncate">{email}</p>}
            {website && <p className="truncate" style={{ color: selectedColor }}>{website.replace(/^https?:\/\//, '')}</p>}
            {upiId && <p className="pt-2 text-xs uppercase tracking-wider opacity-60">UPI: {upiId}</p>}
          </div>
        </div>

        <div className="w-1/2 flex flex-col items-end">
          {qrGeneratedUrl && (
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
              <img src={qrGeneratedUrl} alt="QR" className="w-36 h-36 rounded-lg mix-blend-screen" crossOrigin="anonymous" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
          )}
          {address && (
            <p className="text-right text-[10px] text-slate-400 font-light mt-6 max-w-[200px] leading-relaxed">
              {address}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh]">
        
        {/* Controls Sidebar */}
        <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 p-6 flex flex-col shrink-0 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-blue-600" />
              Digital Card
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6 flex-1">
            {/* Design Selection */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                Select Design
              </label>
              <div className="grid grid-cols-1 gap-2">
                {designs.map(design => (
                  <button
                    key={design.id}
                    onClick={() => setSelectedDesign(design.id)}
                    className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between ${
                      selectedDesign === design.id 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {design.name}
                    {selectedDesign === design.id && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                Theme Color
              </label>
              <div className="flex flex-wrap gap-3">
                {colors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-10 h-10 rounded-full border-2 transition-all cursor-pointer shadow-sm flex items-center justify-center ${
                      selectedColor === color.value ? 'border-slate-900 scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {selectedColor === color.value && <div className="w-2 h-2 bg-white rounded-full" />}
                  </button>
                ))}
                
                {/* Custom Color Picker */}
                <div className={`w-10 h-10 rounded-full border-2 overflow-hidden relative cursor-pointer shadow-sm transition-all ${
                    !colors.find(c => c.value === selectedColor) ? 'border-slate-900 scale-110' : 'border-slate-200 hover:scale-105'
                  }`}>
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="absolute inset-[-10px] w-16 h-16 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
            <button
              onClick={handleDownload}
              disabled={isDownloading || !hasQrUrl}
              className={`w-full py-3.5 px-4 rounded-xl text-white text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                !hasQrUrl ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.98]'
              }`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Image...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Digital Card</span>
                </>
              )}
            </button>
            {!hasQrUrl && (
              <p className="text-[10px] text-amber-600 text-center font-semibold bg-amber-50 p-2 rounded-lg">
                Complete your profile to generate a QR link.
              </p>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="w-full md:w-2/3 bg-slate-200/50 p-4 md:p-8 flex flex-col relative overflow-hidden h-[400px] md:h-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors hidden md:flex cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 hidden md:block">
              Live Preview
            </h4>
            
            {/* Wrapper to scale the fixed-size card down for small screens */}
            <div className="w-full flex items-center justify-center overflow-auto sm:overflow-visible">
              <div style={{ transform: 'scale(0.8)', transformOrigin: 'center center' }} className="md:transform-none">
                {selectedDesign === 'modern' && renderModernCard()}
                {selectedDesign === 'classic' && renderClassicCard()}
                {selectedDesign === 'minimal' && renderMinimalistCard()}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
