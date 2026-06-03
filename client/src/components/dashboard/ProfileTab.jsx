import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, LogOut, CheckCircle2, AlertCircle, Loader2, Calendar, X, Shield, Eye } from 'lucide-react';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export default function ProfileTab({ profiles = [] }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  
  // Form states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // UI states
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Controls the modal sheet

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!phone) {
      setFeedbackMsg('Phone number is required.');
      setStatus('error');
      return;
    }

    if (phone.length < 8) {
      setFeedbackMsg('Phone number must be at least 8 digits.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setFeedbackMsg('');

    try {
      const payload = { email, phone };
      const updatedUser = await authService.updateProfile(payload);
      setCurrentUser(updatedUser);
      setStatus('success');
      setFeedbackMsg('Profile updated successfully!');
      
      setTimeout(() => {
        setStatus('idle');
        setFeedbackMsg('');
        setIsEditing(false); // Close sheet on success
      }, 1500);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setFeedbackMsg(err.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalViews = profiles.reduce((acc, curr) => acc + (curr.profileViewCount || 0), 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-xl mx-auto space-y-6 px-2 sm:px-0 pb-12"
    >
      {/* Header Info */}
      <div className="text-center space-y-2">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-550/20 mx-auto border-2 border-white/20 dark:border-white/10">
          OQ
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-650 dark:from-white dark:to-slate-350">
          Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Your personal OneQR credentials & security parameters
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-white/10 shadow-lg relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

        {/* Member Header Row */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest block">
              Workspace Owner
            </span>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-1.5 leading-none mt-1">
              Active Member
              <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
            </h3>
          </div>

          <button
            onClick={() => {
              setStatus('idle');
              setFeedbackMsg('');
              setEmail(currentUser.email || '');
              setPhone(currentUser.phone || '');
              setIsEditing(true);
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 border border-transparent rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10 active:scale-95"
          >
            Update
          </button>
        </div>

        {/* Informational Rows list */}
        <div className="space-y-1">
          {/* Phone Row */}
          <div className="flex items-center justify-between py-3.5 px-4 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 dark:text-slate-505 font-bold block uppercase tracking-wider leading-none">
                  Phone
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-bold text-sm block mt-1">
                  {currentUser.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Email Row */}
          <div className="flex items-center justify-between py-3.5 px-4 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-white/5">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-left overflow-hidden">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider leading-none">
                  Email Address
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-bold text-sm block mt-1 break-all">
                  {currentUser.email || 'Not configured'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Views Row */}
          <div className="flex items-center justify-between py-3.5 px-4 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <Eye className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider leading-none">
                  Profile Views
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-bold text-sm block mt-1">
                  {totalViews}
                </span>
              </div>
            </div>
          </div>

          {/* Joined Row */}
          <div className="flex items-center justify-between py-3.5 px-4 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider leading-none">
                  Account Created
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-bold text-sm block mt-1">
                  {formatDate(currentUser.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout button at the end */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleLogout}
          className="w-full sm:w-auto py-3.5 px-10 rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Sign Out of Account</span>
        </button>
      </div>

      {/* Bottom Sheet / Modal Drawer for Mobile & Desktop */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex sm:items-center items-end justify-center px-0 sm:px-4 overflow-hidden">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-[#02050f]/80 backdrop-blur-md"
            />

            {/* Modal Drawer Sheet */}
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative w-full max-w-md glass rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 border-t sm:border border-slate-200 dark:border-white/10 shadow-2xl overflow-y-auto z-10 max-h-[85vh] sm:max-h-none space-y-6"
            >
              {/* Decorative Drawer handle in mobile view */}
              <div className="sm:hidden w-12 h-1 bg-slate-300 dark:bg-white/10 rounded-full mx-auto -mt-2 mb-4" />

              {/* Background Blob inside drawer */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-blue-500/15 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-left space-y-1">
                <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
                  Update Profile Details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                  Configure your mobile number and email address below.
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-5 text-left">
                {/* Phone Input */}
                <div className="space-y-1.5">
                  <label htmlFor="profile-phone" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450 dark:text-slate-500" />
                    <input
                      type="tel"
                      id="profile-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900/80 transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label htmlFor="profile-email" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-455 dark:text-slate-500" />
                    <input
                      type="email"
                      id="profile-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900/80 transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="pt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-350 font-bold text-xs transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50 transition-all cursor-pointer text-center"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Status notifications inside drawer sheet */}
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-2.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                  >
                    <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
                    <span>{feedbackMsg}</span>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center gap-2.5 text-xs font-semibold text-rose-500 dark:text-rose-400"
                  >
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>{feedbackMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
