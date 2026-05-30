import { useState } from 'react';
import { motion } from 'framer-motion';
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
  <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path className="animate-pulse" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline className="animate-bounce origin-bottom" style={{ animationDuration: '2s' }} points="9 22 9 12 15 12 15 22" />
  </svg>
);

const GifChart = () => (
  <div className="flex items-end justify-between w-5 h-5 px-0.5 relative overflow-hidden">
    <div className="w-[3px] bg-indigo-400 rounded-full animate-bounce" style={{ height: '40%', animationDuration: '1.2s' }} />
    <div className="w-[3px] bg-indigo-400 rounded-full animate-bounce" style={{ height: '80%', animationDuration: '0.8s', animationDelay: '0.2s' }} />
    <div className="w-[3px] bg-indigo-400 rounded-full animate-bounce" style={{ height: '50%', animationDuration: '1s', animationDelay: '0.1s' }} />
    <div className="w-[3px] bg-indigo-400 rounded-full animate-bounce" style={{ height: '95%', animationDuration: '1.4s', animationDelay: '0.3s' }} />
  </div>
);

const GifLinks = () => (
  <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  <svg className="w-5 h-5 text-amber-400 animate-spin-slow" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const GifDownload = () => (
  <svg className="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <path className="animate-bounce" style={{ animationDuration: '1.6s' }} d="M12 11v6M9 14l3 3 3-3" />
  </svg>
);

const GifPalette = () => (
  <svg className="w-5 h-5 text-purple-400 animate-pulse" style={{ animationDuration: '2.5s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.03458 19.176 5.15 19.419 5.15 19.67V20C5.15 21.1046 6.04543 22 7.15 22H12Z" />
    <circle className="text-red-400 fill-current animate-pulse" cx="7.5" cy="10.5" r="1.5" />
    <circle className="text-blue-400 fill-current animate-pulse" cx="11.5" cy="7.5" r="1.5" />
    <circle className="text-green-400 fill-current animate-pulse" cx="16.5" cy="9.5" r="1.5" />
  </svg>
);

const GifContact = () => (
  <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line className="animate-bounce" style={{ animationDuration: '1.4s' }} x1="19" y1="8" x2="19" y2="14" />
    <line className="animate-bounce" style={{ animationDuration: '1.4s' }} x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const GifDashboard = () => (
  <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      icon: <Store className="w-5 h-5 text-blue-400" />,
      gifIcon: <GifStore />
    },
    {
      title: 'Track Customer Visits',
      description: 'See exactly how many people scanned your QR code, when they visited, and which links they clicked on in your profile.',
      icon: <BarChart3 className="w-5 h-5 text-indigo-400" />,
      gifIcon: <GifChart />
    },
    {
      title: 'All Links in One Place',
      description: 'Put your WhatsApp, Instagram, Facebook, website, and Google Maps location together in a single neat page.',
      icon: <Share2 className="w-5 h-5 text-blue-500" />,
      gifIcon: <GifLinks />
    },
    {
      title: 'Get More Google Reviews',
      description: 'Send customers directly to your Google Review page with one tap. Increase reviews and build instant local trust.',
      icon: <Star className="w-5 h-5 text-amber-400 animate-pulse" />,
      gifIcon: <GifStar />
    },
    {
      title: 'Upload Menus & Catalogs',
      description: 'Share your PDF restaurant menus, product price lists, brochures, or service catalogs with customers instantly.',
      icon: <FolderDown className="w-5 h-5 text-rose-400" />,
      gifIcon: <GifDownload />
    },
    {
      title: 'Your Own Colors & Branding',
      description: 'Change page colors, backgrounds, fonts, and button styles to match your shop’s logo or visual style in seconds.',
      icon: <Palette className="w-5 h-5 text-purple-400" />,
      gifIcon: <GifPalette />
    },
    {
      title: 'One-Click Contact Save',
      description: 'Customers can save your shop’s mobile number, email, and address directly to their phone book in a single click.',
      icon: <UserPlus className="w-5 h-5 text-teal-400" />,
      gifIcon: <GifContact />
    },
    {
      title: 'All-in-One Shop Dashboard',
      description: 'Manage all your active QR codes, team members, branches, and scan activity from a single, simple, and secure panel.',
      icon: <CloudLightning className="w-5 h-5 text-cyan-400" />,
      gifIcon: <GifDashboard />
    },
  ];

  return (
    <section id="features" className="relative py-24 border-t border-slate-200 dark:border-white/5 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[40%] left-[-10vw] w-[35vw] h-[35vw] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10vw] w-[30vw] h-[30vw] rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 dark:text-blue-500 text-sm font-extrabold uppercase tracking-widest">
              Grow Your Business
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-3 mb-6">
              Give Your Shop a Digital Upgrade
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
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
              className="group relative p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-blue-500/20 hover:bg-slate-50 dark:hover:bg-slate-900/60 rounded-2xl transition-all duration-300 shadow-sm dark:shadow-glass flex flex-col justify-between overflow-hidden"
            >
              {/* Glow backdrop behind icon */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-300" />
              
              <div>
                {/* Icon (Web view custom animated GIF-like SVG) */}
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-slate-200 dark:group-hover:bg-white/10 transition-all duration-300">
                  {feature.gifIcon}
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>


              {/* Glowing Bottom Line on Hover */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.div>
          ))}
        </div>

        {/* Features Accordion List - Visible on Mobile (under md) */}
        <div className="flex flex-col gap-3 md:hidden">
          {featureList.map((feature, idx) => {
            const isExpanded = expandedIdx === idx;
            return (
              <div 
                key={idx}
                onClick={() => toggleExpand(idx)}
                className={`p-4 bg-white dark:bg-slate-900/40 border rounded-2xl transition-all duration-300 shadow-sm dark:shadow-glass cursor-pointer ${
                  isExpanded ? 'border-blue-500/30 bg-slate-50 dark:bg-slate-900/70' : 'border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                      {feature.icon}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
                </div>
                {isExpanded && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-600 dark:text-slate-400 text-xs mt-3 leading-relaxed pl-12 border-l border-blue-500/20"
                  >
                    {feature.description}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
