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
  CloudLightning 
} from 'lucide-react';

export default function Features() {
  const featureList = [
    {
      title: 'Smart QR Profiles',
      description: 'Host custom-designed profile pages with instant links and dynamic widgets.',
      icon: <QrCode className="w-5 h-5 text-blue-400" />
    },
    {
      title: 'NFC Integration',
      description: 'Program, lock, and overwrite modern physical NFC tags instantly inside the cloud panel.',
      icon: <Wifi className="w-5 h-5 text-cyan-400 rotate-90" />
    },
    {
      title: 'Analytics Dashboard',
      description: 'Track scan times, geographic locations, and link conversion telemetry in real-time.',
      icon: <BarChart3 className="w-5 h-5 text-indigo-400" />
    },
    {
      title: 'Lead Capture',
      description: 'Include sleek, custom lead sheets. Capture visitor contacts directly upon tap.',
      icon: <UserCheck className="w-5 h-5 text-emerald-400" />
    },
    {
      title: 'Social Media Links',
      description: 'Consolidate all profile handles, social networks, and hubs into a single neat tap dashboard.',
      icon: <Share2 className="w-5 h-5 text-blue-500" />
    },
    {
      title: 'Google Review Boost',
      description: 'Redirect users directly to your custom review panels. Increase positive ratings.',
      icon: <Star className="w-5 h-5 text-amber-400 animate-pulse" />
    },
    {
      title: 'Catalog Uploads',
      description: 'Embed PDF menus, brochures, product catalogs, and slide-decks directly in-profile.',
      icon: <FolderDown className="w-5 h-5 text-rose-400" />
    },
    {
      title: 'Custom Themes',
      description: 'Tailor color schemes, gradients, grid shapes, layout elements, and text styling.',
      icon: <Palette className="w-5 h-5 text-purple-400" />
    },
    {
      title: 'Instant Contact Save',
      description: 'Allow clients to save complete vCard profiles, numbers, and emails with one click.',
      icon: <UserPlus className="w-5 h-5 text-teal-400" />
    },
    {
      title: 'WhatsApp Integration',
      description: 'Launch predefined WhatsApp chat dialogs and automated user inquiries.',
      icon: <MessageSquare className="w-5 h-5 text-emerald-500" />
    },
    {
      title: 'Dynamic QR Redirect',
      description: 'Swap targets, change links, and swap physical standee targets anytime in the cloud.',
      icon: <Shuffle className="w-5 h-5 text-indigo-500" />
    },
    {
      title: 'Cloud Dashboard',
      description: 'Access complete multi-location settings, permissions, and team analytics securely.',
      icon: <CloudLightning className="w-5 h-5 text-cyan-400" />
    }
  ];

  return (
    <section id="features" className="relative py-24 border-t border-white/5 overflow-hidden">
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
            <span className="text-blue-500 text-sm font-extrabold uppercase tracking-widest">
              Packed with Innovation
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 mb-6">
              Features Built for Scale
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              We design robust tools that eliminate paper, accelerate contact retrieval, and automate modern customer check-ins.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="group relative p-6 bg-slate-900/40 border border-white/5 hover:border-blue-500/20 hover:bg-slate-900/60 rounded-2xl transition-all duration-300 shadow-glass flex flex-col justify-between overflow-hidden"
            >
              {/* Glow backdrop behind icon */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-300" />
              
              <div>
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Glowing Bottom Line on Hover */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
