import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Check,
  X,
  ChevronRight,
  Globe,
  FileText,
  BarChart3,
  Smile,
  QrCode,
  Sparkles,
} from "lucide-react";

export default function BillingTab({
  currentUser,
  activeQr,
  allocatedQrs = [],
  activeQrId,
  setActiveQrId,
  isPaymentLoading,
  handleUpgrade,
}) {
  const navigate = useNavigate();
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);

  const pricingPlans = [
    {
      id: "basic",
      name: "Basic Plan",
      description:
        "Essential tools to create a digital business profile and launch your smart QR business card.",
      price: 999,
      originalPrice: 1999,
      savings: "Save ₹1,000 (50% Off)",
      validity: "Lifetime",
      keyBenefit: '4" x 4" Standee',
      badge: "Starter Package",
      features: [
        'QR Standee : 4" x 4"',
        "Unlimited Scans",
        "Digital Business Page",
        "Professional Dashboard",
        "Limited Social Links",
      ],
      apps: [
        {
          label: "Profile Page",
          description: "Digital Landing Page",
          icon: "Globe",
        },
        { label: "OneQR Code", description: "Smart QR", icon: "QrCode" },
        {
          label: '4" x 4" Standee',
          description: "Physical QR Standee",
          icon: "Sparkles",
        },
      ],
      specs: [
        { name: "Pack validity", value: "Lifetime" },
        { name: "QR Standee", value: '4" x 4"' },
        { name: "Scans", value: "Unlimited" },
        { name: "Social Links", value: "Limited" },
        { name: "AI Google Reviews", value: "Not Included" },
        { name: "Documents Upload", value: "Not Included" },
      ],
      glow: "from-slate-800 to-slate-900",
    },
    {
      id: "premium",
      name: "Premium Plan",
      description:
        "Unlock detailed scan analytics, document sharing, and no watermarks (Best Seller & Most Popular).",
      price: 1999,
      originalPrice: 3999,
      savings: "Save ₹2,000 (50% Off)",
      validity: "Lifetime",
      keyBenefit: '6" x 4" Standee',
      badge: "Best Seller & Most Popular",
      features: [
        "Everything in Basic +",
        'QR Standee : 6" x 4"',
        "Customized Social Links",
        "Theme Based QR",
        "Digital Visiting Card",
        "Documents Upload",
        "AI Google Reviews",
      ],
      apps: [
        {
          label: "PDF Upload",
          description: "Catalogs & Brochures",
          icon: "FileText",
        },
        {
          label: "AI Reviews",
          description: "Google Reviews booster",
          icon: "Smile",
        },
        {
          label: "Theme Based QR",
          description: "Bespoke QR themes",
          icon: "QrCode",
        },
        {
          label: "Photo Gallery",
          description: "Showcase products",
          icon: "Sparkles",
        },
      ],
      specs: [
        { name: "Pack validity", value: "Lifetime" },
        { name: "QR Standee", value: '6" h x 4"' },
        { name: "Scans", value: "Unlimited" },
        { name: "Social Links", value: "Customized" },
        { name: "AI Google Reviews", value: "Included" },
        { name: "Documents Upload", value: "Included (Up to 10 PDFs)" },
      ],
      glow: "from-blue-600/20 via-indigo-600/10 to-[#030712]",
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      description:
        "Advanced tools for larger brands requiring dedicated setups, custom links, and infinite scans.",
      price: 4999,
      originalPrice: 9999,
      savings: "Save ₹5,000 (50% Off)",
      validity: "Lifetime",
      keyBenefit: "Customized Standee",
      badge: "Enterprise Choice",
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
      apps: [
        {
          label: "Analytics",
          description: "QR & Link metrics",
          icon: "BarChart3",
        },
        {
          label: "Custom Design",
          description: "Bespoke designs",
          icon: "Sparkles",
        },
        {
          label: "Custom Form",
          description: "Interactive forms",
          icon: "Globe",
        },
      ],
      specs: [
        { name: "Pack validity", value: "Lifetime" },
        { name: "QR Standee", value: "Customized / Bespoke" },
        { name: "Scans", value: "Unlimited" },
        { name: "Social Links", value: "Customized" },
        { name: "Analytics Suite", value: "QR & Link Analytics" },
      ],
      glow: "from-amber-600/20 via-orange-600/10 to-[#030712]",
    },
  ];

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

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "Globe":
        return <Globe className="w-5 h-5 text-blue-500" />;
      case "QrCode":
        return <QrCode className="w-5 h-5 text-indigo-500" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case "FileText":
        return <FileText className="w-5 h-5 text-rose-500" />;
      case "BarChart3":
        return <BarChart3 className="w-5 h-5 text-emerald-500" />;
      case "Smile":
        return <Smile className="w-5 h-5 text-cyan-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-500" />;
    }
  };

  const currentPlanId = activeQr?.plan || "free";
  const isSubscribed = activeQr?.subscriptionStatus === "active";

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto px-1 sm:px-0">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-8 glass border border-slate-200  rounded-3xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Billing & Subscription
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900  mt-1">
            Manage Subscription Plan
          </h1>
          <p className="text-slate-600  text-xs sm:text-sm mt-1 leading-relaxed">
            Upgrade your profile capabilities, unlock analytics, and manage
            digital integrations.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <button
            onClick={() => {
              navigate("/dashboard");
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200  bg-slate-100  hover:bg-slate-200  hover:border-slate-350  text-slate-700  hover:text-slate-900  text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md"
          >
            &larr; Back to Dashboard
          </button>
        </div>
      </div>

      {/* QR-wise Subscriptions Grid */}
      <div className="p-5 sm:p-6 md:p-8 glass border border-slate-200  rounded-3xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-500/5 to-transparent blur-2xl pointer-events-none" />

        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 ">
            Your QR Subscriptions
          </h3>
          <p className="text-slate-500  text-xs mt-1">
            Click on any QR below to view plans and manage upgrades. Selected QR
            is highlighted.
          </p>
        </div>

        {!allocatedQrs || allocatedQrs.length === 0 ? (
          <div className="text-center py-6 text-slate-500  text-xs sm:text-sm bg-slate-50  border border-slate-100  rounded-2xl">
            No QR codes allocated yet. Please scan or claim a QR code first from
            the overview dashboard.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200  bg-slate-50/30 ">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-100/50  border-b border-slate-200  text-[10px] sm:text-xs font-black uppercase text-slate-500  tracking-wider">
                  <th className="p-4 w-16 text-center">Select</th>
                  <th className="p-4 w-20">Preview</th>
                  <th className="p-4 w-28">QR ID</th>
                  <th className="p-4">Redirect URL</th>
                  <th className="p-4 w-36">Current Plan</th>
                  <th className="p-4 w-24 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150  text-[11px] sm:text-xs">
                {allocatedQrs.map((qr) => {
                  const isSelected = activeQrId === qr.qrId;

                  // Local helpers for format
                  const localFormatPlanName = (p) => {
                    if (!p || p === "free") return "FREE";
                    switch (p) {
                      case "basic":
                        return "Basic (Lifetime)";
                      case "premium":
                        return "Premium (Lifetime)";
                      case "enterprise":
                        return "Enterprise (Lifetime)";
                      default:
                        return p
                          .replace("_yearly", " (Lifetime)")
                          .replace("_3yearly", " (Lifetime)");
                    }
                  };

                  const localGetQrStatus = (q) => {
                    if (!q)
                      return {
                        text: "Inactive",
                        className:
                          "bg-amber-500/10 border-amber-500/20 text-amber-400",
                      };
                    if (q.plan === "free") {
                      return {
                        text: "Active (Free)",
                        className:
                          "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                      };
                    }
                    return {
                      text: "Active (Lifetime)",
                      className:
                        "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                    };
                  };

                  const status = localGetQrStatus(qr);

                  return (
                    <tr
                      key={qr._id || qr.qrId}
                      onClick={() => {
                        if (setActiveQrId) setActiveQrId(qr.qrId);
                      }}
                      className={`hover:bg-slate-100/50  transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-500/5  font-semibold text-blue-600 "
                          : "text-slate-700 "
                      }`}
                    >
                      {/* Selection radio bullet indicator */}
                      <td className="p-4 text-center">
                        <div className="flex justify-center">
                          <div
                            className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? "border-blue-500 bg-blue-500 shadow-md shadow-blue-500/35 scale-110"
                                : "border-slate-300 "
                            }`}
                          >
                            {isSelected && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Small preview thumbnail */}
                      <td className="p-4">
                        <div className="w-9 h-9 rounded-lg bg-white p-0.5 border border-slate-200  flex items-center justify-center">
                          {(() => {
                            const qrUrlPrefix =
                              import.meta.env.VITE_QR_URL_PREFIX ||
                              "http://localhost:5000/";
                            const cleanPrefix = qrUrlPrefix.endsWith("/")
                              ? qrUrlPrefix
                              : `${qrUrlPrefix}/`;
                            const finalQrUrl = `${cleanPrefix}qr/${qr.qrId}`;
                            return (
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&hidesource=1&data=${encodeURIComponent(finalQrUrl)}`}
                                alt="QR"
                                className="w-8 h-8 object-contain"
                              />
                            );
                          })()}
                        </div>
                      </td>

                      {/* QR ID */}
                      <td className="p-4 font-mono font-bold tracking-tight">
                        {qr.qrId}
                      </td>

                      {/* Redirect Path */}
                      <td className="p-4 max-w-[220px] truncate font-medium">
                        {(() => {
                          const qrUrlPrefix =
                            import.meta.env.VITE_QR_URL_PREFIX ||
                            "http://localhost:5000/";
                          const cleanPrefix = qrUrlPrefix.endsWith("/")
                            ? qrUrlPrefix
                            : `${qrUrlPrefix}/`;
                          const finalQrUrl = `${cleanPrefix}qr/${qr.qrId}`;
                          return finalQrUrl
                            .replace("https://", "")
                            .replace("http://", "");
                        })()}
                      </td>

                      {/* Plan Description */}
                      <td className="p-4 font-bold">
                        {localFormatPlanName(qr.plan)}
                      </td>

                      {/* Status pill badge */}
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${status.className}`}
                        >
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Pricing Selection Tiers */}
      <div
        id="pricing-selection-tiers"
        className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 px-2 pt-6"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 ">
          Choose Your Lifetime Plan
        </h2>
        <p className="text-slate-600  text-xs sm:text-sm">
          Activate premium layout features, catalog uploads, and rich profile
          metrics instantly with a one-time payment.
        </p>
      </div>

      {/* DESKTOP VIEW: Side-by-side original pricing cards */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">
        {pricingPlans.map((plan) => {
          const isActivePlan = currentPlanId === plan.id;
          const price = plan.price;
          const originalPrice = plan.originalPrice;
          const savingsText = plan.savings;

          return (
            <div
              key={plan.id}
              className={`group relative rounded-3xl p-6 bg-white  border ${
                isActivePlan
                  ? "border-emerald-500/50 shadow-glass-glow"
                  : plan.id === "premium"
                    ? "border-blue-500/50 shadow-lg "
                    : "border-slate-200  hover:border-slate-350 "
              } transition-all duration-300 flex flex-col justify-between overflow-hidden`}
            >
              <div
                className={`absolute -inset-px rounded-3xl bg-gradient-to-tr ${plan.glow} opacity-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`}
              />

              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base font-bold text-slate-900 ">
                    {plan.name}
                  </span>
                  {isActivePlan ? (
                    <span className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/35 text-emerald-450 text-[8px] font-extrabold uppercase tracking-widest">
                      Current Plan
                    </span>
                  ) : plan.id === "premium" ? (
                    <span className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[8px] font-extrabold uppercase tracking-widest">
                      Best Seller
                    </span>
                  ) : null}
                </div>

                <p className="text-slate-600  text-[11px] leading-relaxed mb-6">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="flex flex-col mb-6 border-b border-slate-100  pb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900  tracking-tight">
                      ₹{price}
                    </span>
                    <span className="text-slate-400  text-base font-medium line-through">
                      ₹{originalPrice}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-slate-500 text-[10px] font-semibold">
                      One-time payment
                    </span>
                    <span className="text-[9px] font-extrabold text-emerald-655  bg-emerald-500/10 border border-emerald-555 px-2 py-0.5 rounded-md">
                      {savingsText}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat) => {
                    const isHeaderFeature = feat.startsWith("Everything in");
                    return (
                      <li key={feat} className="flex items-start gap-2.5">
                        <div className="w-4.5 h-4.5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span
                          className={`text-[11px] leading-normal font-semibold ${
                            isHeaderFeature
                              ? "text-blue-550  font-extrabold uppercase text-[9px] tracking-wider"
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

              <button
                type="button"
                disabled={isPaymentLoading || isActivePlan}
                onClick={() => handleUpgrade(plan.id)}
                className={`w-full py-3 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  isActivePlan
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 cursor-not-allowed"
                    : plan.id === "premium"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white border-transparent shadow-lg shadow-blue-500/20"
                      : "bg-slate-100  border-slate-200  hover:bg-slate-200  text-slate-700  hover:text-slate-900"
                }`}
              >
                {isPaymentLoading
                  ? "Processing..."
                  : isActivePlan
                    ? "Active Plan"
                    : "Select Plan"}
              </button>
            </div>
          );
        })}
      </div>

      {/* MOBILE VIEW: Telecom style vertical plans list */}
      <div className="block md:hidden space-y-4 max-w-2xl mx-auto px-2">
        {pricingPlans.map((plan) => {
          const isActivePlan = currentPlanId === plan.id;
          const price = plan.price;
          const originalPrice = plan.originalPrice;
          const savingsText = plan.savings;

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanDetails(plan)}
              className={`group relative rounded-3xl bg-white  border cursor-pointer ${
                isActivePlan
                  ? "border-emerald-500/40 shadow-lg shadow-emerald-500/5"
                  : plan.id === "premium"
                    ? "border-blue-500/35"
                    : "border-slate-200  hover:border-slate-350 "
              } transition-all duration-300 overflow-hidden flex flex-col`}
            >
              {/* Top Banner Accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${plan.id === "premium" ? "from-blue-500 to-indigo-500" : plan.id === "enterprise" ? "from-amber-500 to-orange-500" : "from-slate-400 to-slate-500"}`}
              />

              {/* Badge/Promo Banner */}
              <div className="bg-slate-50/50  px-4 py-2.5 border-b border-slate-100  flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-600  uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {plan.badge}
                </span>
                {isActivePlan && (
                  <span className="text-[8px] sm:text-[9px] font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Current Plan
                  </span>
                )}
              </div>

              {/* Main Contents */}
              <div className="p-4 sm:p-6 flex flex-row items-center justify-between gap-4">
                {/* Left: Price */}
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900  tracking-tight">
                    ₹{price}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-slate-400 text-[10px] line-through font-semibold">
                      ₹{originalPrice}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-650  bg-emerald-500/10 border border-emerald-555 px-2 py-0.5 rounded-md whitespace-nowrap">
                      {savingsText}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[9px] mt-1">
                    / lifetime
                  </span>
                </div>

                {/* Middle: Details columns */}
                <div className="flex items-center gap-6 sm:gap-10 flex-1 ml-4 sm:ml-8 border-l border-slate-100  pl-4 sm:pl-8">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                      Validity
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800  mt-0.5">
                      {plan.validity}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                      Key Benefit
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800  mt-0.5">
                      {plan.keyBenefit}
                    </span>
                  </div>
                </div>

                {/* Right: Chevron & Buy Button */}
                <div
                  className="flex items-center gap-3 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedPlanDetails(plan)}
                    className="p-2.5 rounded-full border border-slate-200  bg-slate-50  hover:bg-slate-100  hover:border-slate-350  transition-all text-slate-500 hover:text-slate-900  cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    disabled={isPaymentLoading || isActivePlan}
                    onClick={() => handleUpgrade(plan.id)}
                    className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer shadow-md ${
                      isActivePlan
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 cursor-not-allowed shadow-none"
                        : plan.id === "premium"
                          ? "bg-blue-600 hover:bg-blue-500 text-white border-transparent"
                          : "bg-slate-100  border-slate-200  hover:bg-slate-200  text-slate-700  hover:text-slate-900"
                    }`}
                  >
                    {isPaymentLoading ? "..." : isActivePlan ? "Active" : "Buy"}
                  </button>
                </div>
              </div>

              {/* Bottom: Feature tags list */}
              <div className="px-4 sm:px-6 pb-4 flex flex-wrap gap-1.5 items-center">
                {plan.features.slice(0, 3).map((feat, index) => (
                  <span
                    key={index}
                    className="text-[9px] font-bold bg-blue-500/5 border border-blue-500/10  text-blue-500  px-2 py-0.5 rounded-md"
                  >
                    {feat}
                  </span>
                ))}
                {plan.features.length > 3 && (
                  <span className="text-[9px] font-bold text-slate-450  pl-1">
                    +{plan.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order History Section */}
      <div className="p-5 sm:p-6 md:p-8 glass border border-slate-200  rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-transparent blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-6">
          <span className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 ">
            Order & Payment History
          </h3>
        </div>

        {!currentUser?.orderHistory || currentUser.orderHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-500  text-xs sm:text-sm">
            No transaction records found. Your plan updates will show up here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100  text-slate-400  font-bold">
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
              <tbody className="divide-y divide-slate-100  text-slate-700  font-medium">
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
                          <span className="text-[10px] text-slate-450  capitalize">
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
                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 ">
                        {order.paymentId || "N/A"}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900 ">
                        ₹{order.amount || "1.00"}
                      </td>
                      <td className="py-3.5 pl-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-450">
                          <Check className="w-3 h-3" />
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Bottom Sheet Modal */}
      <AnimatePresence>
        {selectedPlanDetails && (
          <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlanDetails(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%", opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 1 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-full md:max-w-lg bg-white  border-t md:border border-slate-200  rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] md:max-h-[80vh] overflow-hidden z-10 text-slate-900 "
            >
              <div className="w-12 h-1 bg-slate-300  rounded-full mx-auto my-3 shrink-0 md:hidden" />

              <button
                type="button"
                onClick={() => setSelectedPlanDetails(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200   text-slate-500  hover:text-slate-800  transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="overflow-y-auto px-5 pb-24 pt-4 space-y-6">
                <div>
                  <div className="flex flex-col mt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-900 ">
                        ₹{selectedPlanDetails.price}
                      </span>
                      <span className="text-slate-400  text-xl font-medium line-through">
                        ₹{selectedPlanDetails.originalPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-slate-555  text-xs font-bold">
                        / lifetime
                      </span>
                      <span className="text-[10px] font-bold text-emerald-650  bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {selectedPlanDetails.savings}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-600  tracking-wider">
                      {selectedPlanDetails.badge}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-500  uppercase tracking-wider">
                    OneQR Services & Apps
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedPlanDetails.apps.map((app, index) => (
                      <div
                        key={index}
                        className="p-3 bg-slate-50  border border-slate-100  rounded-2xl flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center shrink-0">
                          {renderIcon(app.icon)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800 ">
                            {app.label}
                          </span>
                          <span className="text-[9px] text-slate-555 ">
                            {app.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100  pb-2">
                    <h4 className="text-xs font-black text-slate-500  uppercase tracking-wider">
                      Plan Details Specifications
                    </h4>
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                      Premium
                    </span>
                  </div>

                  <div className="border border-slate-200  rounded-2xl overflow-hidden divide-y divide-slate-100  bg-slate-50/50 ">
                    {selectedPlanDetails.specs.map((spec, index) => {
                      const specValue = spec.value;
                      const isNotIncluded = specValue === "Not Included";

                      return (
                        <div
                          key={index}
                          className="grid grid-cols-2 p-3.5 text-xs"
                        >
                          <span className="text-slate-500  font-semibold">
                            {spec.name}
                          </span>
                          <span
                            className={`font-bold text-right ${isNotIncluded ? "text-slate-400  line-through font-normal" : "text-slate-900 "}`}
                          >
                            {specValue}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95  border-t border-slate-200  backdrop-blur-md flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedPlanDetails(null)}
                  className="px-4 py-3 border border-slate-200  bg-slate-50  hover:bg-slate-100  text-slate-700  font-bold text-xs rounded-2xl transition-all cursor-pointer shrink-0"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={
                    isPaymentLoading || currentPlanId === selectedPlanDetails.id
                  }
                  onClick={() => {
                    const planId = selectedPlanDetails.id;
                    setSelectedPlanDetails(null);
                    handleUpgrade(planId);
                  }}
                  className={`flex-1 py-3.5 rounded-2xl font-black text-xs text-center flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    currentPlanId === selectedPlanDetails.id
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 cursor-not-allowed"
                      : "bg-blue-600 border-transparent text-white hover:bg-blue-500 shadow-lg shadow-blue-500/25"
                  }`}
                >
                  {isPaymentLoading
                    ? "Processing..."
                    : currentPlanId === selectedPlanDetails.id
                      ? "Active Plan"
                      : `Buy Now - Pay ₹${selectedPlanDetails.price}.00`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
