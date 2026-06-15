import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, QrCode, Smartphone, Globe } from 'lucide-react';
import { FaWhatsapp, FaInstagram, FaFacebook, FaYoutube, FaLinkedin, FaTwitter, FaGoogle } from 'react-icons/fa';

export default function DownloadQrModal({ profile, finalQrUrl, onClose }) {
  const [downloadingId, setDownloadingId] = useState(null);

  const businessName = profile.profileCompany || profile.profileName || "Digital Profile";

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

    if (finalQrUrl) {
      options.push({
        id: 'all-in-one',
        label: 'All In One QR',
        value: finalQrUrl,
        icon: QrCode,
        color: 'text-slate-900',
        bgColor: 'bg-slate-100',
        themeHex: profile.qrColor || '000000',
        actionText: 'Scan to view all our links',
        iconColor: '#2563eb'
      });
    }

    const addSocial = (id, label, value, IconComponent, colorClass, bgColorClass, themeHex, actionText, iconColor) => {
      if (value) {
        options.push({
          id,
          label,
          value: formatLink(id, value),
          icon: IconComponent,
          color: colorClass,
          bgColor: bgColorClass,
          themeHex,
          actionText,
          iconColor
        });
      }
    };

    addSocial('whatsapp', 'WhatsApp', profile.socialWhatsapp, FaWhatsapp, 'text-green-500', 'bg-green-50', '25D366', 'Chat with us on WhatsApp', '#22c55e');
    addSocial('instagram', 'Instagram', profile.socialInstagram, FaInstagram, 'text-pink-500', 'bg-pink-50', 'E1306C', 'Follow us on Instagram', '#ec4899');
    addSocial('google', 'Google Review', profile.socialGoogle, FaGoogle, 'text-red-500', 'bg-red-50', 'EA4335', 'Leave us a Review', '#ef4444');
    addSocial('facebook', 'Facebook', profile.socialFacebook, FaFacebook, 'text-blue-600', 'bg-blue-50', '1877F2', 'Like us on Facebook', '#2563eb');
    addSocial('youtube', 'YouTube', profile.socialYoutube, FaYoutube, 'text-red-600', 'bg-red-50', 'FF0000', 'Subscribe to our Channel', '#dc2626');
    addSocial('linkedin', 'LinkedIn', profile.socialLinkedin, FaLinkedin, 'text-blue-700', 'bg-blue-50', '0A66C2', 'Connect with us on LinkedIn', '#1d4ed8');
    addSocial('x', 'X (Twitter)', profile.socialX, FaTwitter, 'text-slate-900', 'bg-slate-100', '000000', 'Follow us on X', '#0f172a');
    
    const upiValue = profile.bankUpiId || profile.socialUPI;
    if (upiValue) {
      options.push({
        id: 'upi',
        label: 'UPI Payment',
        value: formatLink('upi', upiValue),
        icon: Smartphone,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        themeHex: '4f46e5',
        actionText: 'Scan to Pay via UPI',
        iconColor: '#4f46e5'
      });
    }

    if (profile.profileWebsite) {
       options.push({
        id: 'website',
        label: 'Website',
        value: formatLink('website', profile.profileWebsite),
        icon: Globe,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        themeHex: '059669',
        actionText: 'Visit our Website',
        iconColor: '#059669'
      });
    }

    return options;
  };

  const options = getOptions();

  const drawRoundRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, width, height, radius);
    } else {
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + width, y, x + width, y + height, radius);
      ctx.arcTo(x + width, y + height, x, y + height, radius);
      ctx.arcTo(x, y + height, x, y, radius);
      ctx.arcTo(x, y, x + width, y, radius);
    }
    ctx.closePath();
  };

  const handleDownload = async (option) => {
    setDownloadingId(option.id);

    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&color=${option.themeHex.replace('#', '')}&data=${encodeURIComponent(option.value)}`;
      
      // Fetch as blob first to completely avoid CORS issues during canvas drawing
      const response = await fetch(qrUrl);
      if (!response.ok) throw new Error('Failed to fetch QR image from server.');
      const blob = await response.blob();
      
      const base64Url = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Load QR Image
      const qrImg = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(new Error('Failed to parse QR image.'));
        img.src = base64Url;
      });

      // Create high-res off-screen canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');

      // Define Theme Gradients
      const gradients = {
        'all-in-one': ['#2563eb', '#4338ca'],
        'whatsapp': ['#4ade80', '#047857'],
        'instagram': ['#f97316', '#ec4899', '#d946ef'],
        'google': ['#ef4444', '#eab308', '#3b82f6'],
        'facebook': ['#3b82f6', '#1e40af'],
        'youtube': ['#dc2626', '#7f1d1d'],
        'linkedin': ['#0ea5e9', '#1e40af'],
        'x': ['#334155', '#0f172a'],
        'upi': ['#6366f1', '#7e22ce'],
        'website': ['#2dd4bf', '#047857']
      };

      // 1. Draw Background Gradient
      const colors = gradients[option.id] || ['#1e293b', '#0f172a'];
      const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
      if (colors.length === 2) {
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(1, colors[1]);
      } else if (colors.length === 3) {
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(0.5, colors[1]);
        grad.addColorStop(1, colors[2]);
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1350);

      // 2. Draw Brand Pill Badge ("OneQR")
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2.5;
      const badgeW = 280;
      const badgeH = 76;
      const badgeX = 540 - badgeW / 2;
      const badgeY = 80;
      
      drawRoundRect(ctx, badgeX, badgeY, badgeW, badgeH, 38);
      ctx.fill();
      ctx.stroke();

      // Brand Text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('OneQR', 540, badgeY + badgeH / 2);

      // 3. Draw Profile / Business Name
      // Dynamically scale font size if the business name is too long to fit
      let fontSize = 64;
      ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
      while (ctx.measureText(businessName).width > 800 && fontSize > 36) {
        fontSize -= 4;
        ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;
      ctx.fillText(businessName, 540, 240);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 4. Draw White Card with Shadow
      const cardW = 680;
      const cardH = 680;
      const cardX = 540 - cardW / 2;
      const cardY = 330;
      const cardRadius = 56;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 50;
      ctx.shadowOffsetY = 20;

      ctx.fillStyle = '#FFFFFF';
      drawRoundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
      ctx.fill();

      // Reset Shadow for subsequent drawings
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowColor = 'transparent';

      // 5. Draw QR Code inside Card
      const qrSize = 580;
      const qrX = 540 - qrSize / 2;
      const qrY = cardY + (cardH - qrSize) / 2;
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // 6. Draw Theme Message
      let actionFontSize = 52;
      ctx.font = `bold ${actionFontSize}px system-ui, -apple-system, sans-serif`;
      while (ctx.measureText(option.actionText).width > 900 && actionFontSize > 32) {
        actionFontSize -= 4;
        ctx.font = `bold ${actionFontSize}px system-ui, -apple-system, sans-serif`;
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;
      ctx.fillText(option.actionText, 540, 1120);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // 7. Draw Footer (Powered by OneQR)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
      ctx.fillText('Powered by OneQR', 540, 1260);

      // 8. Download Final PNG Image
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Failed to generate final image blob.');
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${profile.slug || "QR"}_${option.id}_theme.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 'image/png');

    } catch (error) {
      console.error("Failed to generate QR template", error);
      alert(`Failed to generate QR template. Error: ${error.message || error}`);
    } finally {
      setDownloadingId(null);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Download QR Template</h3>
            <p className="text-sm text-slate-500 mt-1">Select a themed QR poster to save.</p>
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
                </div>
              </div>
              
              <button
                onClick={() => handleDownload(opt)}
                disabled={downloadingId !== null}
                className="shrink-0 p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-105 active:scale-95"
                title={`Download ${opt.label} Template`}
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
