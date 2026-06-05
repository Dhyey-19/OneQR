import { useState } from 'react';
import { Check, Link2, Download, Sparkles, Smartphone, ShieldAlert, ExternalLink } from 'lucide-react';
import { downloadFlyer } from '../../utils/flyerDownloader';

export default function AllocatedQrCard({ profile, onManage, onConnect }) {
  const [isCopied, setIsCopied] = useState(false);
  const isStandyConnected = !!profile.isStandyConnected;
  const isConnected = !!profile.slug;
  const isSetupComplete = !!(profile.profileCompany || profile.profileName);

  // Custom Plan Badges Configuration
  const planInfo = {
    free: { name: 'Free', badgeStyle: 'bg-slate-500/10 border-slate-500/25 text-slate-500 dark:text-slate-400' },
    basic: { name: 'Basic', badgeStyle: 'bg-blue-500/10 border-blue-500/25 text-blue-600 dark:text-blue-400' },
    premium: { name: 'Premium', badgeStyle: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-600 dark:text-indigo-400' },
    enterprise: { name: 'Enterprise', badgeStyle: 'bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-450' }
  };
  const currentPlan = planInfo[profile.plan || 'free'] || planInfo.free;

  const cleanColor = '000000'; // Default black color
  const qrUrlPrefix = import.meta.env.VITE_QR_URL_PREFIX;
  const cleanPrefix = qrUrlPrefix.endsWith('/') ? qrUrlPrefix : `${qrUrlPrefix}/`;
  const qrId = profile.qrId || profile.slug || '';
  const finalQrUrl = qrId ? `${cleanPrefix}qr/${qrId}` : '';

  const qrGeneratedUrl = isStandyConnected && finalQrUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=${cleanColor}&data=${encodeURIComponent(finalQrUrl)}`
    : '';

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!isConnected || !finalQrUrl) return;
    navigator.clipboard.writeText(finalQrUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!isStandyConnected || !finalQrUrl) return;
    try {
      await downloadFlyer(finalQrUrl, profile.slug || qrId, profile.profileCompany);
    } catch (err) {
      window.open(qrGeneratedUrl, '_blank');
    }
  };

  return (
    <>
      {/* Mobile-only full card view */}
      <div
        onClick={() => onManage(profile._id)}
        className="flex md:hidden p-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-indigo-500/50 rounded-2xl flex-col items-center justify-between gap-4 transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md active:scale-[0.99] text-slate-900 dark:text-white text-center w-full"
      >
        {/* Card Header Info */}
        <div className="w-full flex items-center justify-between gap-2">
          <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${currentPlan.badgeStyle}`}>
            {currentPlan.name} Plan
          </span>
          <span className={`px-2.5 py-1 rounded-full border text-[9px] font-bold ${isStandyConnected
            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}>
            {isStandyConnected ? `ID: ${profile.slug}` : 'Standy Pending'}
          </span>
        </div>

        {/* QR or Placeholder Image */}
        {isStandyConnected ? (
          <div className="relative p-2.5 bg-white rounded-xl shadow-md transition-transform duration-300">
            <img
              src={qrGeneratedUrl}
              alt={`QR Code ${profile.slug}`}
              className="w-28 h-28 select-none"
            />
            <div className="absolute inset-0 bg-blue-500/5 rounded-xl border border-blue-500/10 pointer-events-none" />
          </div>
        ) : (
          <div
            onClick={(e) => { e.stopPropagation(); onConnect(profile._id); }}
            className="w-32 h-32 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl bg-white dark:bg-white/5 flex flex-col items-center justify-center p-3 hover:border-amber-500 hover:bg-amber-500/5 transition-all group/placeholder shadow-inner cursor-pointer"
          >
            <ShieldAlert className="w-7 h-7 text-amber-500/80 mb-1.5" />
            <span className="text-[9px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-wider text-center">Standy Disconnected</span>
            <span className="text-[8px] text-slate-500 dark:text-slate-450 text-center mt-0.5 font-medium leading-tight">Click to connect QR</span>
          </div>
        )}

        {/* Card Details & Actions */}
        <div className="w-full space-y-3">
          <div className="space-y-0.5 text-center">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider block">Business / Profile Name</span>
            {isConnected ? (
              <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 truncate block">
                {profile.profileCompany || profile.profileName || 'Digital Profile Connected'}
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 italic block">
                Setup profile & connect standy
              </span>
            )}
            <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[10px] font-bold text-slate-550 dark:text-slate-400">
              <span>QR Scans:</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-extrabold">
                {profile.qrScanCount || 0}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 w-full" onClick={(e) => e.stopPropagation()}>
            {/* Primary Action Row */}
            {isStandyConnected ? (
              <button
                onClick={() => onManage(profile._id)}
                className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Customize Profile</span>
              </button>
            ) : (
              <button
                onClick={() => onConnect(profile._id)}
                className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Smartphone className="w-4 h-4" />
                <span>Connect Standy QR</span>
              </button>
            )}

            {/* Utility Grid Row */}
            <div className="flex gap-2 w-full">
              {isStandyConnected ? (
                <>
                  <button
                    onClick={handleCopy}
                    className={`flex-1 py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-[0.95] ${
                      isCopied
                        ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-[9px] font-bold">Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex-1 py-2 px-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-[0.95]"
                  >
                    <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-[9px] font-bold">Download QR</span>
                  </button>

                  <button
                    onClick={() => {
                      window.open(`${window.location.origin}/${profile.slug || profile.qrId || ''}`, '_blank');
                    }}
                    disabled={!profile.slug && !profile.qrId}
                    className="flex-1 py-2 px-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.95]"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-[9px] font-bold">View Page</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onManage(profile._id)}
                    className="flex-1 py-2 px-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-[0.95]"
                  >
                    <Sparkles className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-[9px] font-bold">Customize</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    disabled={!isConnected}
                    className={`flex-1 py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.95] ${
                      isCopied
                        ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-[9px] font-bold">Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      window.open(`${window.location.origin}/${profile.slug || profile.qrId || ''}`, '_blank');
                    }}
                    disabled={!profile.slug && !profile.qrId}
                    className="flex-1 py-2 px-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.95]"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-[9px] font-bold">View Page</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop-only full card view */}
      <div
        onClick={() => onManage(profile._id)}
        className="hidden md:flex p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-2xl flex-col items-center justify-between gap-5 transition-all duration-300 group shadow-sm cursor-pointer hover:shadow-md text-slate-900 dark:text-white"
      >
        {/* Card Header Info */}
        <div className="w-full flex items-center justify-between gap-2">
          <span className={`px-2.5 py-1 rounded-lg border text-xs font-black uppercase tracking-wider ${currentPlan.badgeStyle}`}>
            {currentPlan.name}
          </span>
          <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${isSetupComplete
            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'border-yellow-500/20 bg-yellow-505/10 text-yellow-600 dark:text-yellow-400'
            }`}>
            {isSetupComplete ? 'Setup Complete' : 'Setup Pending'}
          </span>
        </div>

        {/* QR or Placeholder Image */}
        {isStandyConnected ? (
          <div className="relative p-3 bg-white rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-102">
            <img
              src={qrGeneratedUrl}
              alt={`QR Code ${profile.slug}`}
              className="w-32 h-32 select-none"
            />
            <div className="absolute inset-0 bg-blue-500/5 rounded-2xl border border-blue-500/10 pointer-events-none" />
          </div>
        ) : (
          <div
            onClick={(e) => { e.stopPropagation(); onConnect(profile._id); }}
            className="w-36 h-36 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5 flex flex-col items-center justify-center p-4 hover:border-amber-500 hover:bg-amber-500/5 transition-all group/placeholder shadow-inner cursor-pointer"
          >
            <ShieldAlert className="w-8 h-8 text-amber-500/80 group-hover/placeholder:scale-110 transition-transform mb-2" />
            <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-500 uppercase tracking-wider text-center">Standy Disconnected</span>
            <span className="text-[9px] text-slate-500 dark:text-slate-450 text-center mt-1 font-medium leading-tight">Click to connect QR</span>
          </div>
        )}

        {/* Card Details & Actions */}
        <div className="w-full space-y-3.5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Business Name</span>
            {isConnected ? (
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 truncate block">
                {profile.profileCompany || profile.profileName || 'Digital Profile Connected'}
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-455 italic block">
                No active Standy connected.
              </span>
            )}
            <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-bold text-slate-550 dark:text-slate-400">
              <span>QR Scans:</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-extrabold">
                {profile.qrScanCount || 0}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full" onClick={(e) => e.stopPropagation()}>
            {isStandyConnected ? (
              <>
                <button
                  onClick={() => onManage(profile._id)}
                  className="flex-grow py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </button>

                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={handleCopy}
                    title="Copy Link"
                    className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center cursor-pointer active:scale-[0.95] ${
                      isCopied
                        ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600'
                        : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 hover:text-brand-600 dark:text-white dark:hover:text-brand-400'
                    }`}
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleDownload}
                    title="Download QR Flyer"
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 hover:text-brand-600 dark:text-white dark:hover:text-brand-400 transition-all flex items-center justify-center cursor-pointer active:scale-[0.95]"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      window.open(`${window.location.origin}/${profile.slug || profile.qrId || ''}`, '_blank');
                    }}
                    disabled={!profile.slug && !profile.qrId}
                    title="View Live Page"
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 hover:text-brand-600 dark:text-white dark:hover:text-brand-400 transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.95]"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => onConnect(profile._id)}
                  className="flex-grow py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Connect Standy</span>
                </button>

                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => onManage(profile._id)}
                    title="Customize Profile"
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 hover:text-brand-600 dark:text-white dark:hover:text-brand-400 transition-all flex items-center justify-center cursor-pointer active:scale-[0.95]"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleCopy}
                    disabled={!isConnected}
                    title="Copy Link"
                    className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed active:scale-[0.95] ${
                      isCopied
                        ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600'
                        : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 hover:text-brand-600 dark:text-white dark:hover:text-brand-400'
                    }`}
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      window.open(`${window.location.origin}/${profile.slug || profile.qrId || ''}`, '_blank');
                    }}
                    disabled={!profile.slug && !profile.qrId}
                    title="View Live Page"
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 hover:text-brand-600 dark:text-white dark:hover:text-brand-400 transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.95]"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
