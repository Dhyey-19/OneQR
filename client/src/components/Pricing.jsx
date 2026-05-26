import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight } from 'lucide-react';

export default function Pricing({ onSelectPlan }) {
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'yearly'

  const plans = [
    {
      name: 'Starter Plan',
      description: 'Perfect for small shops and personal businesses starting their digital presence.',
      monthlyPrice: 1,
      yearlyPrice: 1,
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
      bestFor: 'Small shops, freelancers, students, tuition classes, local services, and first-time users.',
      cta: 'Choose Starter',
      isPopular: false,
      glow: 'from-slate-800 to-slate-900',
      buttonStyle: 'glass-light hover:bg-white/5 text-white border-white/10'
    },
    {
      name: 'Pro Plan',
      description: 'Best for growing businesses that want more customers, reviews, and better branding.',
      monthlyPrice: 1,
      yearlyPrice: 1,
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
      bestFor: 'Restaurants, cafes, salons, gyms, retail stores, agencies, real estate businesses, and growing brands.',
      cta: 'Upgrade to Pro',
      isPopular: true,
      glow: 'from-blue-600/20 via-indigo-600/10 to-[#030712]',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-400'
    }
  ];

  return (
    <section id="pricing" className="relative py-24 border-t border-white/5 overflow-hidden">
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
            <span className="text-blue-500 text-sm font-extrabold uppercase tracking-widest">
              Flexible Subscriptions
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 mb-6">
              Plans Built for Every Growth Phase
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Equip yourself or your business with physical and digital smart integrations. Choose the tier that matches your network demands.
            </p>
          </motion.div>

          {/* Billing Period Toggle Slider */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <span className={`text-xs sm:text-sm font-bold ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-500'} transition-colors`}>
              Billed Monthly
            </span>
            
            {/* Sliding Switch */}
            <div 
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-7 rounded-full bg-white/5 border border-white/10 p-0.5 cursor-pointer relative flex items-center justify-between"
            >
              <motion.div 
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-6 h-6 rounded-full bg-blue-500 absolute"
                style={{
                  left: billingPeriod === 'monthly' ? '2px' : 'calc(100% - 26px)'
                }}
              />
            </div>

            <span className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${billingPeriod === 'yearly' ? 'text-white' : 'text-slate-500'} transition-colors`}>
              Billed Annually
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid - Centered 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {plans.map((plan, idx) => {
            const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`group relative rounded-3xl p-8 bg-slate-900/40 border ${
                  plan.isPopular 
                    ? 'border-blue-500/50 shadow-glass-glow' 
                    : 'border-white/5 hover:border-white/10'
                } transition-all duration-300 flex flex-col justify-between overflow-hidden`}
              >
                {/* Custom Colored Glow Layer */}
                <div className={`absolute -inset-px rounded-3xl bg-gradient-to-tr ${plan.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />

                <div>
                  {/* Card Popular Tag Header */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold text-white">{plan.name}</span>
                    {plan.isPopular && (
                      <div className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] font-extrabold uppercase tracking-widest">
                        <Star className="w-2.5 h-2.5 fill-blue-400 animate-spin-slow" />
                        <span>Most Popular</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-6 border-b border-white/5 pb-6">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                      ₹{price}
                    </span>
                    <span className="text-slate-500 text-xs sm:text-sm font-semibold">
                      / {billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>

                  {/* Feature check list */}
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feat) => {
                      const isHeaderFeature = feat.includes('Everything in Starter');
                      return (
                        <li key={feat} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                          <span className={`text-xs sm:text-sm leading-normal ${isHeaderFeature ? 'text-white font-bold italic' : 'text-slate-300'}`}>
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
                    const planKey = plan.name.toLowerCase().includes('starter') ? `starter_${billingPeriod}` : `pro_${billingPeriod}`;
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
