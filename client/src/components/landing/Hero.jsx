import { motion } from 'framer-motion';
import { ArrowRight, Smartphone, Compass, Shield, Users, QrCode, Cpu, CheckCircle } from 'lucide-react';
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
    <section id="home" className="relative min-h-[90vh] pt-32 pb-20 flex items-center overflow-hidden bg-white">
      {/* Background Modern SaaS Accents */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle mesh gradient background */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-50 opacity-70 blur-[100px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-50/60 opacity-60 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-cyan-50 opacity-40 blur-[140px]" />
        <div className="absolute inset-0 dash-grid opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Hero Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 flex flex-col items-start text-left"
        >



          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.05] mb-6 text-slate-900"
          >
            Smart Digital <br />
            <span className="text-blue-600">
              Presence
            </span> <br />
            for Professionals
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed max-w-lg mb-10"
          >
            Create interactive QR and NFC experiences. Share contact cards, capture leads, and manage your professional identity in one tap.
          </motion.p>

          {/* Trust Indicators inside content flow */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-10 text-sm font-semibold text-slate-600">
            <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> No app required</div>
            <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Free forever plan</div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="relative inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-base text-white overflow-hidden group w-full sm:w-auto text-center shadow-[0_8px_30px_rgba(37,99,235,0.24)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="absolute inset-0 w-full h-full bg-slate-900 group-hover:bg-slate-800 transition-colors" />
                <span className="relative flex items-center justify-center gap-2 z-10">
                  Open Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('signup')}
                className="relative inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-base text-white overflow-hidden group w-full sm:w-auto text-center shadow-[0_8px_30px_rgba(37,99,235,0.24)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="absolute inset-0 w-full h-full bg-blue-600 group-hover:bg-blue-700 transition-colors" />
                <span className="relative flex items-center justify-center gap-2 z-10">
                  Start for free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            )}

            <a
              href="/dtech"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-base text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow transition-all duration-300 w-full sm:w-auto text-center cursor-pointer"
            >
              <span className="relative flex items-center justify-center gap-2">
                View Live Demo
              </span>
            </a>
          </motion.div>
        </motion.div>

        {/* Hero Right Graphic - Premium SaaS Dashboard/Mockup Style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="lg:col-span-6 relative flex mt-12 lg:mt-0 items-center justify-center w-full"
        >
          {/* Main Floating Card - Glassmorphism Dashboard snippet */}
          <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl bg-white border border-slate-200 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.1)] overflow-hidden flex flex-col z-10">
            {/* Window header */}
            <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
              </div>
              <div className="mx-auto h-6 w-48 bg-white rounded-md border border-slate-200 flex items-center justify-center">
                <span className="text-[10px] font-medium text-slate-400">oneqr.co/alex</span>
              </div>
            </div>
            
            {/* App Content Simulation */}
            <div className="p-8 flex-1 bg-[#FAFAFA] flex flex-col items-center justify-center relative">
               <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border-4 border-white shadow-md flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-blue-600">AR</span>
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-1">Alex Rivera</h3>
               <p className="text-sm font-medium text-slate-500 mb-6">Product Designer</p>
               
               <div className="w-full grid grid-cols-2 gap-3">
                 <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                     <Smartphone className="w-4 h-4 text-blue-600" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Action</span>
                     <span className="text-xs font-semibold text-slate-700">Save Contact</span>
                   </div>
                 </div>
                 <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                     <Compass className="w-4 h-4 text-indigo-600" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Link</span>
                     <span className="text-xs font-semibold text-slate-700">Portfolio</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Floating Widget 1: Analytics */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-12 top-10 bg-white p-4 rounded-2xl border border-slate-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] flex items-center gap-4 z-20"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Scans</span>
              <span className="text-xl font-extrabold text-slate-900 block">14,289</span>
            </div>
          </motion.div>

          {/* Floating Widget 2: NFC Tap */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -right-8 bottom-16 bg-white p-4 rounded-2xl border border-slate-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] flex items-center gap-3 z-20"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">NFC Active</span>
              <span className="text-xs font-medium text-slate-500 block">Ready to share</span>
            </div>
          </motion.div>
          
          {/* Background decorative ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-[1px] border-slate-200 rounded-full z-0 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border-[1px] border-dashed border-slate-200 rounded-full z-0 pointer-events-none" />

        </motion.div>
      </div>
    </section>
  );
}
