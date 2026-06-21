import { useState } from "react";
import { Link2, Download, Share2, ExternalLink, CreditCard, BarChart2, Sparkles, QrCode } from "lucide-react";
import DigitalCardModal from "./DigitalCardModal";
import DownloadQrModal from "./DownloadQrModal";

export default function PlanDetailsTab({ profile, onManage, onBack, onConnectStandy }) {
  const [isCopied, setIsCopied] = useState(false);
  const [showDigitalCard, setShowDigitalCard] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const businessName = profile.profileCompany || profile.profileName || "Digital Profile";
  const planInfo = {
    free: { name: "FREE MEMBER", badgeStyle: "text-slate-600 bg-slate-100" },
    basic: { name: "BASIC MEMBER", badgeStyle: "text-blue-600 bg-blue-100" },
    premium: { name: "PREMIUM MEMBER", badgeStyle: "text-indigo-600 bg-indigo-100" },
    enterprise: { name: "ENTERPRISE MEMBER", badgeStyle: "text-amber-700 bg-amber-100" },
  };
  const currentPlan = planInfo[profile.plan || "free"] || planInfo.free;

  const qrUrlPrefix = import.meta.env.VITE_QR_URL_PREFIX || window.location.origin;
  const cleanPrefix = qrUrlPrefix.endsWith("/") ? qrUrlPrefix : `${qrUrlPrefix}/`;
  const finalQrUrl = (profile.qrId || profile.slug) ? `${cleanPrefix}qr/${profile.qrId || profile.slug}` : "";
  const qrGeneratedUrl = (profile.isStandyConnected && finalQrUrl)
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=000000&data=${encodeURIComponent(finalQrUrl)}`
    : "";

  const handleCopy = () => {
    if (!finalQrUrl) return;
    navigator.clipboard.writeText(finalQrUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 md:pb-6 space-y-6 animate-fade-in">

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-[2rem] p-4 md:p-6 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="flex flex-row justify-between items-stretch gap-4 md:gap-6 relative z-10">
          
          <div className="flex flex-col justify-between py-0.5 md:py-2 flex-1 min-w-0">
            <div>
              <span className={`px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black tracking-widest inline-flex items-center gap-1.5 w-fit ${currentPlan.badgeStyle}`}>
                👑 {currentPlan.name}
              </span>

              <div className="mt-1.5 md:mt-4">
                <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight truncate">
                  {businessName}
                </h2>
                <div className="inline-flex items-center gap-1 mt-1 md:mt-2 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[9px] md:text-xs font-medium text-slate-600 truncate max-w-full">
                  ID: {profile.slug || "Pending"} 
                  <button onClick={handleCopy} className="hover:text-blue-600 transition-colors ml-1 shrink-0">
                    <Link2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-0.5 md:space-y-1">
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${profile.isStandyConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <span className="text-[10px] md:text-sm font-bold text-slate-800">
                  {profile.isStandyConnected ? "Profile is Active" : "Setup Pending"}
                </span>
              </div>
              <p className="text-[9px] md:text-xs text-slate-500">
                Updated: {formatDate(profile.updatedAt)}
              </p>
            </div>
          </div>

          {/* Large QR Code Display */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="p-2 md:p-3 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-slate-100 rounded-xl md:rounded-2xl">
              {qrGeneratedUrl ? (
                <img src={qrGeneratedUrl} alt="QR Code" className="w-28 h-28 md:w-48 md:h-48 object-contain mix-blend-multiply" />
              ) : (
                <div className="w-28 h-28 md:w-48 md:h-48 bg-slate-50 flex flex-col items-center justify-center text-slate-400 rounded-xl md:rounded-2xl">
                  <QrCode className="w-6 h-6 md:w-10 md:h-10 mb-1 md:mb-2 opacity-50" />
                  <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-center">No QR</span>
                </div>
              )}
            </div>
          </div>

        </div>
        {/* Background decorative blob */}
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 4 Stat Blocks Row */}
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {[
          { label: "Scans", value: profile.qrScanCount || "0", trend: "Total", icon: BarChart2, color: "text-blue-600", bgColor: "bg-blue-100" },
          { label: "Views", value: profile.profileViewCount || "0", trend: "Total", icon: ExternalLink, color: "text-emerald-600", bgColor: "bg-emerald-100" },
          { label: "This Month", value: "+200%", trend: "Scans", icon: BarChart2, color: "text-emerald-600", bgColor: "bg-emerald-100" },
          { label: "CTR", value: "0%", trend: "Average", icon: Link2, color: "text-amber-600", bgColor: "bg-amber-100" }
        ].map((stat, i) => (
          <div key={i} className="aspect-square bg-white border border-slate-100 rounded-xl md:rounded-[2rem] p-1.5 md:p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center justify-center mb-1 md:mb-2">
              <div className={`w-5 h-5 md:w-10 md:h-10 rounded-md md:rounded-xl flex items-center justify-center mb-1 md:mb-2 ${stat.bgColor}`}>
                <stat.icon className={`w-3 h-3 md:w-5 md:h-5 ${stat.color}`} strokeWidth={2.5} />
              </div>
              <span className="text-[7px] md:text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">{stat.label}</span>
            </div>
            <span className={`text-sm md:text-3xl font-black ${stat.color} leading-none mb-0.5 md:mb-1.5`}>{stat.value}</span>
            <span className={`text-[6px] md:text-[10px] font-bold ${stat.color} opacity-70`}>{stat.trend}</span>
          </div>
        ))}
      </div>

      {/* Edit Profile Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => onManage(profile._id)}
          className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Edit Digital Profile
        </button>

        {!profile.isStandyConnected && (
          <button 
            onClick={() => onConnectStandy && onConnectStandy(profile._id)}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <QrCode className="w-5 h-5" />
            Connect Standy
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-start">
          <h3 className="text-base font-extrabold text-slate-900">Quick Actions</h3>
        </div>
        <div className="flex items-start justify-start gap-4 md:gap-8 w-full">
          {[
            { id: 'copy', label: isCopied ? "Copied!" : "Copy Link", icon: Link2, color: "text-blue-500", onClick: handleCopy },
            { id: 'download', label: "Download", icon: Download, color: "text-emerald-500", onClick: () => setShowDownloadModal(true) },
            { id: 'share', label: "Share QR", icon: Share2, color: "text-purple-500" },
            { id: 'view', label: "View Page", icon: ExternalLink, color: "text-orange-500", onClick: () => window.open(finalQrUrl, '_blank') },
            { id: 'card', label: "Digital Card", icon: CreditCard, color: "text-pink-500", onClick: () => setShowDigitalCard(true) },
          ].map((action) => (
            <button 
              key={action.id}
              onClick={action.onClick}
              className="flex flex-col items-center gap-1.5 md:gap-2 group"
            >
              <div className="w-[3.25rem] h-[3.25rem] md:w-14 md:h-14 bg-white border border-slate-100 shadow-sm group-hover:shadow-md rounded-2xl flex items-center justify-center transition-all group-active:scale-95">
                <action.icon className={`w-5 h-5 md:w-6 md:h-6 ${action.color}`} strokeWidth={1.5} />
              </div>
              <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Scans Overview (Mock Chart) */}
      <div className="bg-white border border-slate-100 rounded-[2rem] p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-base font-extrabold text-slate-900">Scans Overview</h3>
          <select className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 outline-none">
            <option>Last 7 Days</option>
            <option>This Month</option>
          </select>
        </div>
        
        {/* Simple CSS Bar Chart */}
        <div className="h-40 flex items-end justify-between gap-2 relative">
          {/* Y-Axis labels */}
          <div className="absolute left-0 top-0 bottom-6 w-6 flex flex-col justify-between text-[9px] font-semibold text-slate-400">
            <span>30</span>
            <span>20</span>
            <span>10</span>
            <span>0</span>
          </div>
          
          <div className="ml-8 flex-1 flex items-end justify-between h-full pb-6 relative">
             {/* Grid lines */}
             <div className="absolute left-0 right-0 bottom-6 border-b border-slate-100"></div>
             <div className="absolute left-0 right-0 bottom-[calc(33%+18px)] border-b border-slate-100 border-dashed"></div>
             <div className="absolute left-0 right-0 bottom-[calc(66%+18px)] border-b border-slate-100 border-dashed"></div>
             <div className="absolute left-0 right-0 top-0 border-b border-slate-100 border-dashed"></div>

             {[
               { day: "Mon", value: 35 },
               { day: "Tue", value: 65 },
               { day: "Wed", value: 50 },
               { day: "Thu", value: 85 },
               { day: "Fri", value: 25 },
               { day: "Sat", value: 15 },
               { day: "Sun", value: 40 },
             ].map((item, i) => (
               <div key={i} className="flex flex-col items-center gap-2 group z-10 w-full">
                 <div 
                   className="w-full max-w-[24px] bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all group-hover:opacity-80 relative"
                   style={{ height: `${item.value}%` }}
                 >
                   <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                     {Math.round((item.value / 100) * 30)}
                   </div>
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 absolute bottom-0">{item.day}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">Recent Activity</h3>
          <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View All</button>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
               <QrCode className="w-5 h-5 text-emerald-500" />
             </div>
             <div>
               <p className="text-sm font-bold text-slate-800">QR Code Scanned</p>
               <p className="text-[10px] font-medium text-slate-500 mt-0.5 flex items-center gap-1">
                 New scan from Mumbai, India 🇮🇳
               </p>
             </div>
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className="text-[10px] font-bold text-slate-400">2m ago</span>
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      </div>

      {showDigitalCard && (
        <DigitalCardModal profile={profile} onClose={() => setShowDigitalCard(false)} />
      )}
      
      {showDownloadModal && (
        <DownloadQrModal profile={profile} finalQrUrl={finalQrUrl} onClose={() => setShowDownloadModal(false)} />
      )}
    </div>
  );
}
