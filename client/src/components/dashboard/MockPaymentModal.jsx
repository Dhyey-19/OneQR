import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * Mock Sandbox Payment Modal Overlay for Razorpay simulation when API keys are not configured.
 */
export default function MockPaymentModal({
  isOpen,
  onClose,
  mockPaymentData,
  isPaymentLoading,
  onCompleteMockPayment
}) {
  if (!isOpen || !mockPaymentData) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl relative space-y-6 animate-fade-in"
      >
        {/* Header banner */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-white/5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Razorpay Payment Sandbox</h4>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Simulation Mode</span>
          </div>
        </div>

        {/* Note text */}
        <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-2xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
          <p>
            <strong>Notice:</strong> Your Razorpay credentials (<code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code>) are not yet configured in the server's <code>.env</code> file.
          </p>
          <p>
            The gateway has loaded this sandbox modal to allow you to simulate a successful checkout and verify your subscription workflow end-to-end.
          </p>
        </div>

        {/* Invoice summary */}
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Selected Plan</span>
            <span className="text-slate-900 dark:text-white font-bold">{mockPaymentData.planName}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Amount to Pay</span>
            <span className="text-slate-900 dark:text-white font-extrabold">₹{(mockPaymentData.amount / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Order ID</span>
            <span className="text-slate-700 dark:text-slate-300 font-mono text-[10px]">{mockPaymentData.orderId}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            Cancel Transaction
          </button>
          <button
            type="button"
            onClick={onCompleteMockPayment}
            disabled={isPaymentLoading}
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isPaymentLoading ? 'Verifying...' : 'Authorize Payment'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
