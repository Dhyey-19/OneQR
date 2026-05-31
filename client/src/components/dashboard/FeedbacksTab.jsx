import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/apiService';
import { Star, MessageSquare, Phone, User, Calendar, Inbox, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FeedbacksTab() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/profile/feedbacks');
      if (response.status === 'success' && response.data?.feedbacks) {
        setFeedbacks(response.data.feedbacks);
      } else {
        setError('Failed to load feedbacks.');
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError(err.message || 'Error occurred while fetching feedbacks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Stats calculation
  const totalReviews = feedbacks.length;
  const averageRating = totalReviews > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  feedbacks.forEach(f => {
    if (ratingCounts[f.rating] !== undefined) {
      ratingCounts[f.rating]++;
    }
  });

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 dark:text-white">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 glass border border-slate-200 dark:border-white/10 rounded-2xl md:rounded-3xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 md:p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[#fbbc05] flex items-center justify-center">
              <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current text-[#fbbc05]" />
            </span>
            <span className="text-[10px] md:text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
              Private Reviews & Feedback
            </span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold mt-1 md:mt-2">
            Customer Feedback
          </h1>
          <p className="hidden md:block text-slate-650 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
            Constructive negative feedback (1-3 stars) from your public profiles is routed here privately to help you improve.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-350 font-bold text-xs transition-all items-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Summary stats */}
      {feedbacks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 glass border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col justify-between shadow-sm dark:shadow-glass">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Feedbacks</span>
              <span className="text-3xl font-extrabold mt-2 block tracking-tight">{totalReviews}</span>
            </div>
            <span className="text-[10px] text-slate-550 dark:text-slate-450 mt-3 block">
              Total private constructive submissions
            </span>
          </div>

          <div className="p-6 glass border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col justify-between shadow-sm dark:shadow-glass">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Average Rating</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-3xl font-extrabold tracking-tight">{averageRating}</span>
                <span className="text-slate-400 text-lg">/ 5.0</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(Number(averageRating))
                      ? 'text-[#fbbc05] fill-[#fbbc05]'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-6 glass border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm dark:shadow-glass flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rating Breakdown</span>
            <div className="space-y-1.5 mt-2">
              {[3, 2, 1].map((stars) => {
                const count = ratingCounts[stars] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2 text-xs font-semibold">
                    <span className="w-3 text-slate-500 dark:text-slate-400">{stars}★</span>
                    <div className="flex-grow h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-5 text-right text-slate-550 dark:text-slate-400">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Feedbacks Grid */}
      <div className="glass border border-slate-200 dark:border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <h3 className="text-base md:text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
            Feedback Submissions
          </h3>
        </div>

        <div className="h-px bg-slate-200 dark:bg-white/5" />

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl animate-pulse space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 bg-slate-300 dark:bg-white/10 rounded w-1/4" />
                  <div className="h-4 bg-slate-300 dark:bg-white/10 rounded w-1/6" />
                </div>
                <div className="h-12 bg-slate-300 dark:bg-white/10 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-rose-500 font-semibold text-sm">
            {error}
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500">
              <Inbox className="w-8 h-8 opacity-45 animate-pulse" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="font-bold text-slate-800 dark:text-white text-base">No Feedback Yet</h4>
              <p className="text-slate-550 dark:text-slate-400 text-xs leading-relaxed">
                Constructive feedbacks submitted by visitors rating 1-3 stars on your Google Review page will be listed here.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {feedbacks.map((f) => (
              <div
                key={f._id}
                className="p-6 glass border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 rounded-2xl transition-all shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Rating Stars & Profile tag */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < f.rating
                              ? 'text-[#fbbc05] fill-[#fbbc05]'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    {f.profile && (
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        Profile: {f.profile.profileCompany || f.profile.profileName || f.profile.slug}
                      </span>
                    )}
                  </div>

                  {/* Submission date */}
                  <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(f.createdAt)}
                  </span>
                </div>

                {/* Feedback Comment */}
                <p className="text-slate-700 dark:text-slate-300 text-sm italic font-medium leading-relaxed bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-4 rounded-xl">
                  "{f.feedbackText || 'No comment provided.'}"
                </p>

                {/* Customer Info row */}
                {(f.customerName || f.customerPhone) && (
                  <div className="flex flex-wrap gap-4 items-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5 pt-3">
                    {f.customerName && (
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-slate-450" />
                        <span className="font-bold text-slate-800 dark:text-slate-300">Name: {f.customerName}</span>
                      </div>
                    )}
                    {f.customerPhone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-slate-450" />
                        <span className="font-bold text-slate-800 dark:text-slate-300">Phone: {f.customerPhone}</span>
                        <a
                          href={`tel:${f.customerPhone}`}
                          className="ml-1 px-2.5 py-1 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg font-bold text-[10px] uppercase transition-colors"
                        >
                          Call Client
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
