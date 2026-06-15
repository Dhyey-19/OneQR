import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode } from "lucide-react";
import AllocatedQrCard from "./AllocatedQrCard";
import { apiRequest } from "../../services/apiService";

export default function OverviewTab({
  isLoadingProfiles,
  profiles = [],
  onManageProfile,
  onConnectStandy,
  currentUser,
}) {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await apiRequest("/profile/feedbacks");
        if (response.status === "success" && response.data?.feedbacks) {
          setFeedbacks(response.data.feedbacks);
        }
      } catch (err) {
        console.error("Error fetching feedbacks for overview stats:", err);
      }
    };
    fetchFeedbacks();
  }, []);

  const totalScans = profiles.reduce(
    (acc, curr) => acc + (curr.qrScanCount || 0),
    0,
  );
  const totalViews = profiles.reduce(
    (acc, curr) => acc + (curr.profileViewCount || 0),
    0,
  );

  const totalFeedbacks = feedbacks.length;
  const averageRating =
    totalFeedbacks > 0
      ? (
          feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks
        ).toFixed(1)
      : "0.0";

  // Real-time telemetry data
  const stats = [
    {
      name: "Total QR Scans",
      value: totalScans.toLocaleString(),
      change: "Real-time scans",
      color: "text-blue-500",
    },
    {
      name: "Profile Views",
      value: totalViews.toLocaleString(),
      change: "Real-time views",
      color: "text-cyan-500",
    },
    {
      name: "Average Rating",
      value: `${averageRating} ★`,
      change: `${totalFeedbacks} Customer Reviews`,
      color: "text-amber-500",
    },
    {
      name: "Customer Feedbacks",
      value: totalFeedbacks.toLocaleString(),
      change: "Total submissions",
      color: "text-indigo-500",
    },
    {
      name: "Engagement Rate",
      value:
        totalViews > 0
          ? `${Math.min(100, Math.round((totalScans / totalViews) * 100))}%`
          : "0%",
      change: "Scans / Views",
      color: "text-emerald-500",
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Core Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className={`p-4 md:p-6 glass border border-slate-200 hover:border-slate-350 rounded-2xl transition-all shadow-sm flex flex-col justify-between ${index === 4 ? 'col-span-2 md:col-span-1' : ''}`}
          >
            <div>
              <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {stat.name}
              </span>
              <span className="text-xl md:text-3xl font-extrabold text-slate-900  mt-1 md:mt-2 block tracking-tight">
                {stat.value}
              </span>
            </div>
            <span className="text-[9px] md:text-[10px] text-slate-500  font-medium mt-2 md:mt-3 block">
              <strong className={stat.color}>{stat.change}</strong>
            </span>
          </div>
        ))}
      </div>

      {/* Active Plans & Profiles Section */}
      <div className="glass border border-slate-200  rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-4 md:space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base md:text-xl font-bold text-slate-900  flex items-center gap-2">
              <QrCode
                className="notranslate w-5 h-5 md:w-6 md:h-6 text-blue-500"
                translate="no"
              />
              Your Plans
            </h3>
            <p className="hidden md:block text-slate-650  text-xs sm:text-sm mt-1">
              Manage your dynamic digital business profiles and connect physical
              OneQR Standees.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[9px] md:text-[10px] font-bold text-blue-600  uppercase tracking-widest">
              {profiles.length} Active
            </span>
          </div>
        </div>

        <div className="h-px bg-slate-200 " />

        {isLoadingProfiles ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-6 bg-slate-50  border border-slate-200  rounded-2xl animate-pulse space-y-4"
              >
                <div className="h-4 bg-slate-300  rounded w-1/3" />
                <div className="h-32 bg-slate-300  rounded-xl w-32 mx-auto" />
                <div className="h-8 bg-slate-300  rounded w-full" />
              </div>
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100  border border-slate-200  flex items-center justify-center text-slate-400 ">
              <QrCode
                className="notranslate w-8 h-8 opacity-45"
                translate="no"
              />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="font-bold text-slate-800  text-base">
                No Active Plans Found
              </h4>
              <p className="text-slate-500  text-xs leading-relaxed">
                You don't have any active plans yet. Choose a plan from the home
                page pricing table to create a custom profile!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {profiles.map((profile) => (
              <AllocatedQrCard
                key={profile._id}
                profile={profile}
                onManage={onManageProfile}
                onConnect={onConnectStandy}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
