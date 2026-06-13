import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";

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
        className="w-full max-w-md bg-white  border border-slate-200  rounded-3xl p-8 shadow-2xl relative text-center space-y-6 overflow-hidden animate-fade-in"
      >
        {/* No background glows */}

        {/* Success Checkmark Ring */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
          <Check className="w-8 h-8" />
        </div>

        {/* Copy/Content block */}
        <div className="space-y-2">
          <h3 className="text-2xl font-extrabold text-slate-900  tracking-tight">
            Subscription Activated!
          </h3>
          <p className="text-slate-655  text-xs leading-relaxed">
            Thank you for upgrading! Your premium dynamic QR features,
            customized links, and design customizer are now fully unlocked.
          </p>
        </div>

        {/* Plan Details Summary Box */}
        <div className="bg-slate-50  border border-slate-100  rounded-2xl p-4 space-y-2 text-left">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500  font-medium">Activated Plan</span>
            <span className="text-slate-900  font-bold">
              {successPlanName || "Premium Plan"}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500  font-medium">Status</span>
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
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 group"
          >
            <span>Manage QR & Profile</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
