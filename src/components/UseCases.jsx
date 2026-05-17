import { motion } from 'framer-motion';
import { 
  Utensils, 
  Home, 
  ShoppingBag, 
  Laptop, 
  Briefcase, 
  Dumbbell, 
  Calendar, 
  Rocket, 
  ArrowUpRight 
} from 'lucide-react';

export default function UseCases() {
  const industries = [
    {
      id: 'restaurants',
      title: 'Restaurants & Cafes',
      metric: '+40% Review Rate',
      icon: <Utensils className="w-5 h-5" />,
      color: 'from-orange-500/10 to-amber-500/10 hover:border-orange-500/30 text-orange-400',
      tagline: 'Contactless dynamic ordering & ratings.',
      points: ['Digital menus via QR', 'Tablewise order checkout', '1-Tap Google review popup']
    },
    {
      id: 'real-estate',
      title: 'Real Estate Agents',
      metric: '3x More Buyer Leads',
      icon: <Home className="w-5 h-5" />,
      color: 'from-blue-500/10 to-indigo-500/10 hover:border-blue-500/30 text-blue-400',
      tagline: 'Interactive physical signboards.',
      points: ['Standee outside properties', 'Instantly save broker vCard', 'Dynamic property PDF sheets']
    },
    {
      id: 'retail',
      title: 'Retail & Brands',
      metric: '85% Return Scan Rate',
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/30 text-emerald-400',
      tagline: 'Loyalty programs & product guides.',
      points: ['Smart box product inserts', 'Direct support WhatsApp launch', 'Social promo code overlays']
    },
    {
      id: 'freelancers',
      title: 'Freelancers & Creators',
      metric: '2.4x Profile Shares',
      icon: <Laptop className="w-5 h-5" />,
      color: 'from-purple-500/10 to-indigo-500/10 hover:border-purple-500/30 text-purple-400',
      tagline: 'Showcase portfolios via NFC.',
      points: ['Metallic card at networking', 'Instant link to Figma/Behance', 'Embedded scheduling booker']
    },
    {
      id: 'agencies',
      title: 'Agencies & Consulting',
      metric: '92% Contact Save Rate',
      icon: <Briefcase className="w-5 h-5" />,
      color: 'from-cyan-500/10 to-blue-500/10 hover:border-cyan-500/30 text-cyan-400',
      tagline: 'High-end B2B sales acceleration.',
      points: ['Team multi-cards control', 'Lead sync to CRM', 'Standardized dynamic branding']
    },
    {
      id: 'gyms',
      title: 'Gyms & Wellness',
      metric: '75% Active Check-Ins',
      icon: <Dumbbell className="w-5 h-5" />,
      color: 'from-rose-500/10 to-red-500/10 hover:border-rose-500/30 text-rose-400',
      tagline: 'Interactive gym schedules.',
      points: ['QR entry gating standees', 'Daily fitness videos catalog', 'WhatsApp renewal reminders']
    },
    {
      id: 'events',
      title: 'Events & Conferences',
      metric: '98% Connection Rate',
      icon: <Calendar className="w-5 h-5" />,
      color: 'from-indigo-500/10 to-pink-500/10 hover:border-indigo-500/30 text-indigo-400',
      tagline: 'Interactive badges & schedules.',
      points: ['NFC-embedded wristbands', 'Digital schedule download', 'Instant attendee networking']
    },
    {
      id: 'startups',
      title: 'Startups & Tech Teams',
      metric: '4.8x Brand Index',
      icon: <Rocket className="w-5 h-5" />,
      color: 'from-teal-500/10 to-cyan-500/10 hover:border-teal-500/30 text-teal-400',
      tagline: 'Futuristic business footprints.',
      points: ['Unified digital profile', 'Live catalogs telemetry', 'Eco-friendly paper replacement']
    }
  ];

  return (
    <section id="use-cases" className="relative py-24 border-t border-white/5 overflow-hidden">
      {/* Glow Backplate */}
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-[50vw] h-[50vw] rounded-full bg-blue-600/5 blur-[150px] pointer-events-none" />

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
              Built for Every Industry
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 mb-6">
              Tailored Industry Solutions
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Discover how businesses worldwide utilize OneQR smart profiles and NFC cards to streamline pipelines, capture feedback, and increase brand recognition.
            </p>
          </motion.div>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind, idx) => (
            <motion.div
              key={ind.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className={`group relative p-6 bg-slate-900/40 border border-white/5 rounded-3xl transition-all duration-300 shadow-glass flex flex-col justify-between overflow-hidden bg-gradient-to-tr ${ind.color}`}
            >
              <div>
                {/* Icon Row */}
                <div className="flex justify-between items-center mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {ind.icon}
                  </div>
                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                    {ind.metric}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-1 group-hover:text-white/90">
                  {ind.title}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm font-semibold mb-4 leading-relaxed">
                  {ind.tagline}
                </p>

                {/* Bullets */}
                <ul className="space-y-2 mt-4 pt-4 border-t border-white/5">
                  {ind.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="w-1 h-1 rounded-full bg-blue-500" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Aesthetic Card Glare */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
