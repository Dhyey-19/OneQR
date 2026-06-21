import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Star,
  ArrowRight,
  Info,
  X,
  Zap,
  FileText,
  Loader2,
} from "lucide-react";

export default function PlansTab({ onUpgrade, isPaymentLoading, currentUser }) {
  const [selectedPlan, setSelectedPlan] = useState(null); // For details bottom sheet
  const [activeSubTab, setActiveSubTab] = useState("plans"); // 'plans' | 'history'

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

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      description:
        "Essential tools to create a digital business profile and launch your smart QR business card.",
      price: 499,
      originalPrice: 999,
      savings: "Save ₹500 (50% Off)",
      validity: "Lifetime",
      features: [
        "No Physical Standee (Website Only)",
        "Unlimited Scans",
        "Digital Business Page",
        "Professional Dashboard",
        "Limited Social Links",
      ],
      bestFor:
        "Freelancers, local shops, and individuals starting their digital business card journey.",
      isPopular: false,
      isBestSeller: false,
    },
    {
      id: "premium",
      name: "Premium Plan",
      description:
        "Unlock detailed scan analytics, document sharing, and no watermarks (Best Seller & Most Popular).",
      price: 999,
      originalPrice: 1999,
      savings: "Save ₹1,000 (50% Off)",
      validity: "Lifetime",
      features: [
        "Everything in Basic +",
        'QR Standee : 4" x 4"',
        "Customized Social Links",
        "Theme Based QR",
        "Digital Visiting Card",
        "Documents Upload",
        "AI Google Reviews",
      ],
      bestFor:
        "Restaurants, cafes, retail stores, gyms, agencies, and professional services.",
      isPopular: true,
      isBestSeller: true,
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      description:
        "Advanced tools for larger brands requiring dedicated setups, custom links, and infinite scans.",
      price: 1999,
      originalPrice: 3999,
      savings: "Save ₹2,000 (50% Off)",
      validity: "Lifetime",
      features: [
        "Everything in Premium +",
        "QR Standee : Customized",
        "Greetings Templates",
        "Photo Gallery",
        "Offers & Coupons",
        "QR Scan Analytics",
        "Link Analytics",
        "Custom Form",
      ],
      bestFor:
        "Hotels, large retail chains, enterprise teams, and multi-location businesses.",
      isPopular: false,
      isBestSeller: false,
    },
  ];

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
  };
  const handleBuyNow = (planId) => {
    setSelectedPlan(null);
    if (onUpgrade) {
      onUpgrade(planId);
    }
  };
  return (
    <div
      className={`mx-auto space-y-6 px-2 sm:px-0 pb-12 transition-all duration-300 ${activeSubTab === "plans" ? "max-w-5xl" : "max-w-4xl"}`}
    >
      {/* Segmented Control / Tab Switcher */}
      <div className="flex justify-center">
        <div className="flex p-1 bg-slate-100  border border-slate-200  rounded-2xl shadow-inner max-w-xs sm:max-w-sm w-full">
          <button
            onClick={() => setActiveSubTab("plans")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
              activeSubTab === "plans"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-500  hover:text-slate-805 "
            }`}
          >
            Available Plans
          </button>
          <button
            onClick={() => setActiveSubTab("history")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
              activeSubTab === "history"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-500  hover:text-slate-805 "
            }`}
          >
            Payment History
          </button>
        </div>
      </div>

      {activeSubTab === "plans" ? (
        <>
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 ">
              Pricing Plans
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 ">
              Select a dynamic profile plan to upgrade your OneQR experience.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {plans.map((plan) => {
              const hasPurchased = currentUser?.orderHistory?.some(order => order.planId === plan.id && order.status === "success");

              return (
              <div
                key={plan.id}
                onClick={() => handlePlanClick(plan)}
                className={`bg-white rounded-3xl p-6 border ${hasPurchased ? 'border-blue-500 shadow-lg ring-1 ring-blue-500/20' : 'border-slate-100 hover:border-slate-300'} transition-all shadow-md hover:shadow-xl relative overflow-hidden flex flex-col justify-between`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white font-extrabold text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl flex items-center gap-1 shadow-sm shadow-blue-500/20">
                    <Star className="w-3 h-3 fill-white" />
                    <span>Best Seller</span>
                  </div>
                )}

                <div className="space-y-5 text-left mb-6">
                  {/* Plan Header */}
                  <div className="space-y-1 mt-2">
                    <h3 className="font-extrabold text-slate-900 text-xl">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 leading-none pb-4 border-b border-slate-100">
                    <span className="text-4xl font-black text-slate-900">
                      ₹{plan.price}
                    </span>
                    <span className="text-sm text-slate-400 font-medium line-through">
                      ₹{plan.originalPrice}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-2 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-blue-600" strokeWidth={3} />
                        </div>
                        <span className="text-xs text-slate-700 font-medium leading-snug">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  {hasPurchased && (
                    <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-blue-50 rounded-xl border border-blue-100">
                      <Check className="w-3.5 h-3.5 text-blue-600" strokeWidth={3} />
                      <span className="text-xs font-bold text-blue-600">Current Active Plan</span>
                    </div>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(plan.id);
                    }}
                    className={`w-full py-3 rounded-xl font-extrabold text-sm shadow-md transition-all active:scale-95 ${
                      hasPurchased 
                        ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10' 
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                    }`}
                  >
                    {hasPurchased ? 'Buy Again' : 'Upgrade Now'}
                  </button>
                  
                  <div className="text-center pt-2">
                    <button className="text-[10px] text-blue-600 font-bold hover:underline inline-flex items-center gap-1">
                      <Info className="w-3 h-3" /> Plan Details
                    </button>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </>
      ) : (
        /* Order & Payment History Section */
        <div className="p-4 md:p-8 bg-white border border-slate-100 shadow-sm rounded-2xl md:rounded-3xl relative overflow-hidden space-y-6">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600  flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 ">
              Order & Payment History
            </h3>
          </div>

          {!currentUser?.orderHistory ||
          currentUser.orderHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-500  text-xs sm:text-sm">
              No transaction records found. Your plan updates will show up here.
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
                  <thead>
                    <tr className="border-b border-slate-200  text-slate-500  font-bold">
                      <th className="pb-3 pr-4 font-semibold uppercase tracking-wider">
                        Plan Details
                      </th>
                      <th className="pb-3 px-4 font-semibold uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="pb-3 px-4 font-semibold uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="pb-3 px-4 font-semibold uppercase tracking-wider">
                        Payment ID
                      </th>
                      <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-right">
                        Amount
                      </th>
                      <th className="pb-3 pl-4 font-semibold uppercase tracking-wider text-center">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200  text-slate-700  font-medium">
                    {currentUser.orderHistory
                      .slice()
                      .reverse()
                      .map((order, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/50  transition-colors"
                        >
                          <td className="py-3.5 pr-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 ">
                                {order.planName}
                              </span>
                              <span className="text-[10px] text-slate-500  capitalize">
                                {order.planId?.replace("_", " ")}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {formatDate(order.paidAt)}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 ">
                            {order.orderId || "N/A"}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[10px] text-slate-550 ">
                            {order.paymentId || "N/A"}
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-slate-900 ">
                            ₹
                            {(() => {
                              const pid = (order.planId || "").toLowerCase();
                              if (pid.includes("basic")) return "499.00";
                              if (pid.includes("premium")) return "999.00";
                              if (pid.includes("enterprise")) return "1,999.00";
                              if (pid.includes("free")) return "0.00";
                              return order.amount
                                ? Number(order.amount).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                  })
                                : "0.00";
                            })()}
                          </td>
                          <td className="py-3.5 pl-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 ">
                              <Check className="w-3 h-3" />
                              Paid
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="block md:hidden space-y-3">
                {currentUser.orderHistory
                  .slice()
                  .reverse()
                  .map((order, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200/60  bg-slate-50/50  space-y-3 text-left"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-slate-900  text-xs sm:text-sm leading-tight">
                            {order.planName}
                          </h4>
                          <span className="text-[9px] text-slate-400  uppercase font-bold tracking-wider mt-0.5 block">
                            {order.planId?.replace("_", " ")}
                          </span>
                        </div>
                        <span className="text-sm font-black text-slate-900  shrink-0">
                          ₹
                          {(() => {
                            const pid = (order.planId || "").toLowerCase();
                            if (pid.includes("basic")) return "499.00";
                            if (pid.includes("premium")) return "999.00";
                            if (pid.includes("enterprise")) return "1,999.00";
                            if (pid.includes("free")) return "0.00";
                            return order.amount
                              ? Number(order.amount).toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                })
                              : "0.00";
                          })()}
                        </span>
                      </div>

                      <div className="h-px bg-slate-200/50 " />

                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500  leading-normal">
                        <div>
                          <span className="text-[8px] text-slate-450  block uppercase font-bold tracking-wider">
                            Date & Time
                          </span>
                          <span className="font-semibold text-slate-700 ">
                            {formatDate(order.paidAt)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-slate-455  block uppercase font-bold tracking-wider">
                            Status
                          </span>
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600  mt-0.5">
                            <Check className="w-2.5 h-2.5" /> Paid
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500  font-mono">
                        <div className="truncate">
                          <span className="text-[8px] text-slate-400  block uppercase font-bold tracking-wider font-sans">
                            Order ID
                          </span>
                          <span className="font-semibold text-slate-500 ">
                            {order.orderId || "N/A"}
                          </span>
                        </div>
                        <div className="truncate">
                          <span className="text-[8px] text-slate-400  block uppercase font-bold tracking-wider font-sans">
                            Payment ID
                          </span>
                          <span className="font-semibold text-slate-500 ">
                            {order.paymentId || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Jio-style Bottom Sheet for Plan Details */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-0 sm:px-4 overflow-hidden">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlan(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />

            {/* Bottom Sheet container */}
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="relative w-full max-w-md glass rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 border-t sm:border border-slate-200  shadow-2xl overflow-y-auto z-10 max-h-[85vh] sm:max-h-none space-y-6 text-left"
            >
              {/* Drawer drag indicator bar in mobile view */}
              <div className="sm:hidden w-12 h-1 bg-slate-300  rounded-full mx-auto -mt-2 mb-4" />

              {/* Close button */}
              <button
                onClick={() => setSelectedPlan(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100  border border-slate-200  text-slate-500  hover:text-slate-900  hover:bg-slate-200  transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Plan Header Info */}
              <div className="space-y-3 pb-4 border-b border-slate-100 ">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-baseline gap-2">
                    <span className="font-black text-2xl text-slate-900  tracking-tight">
                      ₹{selectedPlan.price}
                    </span>
                    <span className="text-sm text-slate-450  line-through">
                      ₹{selectedPlan.originalPrice}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-800 ">
                    {selectedPlan.name}
                  </h4>
                  <span className="text-xs text-slate-500  mt-1 block">
                    {selectedPlan.description}
                  </span>
                </div>
              </div>

              {/* Benefit features list */}
              <div className="space-y-4">
                <span className="text-[10px] font-black text-slate-500  uppercase tracking-widest block">
                  Benefits & Inclusions
                </span>

                <ul className="space-y-3 text-xs sm:text-sm font-semibold">
                  {selectedPlan.features.map((feat) => {
                    const isHeaderFeature = feat.startsWith("Everything in");
                    return (
                      <li key={feat} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600  shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span
                          className={`leading-normal ${
                            isHeaderFeature
                              ? "text-blue-600  font-extrabold tracking-wide uppercase text-[10px]"
                              : "text-slate-700 "
                          }`}
                        >
                          {feat}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Buy Now / Checkout Actions */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 py-3.5 rounded-xl border border-slate-200  bg-slate-50  hover:bg-slate-100  text-slate-700  font-bold text-xs transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isPaymentLoading}
                  onClick={() => handleBuyNow(selectedPlan.id)}
                  className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50 transition-all cursor-pointer text-center"
                >
                  {isPaymentLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Buy Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
