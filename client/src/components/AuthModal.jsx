import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Phone, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AuthModal({ onClose, initialTab = 'login' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'signup'
  
  // Login Form States
  const [loginPhone, setLoginPhone] = useState(() => {
    return localStorage.getItem('oneqr_remembered_phone') || '';
  });
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => {
    return !!localStorage.getItem('oneqr_remembered_phone');
  });

  // Signup Form States
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Status & Feedback States
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Handle Login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!loginPhone || !loginPassword) {
      setFeedbackMsg('Please enter both mobile number and password.');
      setStatus('error');
      return;
    }

    if (loginPhone.length < 8) {
      setFeedbackMsg('Please enter a valid mobile number.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    // Simulate database lookup
    setTimeout(() => {
      // Check if user exists in our local storage simulation
      const users = JSON.parse(localStorage.getItem('oneqr_simulated_users') || '[]');
      const user = users.find(u => u.phone === loginPhone);

      if (!user) {
        // Provide a default demo user for easier checking
        if (loginPhone === '1234567890' && loginPassword === 'password') {
          loginSuccess();
        } else {
          setFeedbackMsg('No account found with this mobile number. Please sign up!');
          setStatus('error');
        }
      } else if (user.password !== loginPassword) {
        setFeedbackMsg('Incorrect password. Please try again.');
        setStatus('error');
      } else {
        loginSuccess();
      }
    }, 1500);
  };

  const loginSuccess = () => {
    // Handle "Remember Me" storage
    if (rememberMe) {
      localStorage.setItem('oneqr_remembered_phone', loginPhone);
    } else {
      localStorage.removeItem('oneqr_remembered_phone');
    }

    setStatus('success');
    setFeedbackMsg('Login successful! Welcome back to OneQR.');
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  // Handle Signup submission
  const handleSignupSubmit = (e) => {
    e.preventDefault();

    if (!signupPhone || !signupPassword || !signupConfirmPassword) {
      setFeedbackMsg('Please fill out all fields.');
      setStatus('error');
      return;
    }

    if (signupPhone.length < 8) {
      setFeedbackMsg('Please enter a valid mobile number.');
      setStatus('error');
      return;
    }

    if (signupPassword.length < 6) {
      setFeedbackMsg('Password must be at least 6 characters.');
      setStatus('error');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setFeedbackMsg('Passwords do not match.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    // Simulate database write
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('oneqr_simulated_users') || '[]');
      const userExists = users.some(u => u.phone === signupPhone);

      if (userExists) {
        setFeedbackMsg('An account with this mobile number already exists.');
        setStatus('error');
        return;
      }

      // Add new user
      users.push({ phone: signupPhone, password: signupPassword });
      localStorage.setItem('oneqr_simulated_users', JSON.stringify(users));

      setStatus('success');
      setFeedbackMsg('Account created successfully! Switching to Login...');
      
      // Auto transition to login tab with prefilled mobile
      setTimeout(() => {
        setLoginPhone(signupPhone);
        setSignupPhone('');
        setSignupPassword('');
        setSignupConfirmPassword('');
        setActiveTab('login');
        setStatus('idle');
        setFeedbackMsg('');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#02050f]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-md glass rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden z-10"
          >
            {/* Background Blob inside modal */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-blue-500/15 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-extrabold text-sm">
                OQ
              </div>
              <span className="font-extrabold text-lg text-white">
                One<span className="text-blue-500">QR</span>
              </span>
            </div>

            {/* Tabs Selector */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/5 border border-white/5 rounded-xl mb-8">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setStatus('idle');
                  setFeedbackMsg('');
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'login'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab('signup');
                  setStatus('idle');
                  setFeedbackMsg('');
                }}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'signup'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Dynamic Tabs Content */}
            <div className="min-h-[290px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {activeTab === 'login' ? (
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onSubmit={handleLoginSubmit}
                    className="space-y-5"
                  >
                    {/* Mobile Input */}
                    <div>
                      <label htmlFor="login-phone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="tel"
                          id="login-phone"
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="e.g. 9876543210"
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/80 transition-all"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <label htmlFor="login-pass" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="password"
                          id="login-pass"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/80 transition-all"
                        />
                      </div>
                    </div>

                    {/* Remember me & forgot details row */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-white/10 bg-white/5 text-blue-600 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
                        />
                        <span>Remember me</span>
                      </label>
                      <span className="text-blue-500 hover:underline cursor-pointer">Forgot password?</span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/15 shadow-lg shadow-blue-500/10 disabled:opacity-50 transition-all mt-4 cursor-pointer"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onSubmit={handleSignupSubmit}
                    className="space-y-4"
                  >
                    {/* Mobile Input */}
                    <div>
                      <label htmlFor="signup-phone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="tel"
                          id="signup-phone"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="e.g. 9876543210"
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/80 transition-all"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <label htmlFor="signup-pass" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Create Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="password"
                          id="signup-pass"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/80 transition-all"
                        />
                      </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                      <label htmlFor="signup-confirm" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="password"
                          id="signup-confirm"
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-slate-900/80 transition-all"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/15 shadow-lg shadow-blue-500/10 disabled:opacity-50 transition-all mt-4 cursor-pointer"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Status Notifications Alerts */}
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-6 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-2.5 text-xs font-semibold text-emerald-400"
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
                    className="mt-6 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center gap-2.5 text-xs font-semibold text-rose-400"
                  >
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>{feedbackMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Backing tip / default user details */}
              {activeTab === 'login' && status !== 'success' && (
                <div className="mt-6 p-3.5 rounded-xl bg-white/5 border border-white/5 text-[10px] text-slate-400 leading-normal text-center">
                  💡 <strong>Demo Profile:</strong> Sign up with any number OR sign in with <span className="text-blue-400">1234567890</span> and password <span className="text-blue-400">password</span>.
                </div>
              )}
            </div>
          </motion.div>
        </div>
  );
}
