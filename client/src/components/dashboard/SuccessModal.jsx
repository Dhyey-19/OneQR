import { motion } from 'framer-motion';
import { Check, ArrowUpRight } from 'lucide-react';

/**
 * Customized App Theme Premium Success Modal
 */
export default function SuccessModal({ isOpen, onClose, successPlanName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-[#070b19] border border-slate-200 dark:border-emerald-500/20 rounded-3xl p-8 shadow-2xl relative text-center space-y-6 overflow-hidden animate-fade-in"
      >
        {/* Background Glows */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />

        {/* Success Pulsing Checkmark Ring */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/5">
          <Check className="w-8 h-8 animate-bounce" />
        </div>

        {/* Copy/Content block */}
        <div className="space-y-2">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Subscription Activated!</h3>
          <p className="text-slate-655 dark:text-slate-400 text-xs leading-relaxed">
            Thank you for upgrading! Your premium dynamic QR features, customized links, and design customizer are now fully unlocked.
          </p>
        </div>

        {/* Plan Details Summary Box */}
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-4 space-y-2 text-left">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Activated Plan</span>
            <span className="text-slate-900 dark:text-white font-bold">{successPlanName || 'Premium Plan'}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Status</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Active (Subscribed)
            </span>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm transition-all border border-transparent dark:border-white/10 shadow-lg shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>Manage QR & Profile</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
