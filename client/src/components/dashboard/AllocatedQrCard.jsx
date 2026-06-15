import { ShieldAlert } from "lucide-react";

export default function AllocatedQrCard({ profile, onViewDetails }) {
  const isStandyConnected = !!profile.isStandyConnected;
  const businessName = profile.profileCompany || profile.profileName || "Digital Profile";
  
  const qrUrlPrefix = import.meta.env.VITE_QR_URL_PREFIX || window.location.origin;
  const cleanPrefix = qrUrlPrefix.endsWith("/") ? qrUrlPrefix : `${qrUrlPrefix}/`;
  const finalQrUrl = (profile.qrId || profile.slug) ? `${cleanPrefix}qr/${profile.qrId || profile.slug}` : "";
  const qrGeneratedUrl = isStandyConnected && finalQrUrl
      ? `https://api.qrserver.com/v1/create-qr-code/?size=100x100&color=000000&data=${encodeURIComponent(finalQrUrl)}`
      : "";

  return (
    <div
      onClick={() => onViewDetails && onViewDetails(profile)}
      className="flex items-center gap-4 p-4 bg-white border border-slate-200 hover:border-indigo-500/50 rounded-2xl transition-all shadow-sm cursor-pointer hover:shadow-md active:scale-[0.99] w-full"
    >
      {/* Small Logo / Initials Avatar */}
      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
        {profile.profileLogo ? (
           <img src={profile.profileLogo} alt={businessName} className="w-full h-full object-cover" />
        ) : (
           <span className="text-sm font-bold text-slate-500 uppercase">
             {businessName.substring(0, 2)}
           </span>
        )}
      </div>

      {/* Business Name */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm md:text-base font-bold text-slate-900 truncate">
          {businessName}
        </h4>
        <p className="text-[10px] md:text-xs text-slate-500 truncate mt-0.5">
           {isStandyConnected ? `ID: ${profile.slug}` : "Setup Pending"}
        </p>
      </div>

      {/* Small QR */}
      <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-slate-50 border border-slate-200 rounded-lg">
        {isStandyConnected && qrGeneratedUrl ? (
           <img src={qrGeneratedUrl} alt="QR" className="w-8 h-8 rounded-sm mix-blend-multiply" />
        ) : (
           <ShieldAlert className="w-6 h-6 text-amber-500 opacity-80" />
        )}
      </div>
    </div>
  );
}
