import { useState } from 'react';
import { Check, Link2, Download, Sparkles, Smartphone, ShieldAlert } from 'lucide-react';
import { downloadFlyer } from '../../utils/flyerDownloader';

export default function AllocatedQrCard({ profile, onManage, onConnect }) {
  const [isCopied, setIsCopied] = useState(false);
  const isStandyConnected = !!profile.isStandyConnected;
  const isConnected = !!profile.slug;
  const isSetupComplete = !!(profile.profileCompany || profile.profileName);
  
  // Custom Plan Badges Configuration
  const planInfo = {
    free: { name: 'Free Plan', badgeStyle: 'bg-slate-500/10 border-slate-500/25 text-slate-500 dark:text-slate-400' },
    basic: { name: 'Basic Plan', badgeStyle: 'bg-blue-500/10 border-blue-500/25 text-blue-600 dark:text-blue-400' },
    premium: { name: 'Premium Plan', badgeStyle: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-600 dark:text-indigo-400' },
    enterprise: { name: 'Enterprise Plan', badgeStyle: 'bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-450' }
  };
  const currentPlan = planInfo[profile.plan || 'free'] || planInfo.free;

  const cleanColor = '000000'; // Default black color
  const qrGeneratedUrl = isStandyConnected 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=${cleanColor}&data=${encodeURIComponent(profile.qrUrl)}`
    : '';

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!isConnected) return;
    navigator.clipboard.writeText(profile.qrUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!isStandyConnected) return;
    try {
      await downloadFlyer(profile.qrUrl, profile.slug);
    } catch (err) {
      window.open(qrGeneratedUrl, '_blank');
    }
  };

  return (
    <>
      {/* Mobile-only compact list row view */}
      <div 
        onClick={() => onManage(profile._id)}
        className="flex md:hidden p-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-indigo-500/50 rounded-2xl items-center justify-between gap-3 transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md active:scale-[0.99] text-slate-900 dark:text-white"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Mini preview / icon */}
          <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center shrink-0 shadow-sm">
            {isStandyConnected ? (
              <img 
                src={qrGeneratedUrl} 
                alt={`QR ${profile.slug}`} 
                className="w-10 h-10 object-contain select-none bg-white p-0.5 rounded-lg"
              />
            ) : (
              <Smartphone className="w-5 h-5 text-amber-500/80" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`px-1.5 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${currentPlan.badgeStyle}`}>
                {currentPlan.name}
              </span>
              <span className={`px-1.5 py-0.5 rounded-full border text-[8px] font-bold ${
                isStandyConnected 
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' 
                  : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
              }`}>
                {isStandyConnected ? `ID: ${profile.slug}` : 'Standy Pending'}
              </span>
            </div>
            <span className="text-[10px] text-slate-550 truncate block mt-1 font-semibold">
              {isConnected ? profile.qrUrl.replace('https://', '').replace('http://', '') : 'Setup profile & connect standy'}
            </span>
          </div>
        </div>

        {/* Quick Action Icons */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {isStandyConnected ? (
            <>
              <button
                onClick={handleCopy}
                className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-650 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm"
                title="Copy Link"
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-emerald-505" />
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handleDownload}
                className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-650 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm"
                title="Download Flyer"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCopy}
                className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-650 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm"
                title="Copy Link"
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-emerald-550" />
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => onConnect(profile._id)}
                className="px-2.5 py-1.5 rounded-lg bg-amber-550 hover:bg-amber-600 text-white flex items-center justify-center gap-1 text-[10px] font-black shadow-sm transition-all cursor-pointer"
              >
                <span>Connect</span>
              </button>
            </>
          )}
          <button
            onClick={() => onManage(profile._id)}
            className="h-8 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1 text-[10px] font-black shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Manage</span>
          </button>
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
          <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${
            isSetupComplete 
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
            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Profile / Standy Link</span>
            {isConnected ? (
              <a 
                href={profile.qrUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline truncate block"
              >
                {profile.qrUrl}
              </a>
            ) : (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-450 italic block">
                No active Standy connected.
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white hover:text-slate-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-505" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
            {isStandyConnected ? (
              <button
                onClick={handleDownload}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-transparent dark:border-white/10 cursor-pointer hover:from-indigo-500 hover:to-blue-500 shadow-md shadow-indigo-600/10"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download QR</span>
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); onConnect(profile._id); }}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-transparent shadow-md shadow-amber-500/10"
              >
                <Smartphone className="w-3.5 h-3.5 animate-bounce" />
                <span>Connect Standy</span>
              </button>
            )}
          </div>

          <button
            onClick={() => onManage(profile._id)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer border border-transparent dark:border-white/10 shadow-md shadow-blue-500/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customize Digital Profile</span>
          </button>
        </div>
      </div>
    </>
  );
}
