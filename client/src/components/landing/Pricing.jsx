import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight } from 'lucide-react';

export default function Pricing({ onSelectPlan }) {
  const [billingPeriod, setBillingPeriod] = useState('yearly'); // 'yearly' or '3yearly'

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      description: 'Essential tools to create a digital business profile and launch your smart QR business card.',
      yearlyPrice: 499,
      yearlyOriginalPrice: 999,
      threeYearlyPrice: 999,
      threeYearlyOriginalPrice: 2999,
      savings: {
        yearly: 'Save ₹500 (50% Off)',
        three_yearly: 'Save ₹2,000 (66% Off)'
      },
      features: [
        'QR Standee : 4" x 4"',
        'Unlimited Scans',
        'Digital Business Page',
        'Professional Dashboard',
        'Limited Social Links'
      ],
      bestFor: 'Freelancers, local shops, and individuals starting their digital business card journey.',
      cta: 'Choose Basic',
      isPopular: false,
      isBestSeller: false,
      glow: 'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900',
      buttonStyle: 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white border-slate-200 dark:border-white/10'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      description: 'Unlock detailed scan analytics, document sharing, and no watermarks (Best Seller & Most Popular).',
      yearlyPrice: 999,
      yearlyOriginalPrice: 1999,
      threeYearlyPrice: 1999,
      threeYearlyOriginalPrice: 5999,
      savings: {
        yearly: 'Save ₹1,000 (50% Off)',
        three_yearly: 'Save ₹4,000 (66% Off)'
      },
      features: [
        'Everything in Basic +',
        'QR Standee : 6" x 4"',
        'Customized Social Links',
        'Theme Based QR',
        'Digital Visiting Card',
        'Documents Upload',
        'AI Google Reviews'
      ],
      bestFor: 'Restaurants, cafes, retail stores, gyms, agencies, and professional services.',
      cta: 'Upgrade to Premium',
      isPopular: true,
      isBestSeller: true,
      glow: 'from-blue-100/50 via-indigo-50/30 to-white dark:from-blue-600/20 dark:via-indigo-600/10 dark:to-[#030712]',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-400'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      description: 'Advanced tools for larger brands requiring dedicated setups, custom links, and infinite scans.',
      yearlyPrice: 2499,
      yearlyOriginalPrice: 4999,
      threeYearlyPrice: 4999,
      threeYearlyOriginalPrice: 14999,
      savings: {
        yearly: 'Save ₹2,500 (50% Off)',
        three_yearly: 'Save ₹10,000 (66% Off)'
      },
      features: [
        'Everything in Premium +',
        'QR Standee : Customized',
        'Greetings Templates',
        'Photo Gallery',
        'Offers & Coupons',
        'QR Scan Analytics',
        'Link Analytics',
        'Custom Form'
      ],
      bestFor: 'Hotels, large retail chains, enterprise teams, and multi-location businesses.',
      cta: 'Choose Enterprise',
      isPopular: false,
      isBestSeller: false,
      glow: 'from-amber-100/50 via-orange-50/30 to-white dark:from-amber-600/20 dark:via-orange-600/10 dark:to-[#030712]',
      buttonStyle: 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white border-slate-200 dark:border-white/10'
    }
  ];

  return (
    <section id="pricing" className="relative py-24 border-t border-slate-200 dark:border-white/5 overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-[20%] left-[-10vw] w-[35vw] h-[35vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10vw] w-[30vw] h-[30vw] rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 dark:text-blue-500 text-sm font-extrabold uppercase tracking-widest">
              Flexible Subscriptions
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-3 mb-6">
              Plans Built for Every Growth Phase
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
              Equip yourself or your business with physical and digital smart integrations. Choose the tier that matches your network demands.
            </p>
          </motion.div>

          {/* Billing Period Toggle Slider */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <span className={`text-xs sm:text-sm font-bold ${billingPeriod === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'} transition-colors`}>
              1 Year Plan
            </span>
            
            {/* Sliding Switch */}
            <div 
              onClick={() => setBillingPeriod(billingPeriod === 'yearly' ? '3yearly' : 'yearly')}
              className="w-14 h-7 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-0.5 cursor-pointer relative flex items-center justify-between"
            >
              <motion.div 
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-6 h-6 rounded-full bg-blue-500 absolute"
                style={{
                  left: billingPeriod === 'yearly' ? '2px' : 'calc(100% - 26px)'
                }}
              />
            </div>

            <span className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${billingPeriod === '3yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'} transition-colors`}>
              3 Year Plan
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid - Responsive 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-7xl mx-auto">
          {plans.map((plan, idx) => {
            const price = billingPeriod === 'yearly' ? plan.yearlyPrice : plan.threeYearlyPrice;
            const originalPrice = billingPeriod === 'yearly' ? plan.yearlyOriginalPrice : plan.threeYearlyOriginalPrice;
            const savingsText = billingPeriod === 'yearly' ? plan.savings.yearly : plan.savings.three_yearly;
            const hasStarBadge = plan.isPopular || plan.isBestSeller;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`group relative rounded-3xl p-8 bg-white dark:bg-slate-900/40 border ${
                  plan.isPopular 
                    ? 'border-blue-500/50 shadow-lg dark:shadow-glass-glow' 
                    : 'border-slate-200 dark:border-white/5 hover:border-slate-350 dark:hover:border-white/10'
                } transition-all duration-300 flex flex-col justify-between overflow-hidden`}
              >
                {/* Custom Colored Glow Layer */}
                <div className={`absolute -inset-px rounded-3xl bg-gradient-to-tr ${plan.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />

                <div>
                  {/* Card Popular Tag Header */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</span>
                    {hasStarBadge && (
                      <div className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-[9px] font-extrabold uppercase tracking-widest">
                        <Star className="w-2.5 h-2.5 fill-blue-500 dark:fill-blue-400" />
                        <span>Best Seller</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="flex flex-col mb-6 border-b border-slate-200 dark:border-white/5 pb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        ₹{price}
                      </span>
                      <span className="text-slate-400 dark:text-slate-550 text-lg sm:text-xl font-medium line-through">
                        ₹{originalPrice}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-slate-555 text-xs font-semibold">
                        Billed / {billingPeriod === 'yearly' ? '1 Year' : '3 Years'}
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        {savingsText}
                      </span>
                    </div>
                  </div>

                  {/* Feature check list */}
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feat) => {
                      const isHeaderFeature = feat.startsWith('Everything in');
                      return (
                        <li key={feat} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                          <span className={`text-xs sm:text-sm leading-normal font-medium ${
                            isHeaderFeature 
                              ? 'text-blue-605 dark:text-white font-extrabold tracking-wide uppercase text-[10px]' 
                              : 'text-slate-700 dark:text-white'
                          }`}>
                            {feat}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => {
                    const planKey = `${plan.id}_${billingPeriod}`;
                    if (onSelectPlan) {
                      onSelectPlan(planKey);
                    }
                  }}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm text-center flex items-center justify-center gap-2 border transition-all cursor-pointer ${plan.buttonStyle}`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
