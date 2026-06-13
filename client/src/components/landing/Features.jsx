import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  BarChart3, 
  Share2, 
  Star, 
  FolderDown, 
  Palette, 
  UserPlus, 
  CloudLightning,
  ChevronDown
} from 'lucide-react';

// Custom Animated GIF-like SVG Icons for Web View
const GifStore = () => (
  <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path className="animate-pulse" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline className="animate-bounce origin-bottom" style={{ animationDuration: '2s' }} points="9 22 9 12 15 12 15 22" />
  </svg>
);

const GifChart = () => (
  <div className="flex items-end justify-between w-6 h-6 px-0.5 relative overflow-hidden">
    <div className="w-1 bg-indigo-500 rounded-full animate-bounce" style={{ height: '40%', animationDuration: '1.2s' }} />
    <div className="w-1 bg-indigo-500 rounded-full animate-bounce" style={{ height: '80%', animationDuration: '0.8s', animationDelay: '0.2s' }} />
    <div className="w-1 bg-indigo-500 rounded-full animate-bounce" style={{ height: '50%', animationDuration: '1s', animationDelay: '0.1s' }} />
    <div className="w-1 bg-indigo-500 rounded-full animate-bounce" style={{ height: '95%', animationDuration: '1.4s', animationDelay: '0.3s' }} />
  </div>
);

const GifLinks = () => (
  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle className="animate-ping" style={{ animationDuration: '2.5s' }} cx="18" cy="5" r="3" />
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle className="animate-ping" style={{ animationDuration: '3s' }} cx="18" cy="19" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line className="animate-pulse" x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line className="animate-pulse" x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const GifStar = () => (
  <svg className="w-6 h-6 text-amber-500 animate-spin-slow" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const GifDownload = () => (
  <svg className="w-6 h-6 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <path className="animate-bounce" style={{ animationDuration: '1.6s' }} d="M12 11v6M9 14l3 3 3-3" />
  </svg>
);

const GifPalette = () => (
  <svg className="w-6 h-6 text-purple-500 animate-pulse" style={{ animationDuration: '2.5s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.03458 19.176 5.15 19.419 5.15 19.67V20C5.15 21.1046 6.04543 22 7.15 22H12Z" />
    <circle className="text-red-500 fill-current animate-pulse" cx="7.5" cy="10.5" r="1.5" />
    <circle className="text-blue-500 fill-current animate-pulse" cx="11.5" cy="7.5" r="1.5" />
    <circle className="text-green-500 fill-current animate-pulse" cx="16.5" cy="9.5" r="1.5" />
  </svg>
);

const GifContact = () => (
  <svg className="w-6 h-6 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line className="animate-bounce" style={{ animationDuration: '1.4s' }} x1="19" y1="8" x2="19" y2="14" />
    <line className="animate-bounce" style={{ animationDuration: '1.4s' }} x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const GifDashboard = () => (
  <svg className="w-6 h-6 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle className="animate-spin-slow" cx="12" cy="12" r="10" />
    <polygon className="animate-pulse" style={{ animationDuration: '1.2s' }} points="13 2 3 14 12 14 11 22 21 10 12 10" />
  </svg>
);

export default function Features() {
  const [expandedIdx, setExpandedIdx] = useState(null);

  const toggleExpand = (idx) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  const featureList = [
    {
      title: 'Digital Shop Profile',
      description: 'Create a simple and beautiful page with your shop name, contact details, product list, active offers, and important links.',
      icon: <Store className="w-6 h-6 text-blue-500" />,
      gifIcon: <GifStore />,
      accentColor: 'bg-blue-50',
      iconBg: 'bg-white',
      borderColor: 'border-blue-100',
    },
    {
      title: 'Track Customer Visits',
      description: 'See exactly how many people scanned your QR code, when they visited, and which links they clicked on in your profile.',
      icon: <BarChart3 className="w-6 h-6 text-indigo-500" />,
      gifIcon: <GifChart />,
      accentColor: 'bg-indigo-50',
      iconBg: 'bg-white',
      borderColor: 'border-indigo-100',
    },
    {
      title: 'All Links in One Place',
      description: 'Put your WhatsApp, Instagram, Facebook, website, and Google Maps location together in a single neat page.',
      icon: <Share2 className="w-6 h-6 text-blue-600" />,
      gifIcon: <GifLinks />,
      accentColor: 'bg-blue-50',
      iconBg: 'bg-white',
      borderColor: 'border-blue-100',
    },
    {
      title: 'Get More Google Reviews',
      description: 'Send customers directly to your Google Review page with one tap. Increase reviews and build instant local trust.',
      icon: <Star className="w-6 h-6 text-amber-500 animate-pulse" />,
      gifIcon: <GifStar />,
      accentColor: 'bg-amber-50',
      iconBg: 'bg-white',
      borderColor: 'border-amber-100',
    },
    {
      title: 'Upload Menus & Catalogs',
      description: 'Share your PDF restaurant menus, product price lists, brochures, or service catalogs with customers instantly.',
      icon: <FolderDown className="w-6 h-6 text-rose-500" />,
      gifIcon: <GifDownload />,
      accentColor: 'bg-rose-50',
      iconBg: 'bg-white',
      borderColor: 'border-rose-100',
    },
    {
      title: 'Your Own Colors & Branding',
      description: 'Change page colors, backgrounds, fonts, and button styles to match your shop’s logo or visual style in seconds.',
      icon: <Palette className="w-6 h-6 text-purple-500" />,
      gifIcon: <GifPalette />,
      accentColor: 'bg-purple-50',
      iconBg: 'bg-white',
      borderColor: 'border-purple-100',
    },
    {
      title: 'One-Click Contact Save',
      description: 'Customers can save your shop’s mobile number, email, and address directly to their phone book in a single click.',
      icon: <UserPlus className="w-6 h-6 text-teal-500" />,
      gifIcon: <GifContact />,
      accentColor: 'bg-teal-50',
      iconBg: 'bg-white',
      borderColor: 'border-teal-100',
    },
    {
      title: 'All-in-One Shop Dashboard',
      description: 'Manage all your active QR codes, team members, branches, and scan activity from a single, simple, and secure panel.',
      icon: <CloudLightning className="w-6 h-6 text-cyan-500" />,
      gifIcon: <GifDashboard />,
      accentColor: 'bg-cyan-50',
      iconBg: 'bg-white',
      borderColor: 'border-cyan-100',
    },
  ];

  return (
    <section id="features" className="relative py-24 bg-[#FAFAFA] overflow-hidden border-t border-slate-200">
      {/* Subtle modern background patterns */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute top-[20%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-3 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold uppercase tracking-widest mb-4">
              Grow Your Business
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              Give Your Shop a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Digital Upgrade</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              Simple, high-impact features designed to help shopkeepers, restaurants, and local retail stores connect with customers, build reviews, and manage multiple locations with ease.
            </p>
          </motion.div>
        </div>

        {/* Features Grid - Visible on Desktop/Tablet (md and up) */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className={`group relative p-8 bg-white border border-slate-200 hover:${feature.borderColor} rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col overflow-hidden`}
            >
              {/* Subtle accent gradient behind content on hover */}
              <div className={`absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-bl-[100px] blur-2xl ${feature.accentColor}`} />
              
              <div className="relative z-10">
                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.accentColor}`}>
                  {feature.gifIcon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Accordion List - Visible on Mobile (under md) */}
        <div className="flex flex-col gap-4 md:hidden">
          {featureList.map((feature, idx) => {
            const isExpanded = expandedIdx === idx;
            return (
              <div 
                key={idx}
                onClick={() => toggleExpand(idx)}
                className={`p-5 bg-white border rounded-2xl transition-all duration-300 shadow-sm cursor-pointer ${
                  isExpanded ? 'border-blue-300 shadow-md ring-2 ring-blue-50' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl border border-slate-100 flex items-center justify-center shrink-0 ${feature.accentColor}`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{feature.title}</h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180 text-blue-600' : ''}`} />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-slate-500 text-sm mt-4 leading-relaxed font-medium pl-[64px]"
                    >
                      {feature.description}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
