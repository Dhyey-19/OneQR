import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight } from 'lucide-react';

export default function Pricing({ onSelectPlan }) {
  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      description: 'Essential tools to create a digital business profile and launch your smart QR business card.',
      price: 999,
      originalPrice: 1999,
      savings: 'Save ₹1,000 (50% Off)',
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
      cardStyle: 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300',
      buttonStyle: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      description: 'Unlock detailed scan analytics, document sharing, and no watermarks.',
      price: 1999,
      originalPrice: 3999,
      savings: 'Save ₹2,000 (50% Off)',
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
      cardStyle: 'bg-white border-blue-500 shadow-xl relative scale-100 md:scale-105 z-10',
      buttonStyle: 'bg-blue-600 text-white shadow-md hover:bg-blue-700 border-blue-600'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      description: 'Advanced tools for larger brands requiring dedicated setups, custom links, and infinite scans.',
      price: 4999,
      originalPrice: 9999,
      savings: 'Save ₹5,000 (50% Off)',
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
      cardStyle: 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300',
      buttonStyle: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
    }
  ];

  return (
    <section id="pricing" className="relative py-24 bg-white overflow-hidden border-t border-slate-200">
      <div className="absolute top-[20%] left-[-10vw] w-[35vw] h-[35vw] rounded-full bg-blue-50/50 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10vw] w-[30vw] h-[30vw] rounded-full bg-cyan-50/50 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest mb-4">
              Lifetime Plans
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              Plans Built for Every Growth Phase
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              Equip yourself or your business with physical and digital smart integrations. Choose the tier that matches your network demands.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-7xl mx-auto">
          {plans.map((plan, idx) => {
            const hasStarBadge = plan.isPopular || plan.isBestSeller;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`group rounded-[2rem] p-8 border transition-all duration-300 flex flex-col justify-between overflow-hidden ${plan.cardStyle}`}
              >
                {hasStarBadge && (
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400" />
                )}

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-2xl font-bold text-slate-900">{plan.name}</span>
                    {hasStarBadge && (
                      <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
                        <Star className="w-3 h-3 fill-blue-500 text-blue-500" />
                        <span>Best Seller</span>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                    {plan.description}
                  </p>

                  <div className="flex flex-col mb-8 border-b border-slate-100 pb-8">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-5xl font-extrabold text-slate-900 tracking-tight">
                        ₹{plan.price}
                      </span>
                      <span className="text-slate-400 text-xl font-medium line-through">
                        ₹{plan.originalPrice}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5 mt-3">
                      <span className="text-slate-600 text-xs font-bold uppercase tracking-wide">
                        One-time payment
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md tracking-wider">
                        {plan.savings}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feat) => {
                      const isHeaderFeature = feat.startsWith('Everything in');
                      return (
                        <li key={feat} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${hasStarBadge ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Check className="w-3 h-3" />
                          </div>
                           <span className={`text-sm leading-normal ${
                            isHeaderFeature 
                              ? 'text-blue-700 font-bold uppercase text-[11px] tracking-wide' 
                              : 'text-slate-700 font-medium'
                          }`}>
                            {feat}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    if (onSelectPlan) {
                      onSelectPlan(plan.id);
                    }
                  }}
                  className={`w-full py-4 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 border transition-all cursor-pointer ${plan.buttonStyle}`}
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
