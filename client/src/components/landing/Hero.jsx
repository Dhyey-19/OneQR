import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, Compass, Shield, Users, QrCode, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero({ onOpenAuth }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('oneqr_current_user');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-blue-600/10 blur-[100px] animate-glow-slow" />
        <div className="absolute bottom-[20%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-cyan-500/10 blur-[120px] animate-glow-reverse" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 dash-grid opacity-[0.25]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Hero Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-50/50 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 hover:bg-blue-100 dark:hover:bg-blue-500/10 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Next-Gen Identity Platform</span>
          </motion.div>


          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-900 dark:text-white"
          >
            OneQR — Smart <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400">
              Business Presence
            </span> <br />
            Platform
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-xl mb-10"
          >
            Create interactive QR and NFC business experiences for your customers. Share contact cards, catalogs, social links, and capture leads instantly in one tap.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="relative inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-base text-white !text-white overflow-hidden group w-full sm:w-auto text-center shadow-lg shadow-blue-500/20 cursor-pointer animate-pulse-subtle"
              >
                <span className="absolute inset-0 w-full h-full bg-blue-600" />
                <span className="absolute inset-0 w-full h-full bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center gap-2 z-10 text-white !text-white">
                  Dashboard
                  <ArrowRight className="w-4 h-4 text-white !text-white group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <span className="absolute -inset-px rounded-2xl border border-white/20 pointer-events-none" />
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('signup')}
                className="relative inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-base text-white !text-white overflow-hidden group w-full sm:w-auto text-center shadow-lg shadow-blue-500/20 cursor-pointer animate-pulse-subtle"
              >
                <span className="absolute inset-0 w-full h-full bg-blue-600" />
                <span className="absolute inset-0 w-full h-full bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center gap-2 z-10 text-white !text-white">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 text-white !text-white group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <span className="absolute -inset-px rounded-2xl border border-white/20 pointer-events-none" />
              </button>
            )}

            <a
              href="/dtech"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-base text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white glass-light hover:bg-slate-100 dark:hover:bg-white/5 transition-all w-full sm:w-auto text-center cursor-pointer"
            >
              <span className="relative flex items-center justify-center gap-2">
                View Demo
              </span>
            </a>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-8 mt-12 pt-10 border-t border-slate-200 dark:border-white/5 w-full max-w-lg"
          >
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">10K+</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Businesses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">1.5M+</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">NFC Scans</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Uptime SLA</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Right Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="lg:col-span-5 relative hidden lg:flex items-center justify-center"
        >
          {/* Glowing backplate for phone */}
          <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/20 blur-[80px] pointer-events-none animate-pulse-subtle" />

          {/* Device Mockup */}
          <div className="relative w-[280px] sm:w-[320px] aspect-[9/18.5] rounded-[48px] bg-slate-950 p-3 border-[6px] border-slate-800 shadow-[0_0_80px_rgba(37,99,235,0.15)] flex flex-col overflow-hidden animate-float-slow">
            {/* Screen Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 rounded-2xl bg-black z-30 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-600" />
              </div>
            </div>

            {/* Screen Content */}
            <div className="w-full h-full rounded-[40px] bg-[#090d1a] border border-white/5 overflow-hidden flex flex-col relative">
              {/* Header Cover */}
              <div className="h-28 bg-gradient-to-tr from-blue-700 to-indigo-900 relative">
                <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl bg-slate-900 p-1 flex items-center justify-center border-4 border-[#090d1a] shadow-lg">
                  <div className="w-full h-full rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center">
                    <span className="font-extrabold text-white text-base">OQ</span>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="mt-12 px-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-white">Alex Rivera</h3>
                <p className="text-xs text-blue-400 font-medium">Creative Director @ OneQR</p>
                <p className="text-[10px] text-slate-400 mt-2 line-clamp-2">
                  Building next-gen digital connections. Tap the tags below to view links.
                </p>

                {/* Grid Links */}
                <div className="grid grid-cols-2 gap-2 mt-4 flex-1 max-h-[140px]">
                  <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2.5 flex flex-col justify-between hover:bg-slate-800 transition-colors">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-semibold text-white mt-1">Save Contact</span>
                  </div>
                  <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2.5 flex flex-col justify-between hover:bg-slate-800 transition-colors">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-semibold text-white mt-1">Portfolio Link</span>
                  </div>
                  <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2.5 flex flex-col justify-between hover:bg-slate-800 transition-colors">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-semibold text-white mt-1">Social Hub</span>
                  </div>
                  <div className="bg-slate-900/60 border border-white/5 rounded-xl p-2.5 flex flex-col justify-between hover:bg-slate-800 transition-colors">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-semibold text-white mt-1">Verified Profile</span>
                  </div>
                </div>

                {/* Instant NFC Tap CTA in Phone */}
                <div className="my-4 p-3 rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 text-center">
                  <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase block">Hold Card to Phone</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Compatible with iOS & Android</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Widget 1: Live QR Scans */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 -left-10 sm:-left-16 glass p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl flex items-center gap-3.5 z-20"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block leading-none">Weekly Scans</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white mt-1 block">4,289</span>
            </div>
          </motion.div>

          {/* Floating Widget 2: NFC Active Tap */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-12 -right-6 sm:-right-10 glass p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl flex items-center gap-3 z-20"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block leading-none">NFC Tap Active</span>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 mt-1 block">Instant contact shared</span>
            </div>
          </motion.div>

          {/* Decorative Glowing Elements */}
          <div className="absolute top-[40%] right-[-40px] w-20 h-20 rounded-full border border-blue-500/20 flex items-center justify-center animate-spin-slow pointer-events-none">
            <div className="w-10 h-10 rounded-full border border-dashed border-cyan-500/30" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
