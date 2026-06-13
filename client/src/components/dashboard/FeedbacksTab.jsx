import { useState, useEffect } from "react";
import { apiRequest } from "../../services/apiService";
import {
  Star,
  MessageSquare,
  Phone,
  User,
  Calendar,
  Inbox,
  ArrowLeft,
  ShieldAlert,
  Sparkles,
  Heart,
  ThumbsUp,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Helper to get beautiful custom visual profiles for each star rating
const getRatingStyle = (rating) => {
  switch (rating) {
    case 5:
      return {
        badgeText: "Exceptional",
        badgeClass: "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 ",
        cardBorderClass: "border-emerald-500/15  hover:border-emerald-500/30",
        starColorClass: "text-emerald-500 fill-emerald-500",
        bannerGrad: "from-emerald-500/5 via-transparent to-transparent",
        icon: <Sparkles className="w-3.5 h-3.5 text-emerald-500" />,
        accentShadow: "shadow-emerald-500/5",
      };
    case 4:
      return {
        badgeText: "Highly Satisfied",
        badgeClass: "bg-blue-500/10 border-blue-500/25 text-blue-600 ",
        cardBorderClass: "border-blue-500/15  hover:border-blue-500/30",
        starColorClass: "text-blue-500 fill-blue-500",
        bannerGrad: "from-blue-500/5 via-transparent to-transparent",
        icon: <ThumbsUp className="w-3.5 h-3.5 text-blue-500" />,
        accentShadow: "shadow-blue-500/5",
      };
    case 3:
      return {
        badgeText: "Average / Neutral",
        badgeClass: "bg-amber-500/10 border-amber-500/25 text-amber-600 ",
        cardBorderClass: "border-amber-500/15  hover:border-amber-500/30",
        starColorClass: "text-amber-500 fill-amber-500",
        bannerGrad: "from-amber-500/5 via-transparent to-transparent",
        icon: <MessageSquare className="w-3.5 h-3.5 text-amber-500" />,
        accentShadow: "shadow-amber-500/5",
      };
    case 2:
      return {
        badgeText: "Needs Attention",
        badgeClass: "bg-orange-500/10 border-orange-500/25 text-orange-600 ",
        cardBorderClass: "border-orange-500/15  hover:border-orange-500/30",
        starColorClass: "text-orange-500 fill-orange-500",
        bannerGrad: "from-orange-500/5 via-transparent to-transparent",
        icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />,
        accentShadow: "shadow-orange-500/5",
      };
    case 1:
    default:
      return {
        badgeText: "Critical Issue",
        badgeClass: "bg-rose-500/10 border-rose-500/25 text-rose-600 ",
        cardBorderClass: "border-rose-500/15  hover:border-rose-500/30",
        starColorClass: "text-rose-500 fill-rose-500",
        bannerGrad: "from-rose-500/5 via-transparent to-transparent",
        icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-550" />,
        accentShadow: "shadow-rose-500/5",
      };
  }
};

export default function FeedbacksTab() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', '5', '4', '3', '2', '1'
  const [activeBusinessFilter, setActiveBusinessFilter] = useState("all");

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/profile/feedbacks");
      if (response.status === "success" && response.data?.feedbacks) {
        setFeedbacks(response.data.feedbacks);
      } else {
        setError("Failed to load feedbacks.");
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setError(err.message || "Error occurred while fetching feedbacks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

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

  // Stats calculation
  const totalReviews = feedbacks.length;
  const averageRating =
    totalReviews > 0
      ? (
          feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalReviews
        ).toFixed(1)
      : "0.0";

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  feedbacks.forEach((f) => {
    if (ratingCounts[f.rating] !== undefined) {
      ratingCounts[f.rating]++;
    }
  });

  // Extract unique businesses
  const uniqueBusinesses = [];
  const businessMap = new Map();
  feedbacks.forEach((f) => {
    if (f.profile) {
      const bId = f.profile._id || f.profile.slug;
      const bName =
        f.profile.profileCompany || f.profile.profileName || f.profile.slug;
      if (bId && !businessMap.has(bId)) {
        businessMap.set(bId, bName);
        uniqueBusinesses.push({ id: bId, name: bName });
      }
    }
  });

  // Filter feedbacks list by Star Rating AND Business Profile
  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesStar =
      activeFilter === "all" || f.rating === Number(activeFilter);
    let matchesBusiness = true;
    if (activeBusinessFilter !== "all") {
      const bId = f.profile?._id || f.profile?.slug;
      matchesBusiness = bId === activeBusinessFilter;
    }
    return matchesStar && matchesBusiness;
  });

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 ">
      {/* Summary Stats Panel */}
      {feedbacks.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          <div className="p-4 md:p-6 glass border border-slate-200  rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-slate-300  transition-all">
            <div className="absolute top-0 right-0 p-3 md:p-4 opacity-15  group-hover:scale-110 group-hover:opacity-30  transition-all pointer-events-none">
              <Heart className="w-10 h-10 md:w-16 md:h-16 text-rose-500 fill-current" />
            </div>
            <div>
              <span className="text-[9px] md:text-[10px] font-extrabold text-slate-400  uppercase tracking-wider block">
                Total Submissions
              </span>
              <span className="text-2xl md:text-4xl font-black mt-1 md:mt-2 block tracking-tight text-blue-600 ">
                {totalReviews}
              </span>
            </div>
            <span className="text-[9px] md:text-[10px] text-slate-500  mt-2 md:mt-4 block line-clamp-2 md:line-clamp-none">
              Total digital profile review submissions logged
            </span>
          </div>

          <div className="p-4 md:p-6 glass border border-slate-200  rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-slate-300  transition-all">
            <div className="absolute top-0 right-0 p-3 md:p-4 opacity-15  group-hover:scale-110 group-hover:opacity-30  transition-all pointer-events-none">
              <Star className="w-10 h-10 md:w-16 md:h-16 text-amber-500 fill-current" />
            </div>
            <div>
              <span className="text-[9px] md:text-[10px] font-extrabold text-slate-400  uppercase tracking-wider block">
                Average Satisfaction
              </span>
              <div className="flex items-baseline md:items-center gap-1 md:gap-2 mt-1 md:mt-2">
                <span className="text-2xl md:text-4xl font-black tracking-tight text-amber-600 ">
                  {averageRating}
                </span>
                <span className="text-slate-400 text-xs md:text-lg font-bold">
                  / 5.0
                </span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 md:gap-1 mt-2 md:mt-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 md:w-3.5 md:h-3.5 ${
                    i < Math.round(Number(averageRating))
                      ? "text-[#fbbc05] fill-[#fbbc05]"
                      : "text-slate-300 "
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 p-4 md:p-6 glass border border-slate-200  rounded-2xl shadow-sm hover:border-slate-300  transition-all flex flex-col justify-between">
            <span className="text-[9px] md:text-[10px] font-extrabold text-slate-400  uppercase tracking-wider block">
              Rating Distribution
            </span>
            <div className="space-y-1 mt-3">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars] || 0;
                const percentage =
                  totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                // Color mapping matching our rating styles
                let barColor = "bg-rose-500";
                if (stars === 5) barColor = "bg-emerald-500";
                else if (stars === 4) barColor = "bg-blue-500";
                else if (stars === 3) barColor = "bg-amber-500";
                else if (stars === 2) barColor = "bg-orange-500";

                return (
                  <div
                    key={stars}
                    className="flex items-center gap-2 text-[10px] font-extrabold"
                  >
                    <span className="w-4 text-slate-400">{stars}★</span>
                    <div className="flex-grow h-1.5 bg-slate-200  rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-5 text-right text-slate-500 ">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Feedback Grid and Filtering */}
      <div className="glass border border-slate-200  rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-6 relative overflow-hidden">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base md:text-xl font-extrabold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
              Feedbacks
            </h3>

            {/* Quick Star Filters */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100  p-1.5 border border-slate-200  rounded-xl shrink-0">
              {["all", "5", "4", "3", "2", "1"].map((filter) => {
                const isActive = activeFilter === filter;
                let label = filter === "all" ? "All" : `${filter} ★`;
                let activeBg = "bg-blue-600 text-white";
                if (filter === "5") activeBg = "bg-emerald-600 text-white";
                if (filter === "4") activeBg = "bg-blue-600 text-white";
                if (filter === "3") activeBg = "bg-amber-600 text-white";
                if (filter === "2") activeBg = "bg-orange-600 text-white";
                if (filter === "1") activeBg = "bg-rose-600 text-white";

                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all cursor-pointer ${
                      isActive
                        ? `${activeBg} shadow-sm`
                        : "text-slate-555  hover:text-slate-955 "
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business-wise Filters */}
          {uniqueBusinesses.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-150 ">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-450  mr-2">
                Filter by Business:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveBusinessFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all cursor-pointer ${
                    activeBusinessFilter === "all"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100  text-slate-550  border border-slate-200  hover:text-slate-950 "
                  }`}
                >
                  All Businesses
                </button>
                {uniqueBusinesses.map((biz) => (
                  <button
                    key={biz.id}
                    onClick={() => setActiveBusinessFilter(biz.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all cursor-pointer ${
                      activeBusinessFilter === biz.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100  text-slate-555  border border-slate-200  hover:text-slate-955 "
                    }`}
                  >
                    {biz.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-slate-200 " />

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="p-6 bg-slate-50  border border-slate-200  rounded-2xl animate-pulse space-y-4"
              >
                <div className="flex justify-between">
                  <div className="h-4 bg-slate-300  rounded w-1/4" />
                  <div className="h-4 bg-slate-300  rounded w-1/6" />
                </div>
                <div className="h-12 bg-slate-300  rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-rose-500 font-bold text-sm">
            {error}
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100  border border-slate-200  flex items-center justify-center text-slate-400 ">
              <Inbox className="w-8 h-8 opacity-45" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="font-extrabold text-slate-800  text-base">
                No Feedback Found
              </h4>
              <p className="text-slate-500  text-xs leading-relaxed">
                {activeFilter === "all"
                  ? "Feedbacks and star ratings submitted by visitors on your business profiles will be beautifully indexed here."
                  : `No feedbacks matching a ${activeFilter}-star rating filter were discovered.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="border border-slate-200  rounded-2xl overflow-hidden bg-white  divide-y divide-slate-200  shadow-sm">
            {filteredFeedbacks.map((f) => {
              const rStyle = getRatingStyle(f.rating);
              return (
                <div
                  key={f._id}
                  className="p-4 hover:bg-slate-50/50  transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 relative"
                >
                  {/* Left Side: Rating Stars, Business & Client Info */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {/* Rating Stars */}
                    <div className="flex items-center gap-0.5 bg-slate-100  px-2 py-0.5 rounded-lg border border-slate-200 ">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < f.rating
                              ? rStyle.starColorClass
                              : "text-slate-250 "
                          }`}
                        />
                      ))}
                    </div>

                    {/* Client Name (White text in Dark mode) */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 ">
                      <span className="text-slate-800  font-bold">
                        {f.customerName || "Anonymous"}
                      </span>
                    </div>
                  </div>

                  {/* Middle Content: Feedback Text (No double quotes) */}
                  <div className="flex-grow text-xs md:text-sm text-slate-700  font-medium md:px-4 break-words text-left">
                    {f.feedbackText || "No comment provided."}
                  </div>

                  {/* Right Side: Phone / Call Action & Date */}
                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 text-[10px] md:text-xs">
                    {/* Phone call button if phone exists */}
                    {f.customerPhone && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400  font-medium">
                          {f.customerPhone}
                        </span>
                        <a
                          href={`tel:${f.customerPhone}`}
                          className="px-2.5 py-1 bg-green-500/10 border border-green-500/25 hover:bg-green-500/20 text-green-600  rounded-lg font-black text-[9px] uppercase tracking-wide transition-colors cursor-pointer"
                        >
                          Call
                        </a>
                      </div>
                    )}

                    {/* Submission Date */}
                    <span className="text-slate-400  font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-350" />
                      {formatDate(f.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
