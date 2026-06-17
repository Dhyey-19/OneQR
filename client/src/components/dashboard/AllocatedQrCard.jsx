import { ShieldAlert, MoreVertical, ChevronRight } from "lucide-react";

export default function AllocatedQrCard({ profile, onViewDetails, onConnectStandy }) {
  const isStandyConnected = !!profile.isStandyConnected;
  const businessName = profile.profileCompany || profile.profileName || "Digital Profile";
  
  const qrUrlPrefix = import.meta.env.VITE_QR_URL_PREFIX || window.location.origin;
  const cleanPrefix = qrUrlPrefix.endsWith("/") ? qrUrlPrefix : `${qrUrlPrefix}/`;
  const finalQrUrl = (profile.qrId || profile.slug) ? `${cleanPrefix}qr/${profile.qrId || profile.slug}` : "";
  const qrGeneratedUrl = isStandyConnected && finalQrUrl
      ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=000000&data=${encodeURIComponent(finalQrUrl)}`
      : "";

  const planInfo = {
    free: { name: "FREE", style: "bg-slate-100 text-slate-600" },
    basic: { name: "BASIC", style: "bg-blue-100 text-blue-600" },
    premium: { name: "PREMIUM", style: "bg-indigo-100 text-indigo-600" },
    enterprise: { name: "ENTERPRISE", style: "bg-amber-100 text-amber-600" },
  };
  const currentPlan = planInfo[profile.plan || "free"] || planInfo.free;

  return (
    <div
      onClick={() => onViewDetails && onViewDetails(profile)}
      className="flex flex-col items-center p-5 md:p-6 bg-white border border-blue-100 hover:border-blue-300 rounded-[1.5rem] md:rounded-[2rem] shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.99] w-full h-full group"
    >
      <div className="w-full flex items-center justify-between mb-4">
        {/* Plan Type Chip */}
        <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${currentPlan.style}`}>
          {currentPlan.name}
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* QR */}
      <div className="flex-1 flex items-center justify-center w-full min-h-[100px] mb-4">
        {isStandyConnected && qrGeneratedUrl ? (
           <img src={qrGeneratedUrl} alt="QR" className="w-28 h-28 sm:w-32 sm:h-32 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
        ) : (
           <ShieldAlert className="w-10 h-10 text-amber-500 opacity-80" />
        )}
      </div>

      <div className="flex flex-col items-center w-full mt-auto">
        {/* Business Name */}
        <h4 className="text-sm md:text-base font-extrabold text-slate-900 text-center truncate w-full px-2 mb-3">
          {businessName}
        </h4>
        
        {/* View Button */}
        <div className="flex flex-col w-full gap-2 px-1">
          <button onClick={(e) => { e.stopPropagation(); onViewDetails && onViewDetails(profile); }} className="w-full flex items-center justify-center gap-1 text-[11px] font-bold text-blue-600 bg-white border border-blue-600 hover:bg-blue-50 py-2 px-2 rounded-full transition-colors">
            View Details
            <ChevronRight className="w-3 h-3" />
          </button>
          {!isStandyConnected && (
            <button onClick={(e) => { e.stopPropagation(); onConnectStandy && onConnectStandy(profile._id); }} className="w-full flex items-center justify-center gap-1 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 py-2 px-2 rounded-full transition-colors">
              Connect Standy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
