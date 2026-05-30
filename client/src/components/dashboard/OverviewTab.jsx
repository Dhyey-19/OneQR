import { useNavigate } from 'react-router-dom';
import { QrCode, Sparkles, Scan } from 'lucide-react';
import AllocatedQrCard from './AllocatedQrCard';

export default function OverviewTab({ isLoadingQrs, allocatedQrs, onManage }) {
  const navigate = useNavigate();

  // Mock telemetry data
  const stats = [
    { name: 'Total QR Scans', value: '1,842', change: '+24% this week', color: 'text-blue-500' },
    { name: 'Unique Visitors', value: '1,280', change: '+18% this week', color: 'text-cyan-400' },
    { name: 'vCard Downloads', value: '492', change: '+32% this week', color: 'text-indigo-400' },
    { name: 'Engagement Rate', value: '82.4%', change: '+5.3% this week', color: 'text-emerald-400' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-8 glass border border-slate-200 dark:border-white/10 rounded-2xl md:rounded-3xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 md:p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </span>
            <span className="text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Workspace Dashboard</span>
          </div>
          <h1 className="text-lg md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 md:mt-2">
            Welcome back!
          </h1>
          <p className="hidden md:block text-slate-650 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
            Monitor scans, check connected hardware devices, and manage your dynamic OneQR profiles.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              navigate('/scan-qr');
            }}
            className="hidden md:flex px-4 py-2.5 rounded-xl bg-[#2563eb] text-white font-bold text-xs hover:bg-[#1d4ed8] hover:shadow-lg hover:shadow-blue-500/20 transition-all border border-transparent dark:border-white/10 items-center gap-2 cursor-pointer shadow-md"
          >
            <Scan className="w-4 h-4" />
            <span>Scan QR Code</span>
          </button>
          <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] md:text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Connected to OneQR DB
          </span>
        </div>
      </div>

      {/* Core Stats Overview */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 gap-4 md:gap-6 snap-x snap-mandatory scrollbar-none">
        {stats.map((stat) => (
          <div key={stat.name} className="min-w-[170px] md:min-w-0 snap-center p-4 md:p-6 glass border border-slate-200 dark:border-white/5 hover:border-slate-350 dark:hover:border-white/10 rounded-2xl transition-all shadow-sm dark:shadow-glass flex flex-col justify-between">
            <div>
              <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{stat.name}</span>
              <span className="text-xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 md:mt-2 block tracking-tight">{stat.value}</span>
            </div>
            <span className="text-[9px] md:text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-2 md:mt-3 block">
              <strong className={stat.color}>{stat.change}</strong>
            </span>
          </div>
        ))}
      </div>

      {/* Allocated QR Codes Section */}
      <div className="glass border border-slate-200 dark:border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-4 md:space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
              Your Allocated QR Codes
            </h3>
            <p className="hidden md:block text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Manage and download the dynamic QR codes assigned to your workspace.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[9px] md:text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              {allocatedQrs.length} Total
            </span>
          </div>
        </div>

        <div className="h-px bg-slate-200 dark:bg-white/5" />

        {isLoadingQrs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl animate-pulse space-y-4">
                <div className="h-4 bg-slate-300 dark:bg-white/10 rounded w-1/3" />
                <div className="h-32 bg-slate-300 dark:bg-white/10 rounded-xl w-32 mx-auto" />
                <div className="h-8 bg-slate-300 dark:bg-white/10 rounded w-full" />
              </div>
            ))}
          </div>
        ) : allocatedQrs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500">
              <QrCode className="w-8 h-8 opacity-45 animate-pulse" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="font-bold text-slate-800 dark:text-white text-base">No QR Codes Assigned</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                You don't have any dynamic QR codes assigned to your account yet. Please contact the administrator to assign one.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {allocatedQrs.map((qr) => (
              <AllocatedQrCard 
                key={qr._id} 
                qr={qr} 
                onManage={() => onManage(qr.qrId)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
