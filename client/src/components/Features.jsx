import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Wifi, 
  BarChart3, 
  UserCheck, 
  Share2, 
  Star, 
  FolderDown, 
  Palette, 
  UserPlus, 
  MessageSquare, 
  Shuffle, 
  CloudLightning,
  Store,
  MapPin,
  Smartphone,
  ChevronDown
} from 'lucide-react';

export default function Features() {
  const [expandedIdx, setExpandedIdx] = useState(null);

  const toggleExpand = (idx) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  const featureList = [
    {
      title: 'Digital Shop Profile',
      description: 'Create a simple and beautiful page with your shop name, contact details, product list, active offers, and important links.',
      icon: <Store className="w-5 h-5 text-blue-400" />
    },
    {
      title: 'Track Customer Visits',
      description: 'See exactly how many people scanned your QR code, when they visited, and which links they clicked on in your profile.',
      icon: <BarChart3 className="w-5 h-5 text-indigo-400" />
    },
    {
      title: 'All Links in One Place',
      description: 'Put your WhatsApp, Instagram, Facebook, website, and Google Maps location together in a single neat page.',
      icon: <Share2 className="w-5 h-5 text-blue-500" />
    },
    {
      title: 'Get More Google Reviews',
      description: 'Send customers directly to your Google Review page with one tap. Increase reviews and build instant local trust.',
      icon: <Star className="w-5 h-5 text-amber-400 animate-pulse" />
    },
    {
      title: 'Upload Menus & Catalogs',
      description: 'Share your PDF restaurant menus, product price lists, brochures, or service catalogs with customers instantly.',
      icon: <FolderDown className="w-5 h-5 text-rose-400" />
    },
    {
      title: 'Your Own Colors & Branding',
      description: 'Change page colors, backgrounds, fonts, and button styles to match your shop’s logo or visual style in seconds.',
      icon: <Palette className="w-5 h-5 text-purple-400" />
    },
    {
      title: 'One-Click Contact Save',
      description: 'Customers can save your shop’s mobile number, email, and address directly to their phone book in a single click.',
      icon: <UserPlus className="w-5 h-5 text-teal-400" />
    },
    {
      title: 'All-in-One Shop Dashboard',
      description: 'Manage all your active QR codes, team members, branches, and scan activity from a single, simple, and secure panel.',
      icon: <CloudLightning className="w-5 h-5 text-cyan-400" />
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
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-slate-200 dark:group-hover:bg-white/10 transition-all duration-300">
                  {feature.icon}
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
