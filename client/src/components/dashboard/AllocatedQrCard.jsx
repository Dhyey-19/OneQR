import { useState } from 'react';
import { Check, Link2, Download, Sparkles } from 'lucide-react';
import { downloadFlyer } from '../../utils/flyerDownloader';

/**
 * Local helper component for rendering allocated QR cards
 */
export default function AllocatedQrCard({ qr, onManage }) {
  const [isCopied, setIsCopied] = useState(false);
  const cleanColor = '000000'; // Default black color
  const qrGeneratedUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=${cleanColor}&data=${encodeURIComponent(qr.qrUrl)}`;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(qr.qrUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      await downloadFlyer(qr.qrUrl, qr.qrId);
    } catch (err) {
      window.open(qrGeneratedUrl, '_blank');
    }
  };

  return (
    <>
      {/* Mobile-only compact list row view */}
      <div 
        onClick={onManage}
        className="flex md:hidden p-3.5 bg-slate-550 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 rounded-2xl items-center justify-between gap-3 transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md active:scale-[0.99]"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Mini QR preview */}
          <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-sm shrink-0 border border-slate-100 flex items-center justify-center">
            <img 
              src={qrGeneratedUrl} 
              alt={`QR ${qr.qrId}`} 
              className="w-full h-full object-contain select-none"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-800 dark:text-white">
                ID: {qr.qrId}
              </span>
              <span className="px-1.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[8px] font-bold text-emerald-400">
                Active
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-450 truncate block mt-0.5 max-w-[140px] font-semibold">
              {qr.qrUrl.replace('https://', '').replace('http://', '')}
            </span>
          </div>
        </div>

        {/* Quick Action Icons */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleCopy}
            className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
            title="Copy Link"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Link2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleDownload}
            className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
            title="Download Flyer"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onManage}
            className="h-8 px-2.5 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center justify-center gap-1 text-[10px] font-extrabold shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Manage</span>
          </button>
        </div>
      </div>

      {/* Desktop-only full card view */}
      <div 
        onClick={onManage}
        className="hidden md:flex p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-blue-500/50 rounded-2xl flex-col items-center justify-between gap-4 transition-all duration-300 group shadow-sm cursor-pointer hover:shadow-md"
      >
        <div className="w-full flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400">
            ID: {qr.qrId}
          </span>
          <span className="px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[9px] font-bold text-emerald-400">
            Active
          </span>
        </div>

        <div className="relative p-3 bg-white rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-102">
          <img 
            src={qrGeneratedUrl} 
            alt={`QR Code ${qr.qrId}`} 
            className="w-32 h-32 select-none"
          />
          <div className="absolute inset-0 bg-blue-500/5 rounded-2xl border border-blue-500/10 pointer-events-none" />
        </div>

        <div className="w-full space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Redirect Destination</span>
            <a 
              href={qr.qrUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate block"
            >
              {qr.qrUrl}
            </a>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white hover:text-slate-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-transparent dark:border-white/10 cursor-pointer hover:from-blue-500 hover:to-indigo-500"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>

          <button
            onClick={onManage}
            className="w-full py-2.5 px-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer border border-transparent dark:border-white/10 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Manage Profile</span>
          </button>
        </div>
      </div>
    </>
  );
}
