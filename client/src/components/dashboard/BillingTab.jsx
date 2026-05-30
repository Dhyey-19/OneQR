import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Check, X, ChevronRight, Globe, FileText, BarChart3, Smile, QrCode, Sparkles 
} from 'lucide-react';

export default function BillingTab({ currentUser, isPaymentLoading, handleUpgrade }) {
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'yearly'
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      description: 'Perfect for small shops and personal businesses starting their digital presence.',
      monthlyPrice: 1,
      yearlyPrice: 1,
      validity: { monthly: '30 Days', yearly: '365 Days' },
      keyBenefit: 'Smart QR Code',
      badge: 'Starter Package',
      features: [
        'Create your own digital business profile page',
        'Share one smart QR code with customers',
        'Add WhatsApp, Instagram, Facebook, and other links',
        'Let customers save your contact in one click',
        'Add shop name, address, phone number, and timings',
        'Simple colors and design customization',
        'Easy mobile-friendly page for all customers',
        'Update your business information anytime'
      ],
      apps: [
        { label: 'Profile Page', description: 'Digital Landing Page', icon: 'Globe' },
        { label: 'OneQR Code', description: 'Smart QR', icon: 'QrCode' },
        { label: '1-Click Save', description: 'Contact Card (.vcf)', icon: 'Sparkles' }
      ],
      specs: [
        { name: 'Pack validity', value: { monthly: '30 Days', yearly: '365 Days' } },
        { name: 'Total Smart QRs', value: '1 QR Code' },
        { name: 'Design Customization', value: 'Basic Colors' },
        { name: 'Profile Watermark', value: 'OneQR Branding' },
        { name: 'Visitor Analytics', value: 'Not Included' },
        { name: 'PDF Document Upload', value: 'Not Included' }
      ],
      glow: 'from-slate-800 to-slate-900'
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      description: 'Best for growing businesses that want more customers, reviews, and better branding.',
      monthlyPrice: 1,
      yearlyPrice: 1,
      validity: { monthly: '30 Days', yearly: '365 Days' },
      keyBenefit: 'Analytics & PDFs',
      badge: 'Best Value Choice',
      features: [
        'Everything in Starter, plus:',
        'See how many people scanned your QR code',
        'Track customer visits and link clicks',
        'Upload PDF menus, brochures, and product catalogs',
        'Send customers directly to your Google Review page',
        'Remove OneQR branding from your profile',
        'Create a more professional business experience',
        'Better customization and premium business tools'
      ],
      apps: [
        { label: 'PDF Menu', description: 'Catalogs & Brochures', icon: 'FileText' },
        { label: 'Analytics', description: 'Visits & Scans Tracker', icon: 'BarChart3' },
        { label: 'Google Review', description: 'Direct Review Link', icon: 'Smile' },
        { label: 'No Watermark', description: 'Remove branding', icon: 'Sparkles' }
      ],
      specs: [
        { name: 'Pack validity', value: { monthly: '30 Days', yearly: '365 Days' } },
        { name: 'Total Smart QRs', value: '1 QR Code' },
        { name: 'Design Customization', value: 'Premium Custom' },
        { name: 'Profile Watermark', value: 'No Watermark' },
        { name: 'Visitor Analytics', value: 'Included (Clicks/Visits)' },
        { name: 'PDF Document Upload', value: 'Included (Up to 5 PDFs)' }
      ],
      glow: 'from-blue-600/20 via-indigo-600/10 to-[#030712]'
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-5 h-5 text-blue-500" />;
      case 'QrCode': return <QrCode className="w-5 h-5 text-indigo-500" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'FileText': return <FileText className="w-5 h-5 text-rose-500" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5 text-emerald-500" />;
      case 'Smile': return <Smile className="w-5 h-5 text-cyan-500" />;
      default: return <Sparkles className="w-5 h-5 text-blue-500" />;
    }
  };

  const currentPlanId = currentUser?.plan || 'free';
  const isSubscribed = currentUser?.subscriptionStatus === 'active';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto px-1 sm:px-0">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-8 glass border border-slate-200 dark:border-white/10 rounded-3xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest">Billing & Subscription</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Manage Subscription Plan
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
            Upgrade your profile capabilities, unlock analytics, and manage digital integrations.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <button
            onClick={() => { navigate('/dashboard'); }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md"
          >
            &larr; Back to Dashboard
          </button>
        </div>
      </div>

      {/* Current Plan Overview Card */}
      <div className="p-5 sm:p-6 md:p-8 glass border border-slate-200 dark:border-white/5 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-500/5 to-transparent blur-2xl pointer-events-none" />
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4">Subscription Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Current Plan</span>
            <span className="text-sm sm:text-lg font-extrabold text-slate-900 dark:text-white block uppercase tracking-tight sm:mt-1">
              {currentPlanId === 'free' ? 'Free Plan' : currentPlanId.replace('_', ' ')}
            </span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Status</span>
            <span className={`inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border sm:mt-2 ${
              isSubscribed 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isSubscribed ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {isSubscribed ? 'Active' : 'Inactive / Expired'}
            </span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Valid Until</span>
            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 block sm:mt-1.5">
              {isSubscribed && currentUser?.subscriptionExpiresAt 
                ? formatDate(currentUser.subscriptionExpiresAt) 
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Selection Tiers */}
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 px-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Available Subscriptions (₹1 special promo)
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
          Activate premium layout features, catalog uploads, and rich profile metrics instantly.
        </p>

        {/* Toggle Switch */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 pt-2 sm:pt-4">
          <span className={`text-[11px] sm:text-xs font-bold ${billingPeriod === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'} transition-colors`}>
            Billed Monthly
          </span>
          <div 
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-0.5 cursor-pointer relative flex items-center shrink-0"
          >
            <div 
              className="w-5 h-5 rounded-full bg-blue-500 absolute transition-all duration-300"
              style={{
                left: billingPeriod === 'monthly' ? '2px' : 'calc(100% - 22px)'
              }}
            />
          </div>
          <span className={`text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 ${billingPeriod === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'} transition-colors whitespace-nowrap`}>
            Billed Annually
            <span className="text-[8px] sm:text-[9px] font-black uppercase px-1 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* DESKTOP VIEW: Side-by-side original pricing cards */}
      <div className="hidden md:grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        {pricingPlans.map((plan) => {
          const planKey = `${plan.id}_${billingPeriod}`;
          const isActivePlan = currentPlanId === planKey && isSubscribed;
          const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          
          return (
            <div
              key={plan.id}
              className={`group relative rounded-3xl p-8 bg-white dark:bg-slate-900/40 border ${
                isActivePlan 
                  ? 'border-emerald-500/50 shadow-glass-glow' 
                  : plan.id === 'pro' 
                    ? 'border-blue-500/30' 
                    : 'border-slate-200 dark:border-white/5 hover:border-slate-350 dark:hover:border-white/10'
              } transition-all duration-300 flex flex-col justify-between overflow-hidden`}
            >
              <div className={`absolute -inset-px rounded-3xl bg-gradient-to-tr ${plan.glow} opacity-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />

              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</span>
                  {isActivePlan ? (
                    <span className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-[9px] font-extrabold uppercase tracking-widest">
                      Current Plan
                    </span>
                  ) : plan.id === 'pro' ? (
                    <span className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] font-extrabold uppercase tracking-widest">
                      Most Popular
                    </span>
                  ) : null}
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-6">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1.5 mb-6 border-b border-slate-100 dark:border-white/5 pb-6">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    ₹{price}
                  </span>
                  <span className="text-slate-500 text-xs font-semibold">
                    / {billingPeriod === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>

                <ul className="space-y-4 mb-10">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-300 leading-normal">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={isActivePlan || isPaymentLoading}
                onClick={() => handleUpgrade(planKey)}
                className={`w-full py-3 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  isActivePlan 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-default' 
                    : plan.id === 'pro'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white border-transparent shadow-lg shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white hover:text-slate-900'
                }`}
              >
                {isPaymentLoading ? 'Processing...' : isActivePlan ? 'Active Subscribed' : 'Upgrade to Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* MOBILE VIEW: Telecom style vertical plans list */}
      <div className="block md:hidden space-y-4 max-w-2xl mx-auto px-2">
        {pricingPlans.map((plan) => {
          const planKey = `${plan.id}_${billingPeriod}`;
          const isActivePlan = currentPlanId === planKey && isSubscribed;
          const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanDetails(plan)}
              className={`group relative rounded-3xl bg-white dark:bg-slate-900/40 border cursor-pointer ${
                isActivePlan 
                  ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
                  : plan.id === 'pro' 
                    ? 'border-blue-500/35' 
                    : 'border-slate-200 dark:border-white/5 hover:border-slate-350 dark:hover:border-white/10'
              } transition-all duration-300 overflow-hidden flex flex-col`}
            >
              {/* Top Banner Accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${plan.id === 'pro' ? 'from-blue-500 to-indigo-500' : 'from-slate-400 to-slate-500'}`} />
              
              {/* Badge/Promo Banner */}
              <div className="bg-slate-50/50 dark:bg-white/5 px-4 py-2.5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {plan.badge}
                </span>
                {isActivePlan && (
                  <span className="text-[8px] sm:text-[9px] font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Current Plan
                  </span>
                )}
              </div>

              {/* Main Contents */}
              <div className="p-4 sm:p-6 flex flex-row items-center justify-between gap-4">
                {/* Left: Price */}
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    ₹{price}
                  </span>
                  <span className="text-slate-500 text-[10px] sm:text-xs">
                    / {billingPeriod === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>

                {/* Middle: Details columns */}
                <div className="flex items-center gap-6 sm:gap-10 flex-1 ml-4 sm:ml-8 border-l border-slate-100 dark:border-white/5 pl-4 sm:pl-8">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Validity</span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                      {billingPeriod === 'monthly' ? plan.validity.monthly : plan.validity.yearly}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Key Benefit</span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                      {plan.keyBenefit}
                    </span>
                  </div>
                </div>

                {/* Right: Chevron & Buy Button */}
                <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* Chevron details indicator */}
                  <button 
                    type="button"
                    onClick={() => setSelectedPlanDetails(plan)}
                    className="p-2.5 rounded-full border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    disabled={isActivePlan || isPaymentLoading}
                    onClick={() => handleUpgrade(planKey)}
                    className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold text-xs text-center border transition-all cursor-pointer shadow-md ${
                      isActivePlan 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-default shadow-none' 
                        : plan.id === 'pro'
                          ? 'bg-blue-600 hover:bg-blue-500 text-white border-transparent'
                          : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white hover:text-slate-900'
                    }`}
                  >
                    {isPaymentLoading ? '...' : isActivePlan ? 'Active' : 'Buy'}
                  </button>
                </div>
              </div>

              {/* Bottom: Feature tags list */}
              <div className="px-4 sm:px-6 pb-4 flex flex-wrap gap-1.5 items-center">
                {plan.apps.slice(0, 3).map((app, index) => (
                  <span 
                    key={index}
                    className="text-[9px] font-bold bg-blue-500/5 border border-blue-500/10 dark:border-blue-500/20 text-blue-500 dark:text-blue-400 px-2 py-0.5 rounded-md"
                  >
                    {app.label}
                  </span>
                ))}
                {plan.apps.length > 3 && (
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 pl-1">
                    +{plan.apps.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Bottom Sheet Modal */}
      <AnimatePresence>
        {selectedPlanDetails && (
          <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center p-0 md:p-4">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlanDetails(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Slide-up Container */}
            <motion.div
              initial={{ y: '100%', opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 1 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-full md:max-w-lg bg-white dark:bg-[#0c1222] border-t md:border border-slate-200 dark:border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] md:max-h-[80vh] overflow-hidden z-10 text-slate-900 dark:text-white"
            >
              {/* Drag Handle Bar for mobile */}
              <div className="w-12 h-1 bg-slate-300 dark:bg-white/10 rounded-full mx-auto my-3 shrink-0 md:hidden" />
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPlanDetails(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Scrollable details view */}
              <div className="overflow-y-auto px-5 pb-24 pt-4 space-y-6">
                
                {/* Price Display */}
                <div>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                      ₹{billingPeriod === 'monthly' ? selectedPlanDetails.monthlyPrice : selectedPlanDetails.yearlyPrice}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-bold">
                      / {billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <div className="mt-2.5">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 tracking-wider">
                      {selectedPlanDetails.badge}
                    </span>
                  </div>
                </div>

                {/* Features & Subscriptions Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    OneQR Services & Apps
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedPlanDetails.apps.map((app, index) => (
                      <div 
                        key={index}
                        className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center shrink-0">
                          {renderIcon(app.icon)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{app.label}</span>
                          <span className="text-[9px] text-slate-500 dark:text-slate-400">{app.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan details table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                    <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Plan Details Specifications
                    </h4>
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                      Premium
                    </span>
                  </div>
                  
                  <div className="border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-white/5 bg-slate-50/50 dark:bg-white/5">
                    {selectedPlanDetails.specs.map((spec, index) => {
                      const specValue = typeof spec.value === 'object' 
                        ? (billingPeriod === 'monthly' ? spec.value.monthly : spec.value.yearly) 
                        : spec.value;
                      
                      const isNotIncluded = specValue === 'Not Included';

                      return (
                        <div key={index} className="grid grid-cols-2 p-3.5 text-xs">
                          <span className="text-slate-500 dark:text-slate-400 font-semibold">{spec.name}</span>
                          <span className={`font-bold text-right ${isNotIncluded ? 'text-slate-400 dark:text-slate-600 line-through font-normal' : 'text-slate-900 dark:text-white'}`}>
                            {specValue}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sticky bottom pay container */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-[#0c1222]/95 border-t border-slate-200 dark:border-white/10 backdrop-blur-md flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedPlanDetails(null)}
                  className="px-4 py-3 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-350 font-bold text-xs rounded-2xl transition-all cursor-pointer shrink-0"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={(currentPlanId === `${selectedPlanDetails.id}_${billingPeriod}` && isSubscribed) || isPaymentLoading}
                  onClick={() => {
                    const planKey = `${selectedPlanDetails.id}_${billingPeriod}`;
                    setSelectedPlanDetails(null);
                    handleUpgrade(planKey);
                  }}
                  className={`flex-1 py-3.5 rounded-2xl font-black text-xs text-center flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-lg ${
                    currentPlanId === `${selectedPlanDetails.id}_${billingPeriod}` && isSubscribed
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-default shadow-none'
                      : 'bg-blue-600 border-transparent text-white hover:bg-blue-500 shadow-blue-500/25'
                  }`}
                >
                  {isPaymentLoading 
                    ? 'Processing...' 
                    : currentPlanId === `${selectedPlanDetails.id}_${billingPeriod}` && isSubscribed
                      ? 'Active Plan' 
                      : `Buy Now - Pay ₹${billingPeriod === 'monthly' ? selectedPlanDetails.monthlyPrice : selectedPlanDetails.yearlyPrice}.00`}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
