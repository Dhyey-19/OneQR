import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, QrCode, Smartphone, Globe, Link2 } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaFacebook, FaYoutube, FaLinkedin, FaTwitter, FaGoogle } from 'react-icons/fa';

export default function DownloadQrModal({ profile, finalQrUrl, onClose }) {
  const [downloadingId, setDownloadingId] = useState(null);

  const formatLink = (type, value) => {
    if (!value) return "";
    let cleanVal = value.trim();
    if (cleanVal.startsWith("http://") || cleanVal.startsWith("https://")) {
      return cleanVal;
    }
    
    switch (type) {
      case 'whatsapp':
        return `https://wa.me/${cleanVal.replace(/[^0-9]/g, '')}`;
      case 'instagram':
        return `https://instagram.com/${cleanVal.replace('@', '')}`;
      case 'facebook':
        return `https://facebook.com/${cleanVal}`;
      case 'youtube':
        return `https://youtube.com/${cleanVal}`;
      case 'linkedin':
        return `https://linkedin.com/in/${cleanVal}`;
      case 'x':
        return `https://twitter.com/${cleanVal.replace('@', '')}`;
      case 'upi':
        if (cleanVal.includes('upi://')) return cleanVal;
        return `upi://pay?pa=${cleanVal}&pn=${encodeURIComponent(profile.profileName || profile.profileCompany || 'Payee')}`;
      default:
        return cleanVal;
    }
  };

  const getOptions = () => {
    const options = [];

    // 1. All-in-One QR
    if (finalQrUrl) {
      options.push({
        id: 'all-in-one',
        label: 'All In One QR',
        value: finalQrUrl,
        icon: QrCode,
        color: 'text-slate-900',
        bgColor: 'bg-slate-100',
        themeHex: profile.qrColor || '000000'
      });
    }

    // Custom helper for social links
    const addSocial = (id, label, value, IconComponent, colorClass, bgColorClass, themeHex) => {
      if (value) {
        options.push({
          id,
          label,
          value: formatLink(id, value),
          icon: IconComponent,
          color: colorClass,
          bgColor: bgColorClass,
          themeHex
        });
      }
    };

    addSocial('whatsapp', 'WhatsApp', profile.socialWhatsapp, FaWhatsapp, 'text-green-500', 'bg-green-50', '25D366');
    addSocial('instagram', 'Instagram', profile.socialInstagram, FaInstagram, 'text-pink-500', 'bg-pink-50', 'E1306C');
    addSocial('google', 'Google Review', profile.socialGoogle, FaGoogle, 'text-red-500', 'bg-red-50', 'EA4335');
    addSocial('facebook', 'Facebook', profile.socialFacebook, FaFacebook, 'text-blue-600', 'bg-blue-50', '1877F2');
    addSocial('youtube', 'YouTube', profile.socialYoutube, FaYoutube, 'text-red-600', 'bg-red-50', 'FF0000');
    addSocial('linkedin', 'LinkedIn', profile.socialLinkedin, FaLinkedin, 'text-blue-700', 'bg-blue-50', '0A66C2');
    addSocial('x', 'X (Twitter)', profile.socialX, FaTwitter, 'text-slate-900', 'bg-slate-100', '000000');
    
    const upiValue = profile.bankUpiId || profile.socialUPI;
    if (upiValue) {
      options.push({
        id: 'upi',
        label: 'UPI Payment',
        value: formatLink('upi', upiValue),
        icon: Smartphone,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        themeHex: '4f46e5'
      });
    }

    // Website
    if (profile.profileWebsite) {
       options.push({
        id: 'website',
        label: 'Website',
        value: formatLink('website', profile.profileWebsite),
        icon: Globe,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        themeHex: '059669'
      });
    }

    return options;
  };

  const options = getOptions();

  const handleDownload = async (option) => {
    setDownloadingId(option.id);
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&color=${option.themeHex.replace('#', '')}&data=${encodeURIComponent(option.value)}`;
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${profile.slug || "QR"}_${option.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download QR code", error);
      alert("Failed to download QR. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Download QR Code</h3>
            <p className="text-sm text-slate-500 mt-1">Select which QR code you want to save.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3">
          {options.map((opt) => (
            <div key={opt.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-sm bg-white transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${opt.bgColor}`}>
                  <opt.icon className={`w-6 h-6 ${opt.color}`} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{opt.label}</h4>
                  <p className="text-xs text-slate-500 font-medium truncate max-w-[180px] md:max-w-[220px]">
                    {opt.value}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handleDownload(opt)}
                disabled={downloadingId === opt.id}
                className="shrink-0 p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-105 active:scale-95"
                title={`Download ${opt.label} QR`}
              >
                {downloadingId === opt.id ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </button>
            </div>
          ))}

          {options.length === 0 && (
            <div className="text-center py-10">
              <p className="text-slate-500">No links available to generate QR codes.</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
