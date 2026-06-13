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
      color: 'bg-orange-50 hover:border-orange-200 text-orange-600',
      iconBg: 'bg-white',
      tagline: 'Contactless dynamic ordering & ratings.',
      points: ['Digital menus via QR', 'Tablewise order checkout', '1-Tap Google review popup']
    },
    {
      id: 'real-estate',
      title: 'Real Estate Agents',
      metric: '3x More Buyer Leads',
      icon: <Home className="w-5 h-5" />,
      color: 'bg-blue-50 hover:border-blue-200 text-blue-600',
      iconBg: 'bg-white',
      tagline: 'Interactive physical signboards.',
      points: ['Standee outside properties', 'Instantly save broker vCard', 'Dynamic property PDF sheets']
    },
    {
      id: 'retail',
      title: 'Retail & Brands',
      metric: '85% Return Scan Rate',
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'bg-emerald-50 hover:border-emerald-200 text-emerald-600',
      iconBg: 'bg-white',
      tagline: 'Loyalty programs & product guides.',
      points: ['Smart box product inserts', 'Direct support WhatsApp launch', 'Social promo code overlays']
    },
    {
      id: 'freelancers',
      title: 'Freelancers & Creators',
      metric: '2.4x Profile Shares',
      icon: <Laptop className="w-5 h-5" />,
      color: 'bg-purple-50 hover:border-purple-200 text-purple-600',
      iconBg: 'bg-white',
      tagline: 'Showcase portfolios via NFC.',
      points: ['Metallic card at networking', 'Instant link to Figma/Behance', 'Embedded scheduling booker']
    },
    {
      id: 'agencies',
      title: 'Agencies & Consulting',
      metric: '92% Contact Save Rate',
      icon: <Briefcase className="w-5 h-5" />,
      color: 'bg-cyan-50 hover:border-cyan-200 text-cyan-600',
      iconBg: 'bg-white',
      tagline: 'High-end B2B sales acceleration.',
      points: ['Team multi-cards control', 'Lead sync to CRM', 'Standardized dynamic branding']
    },
    {
      id: 'gyms',
      title: 'Gyms & Wellness',
      metric: '75% Active Check-Ins',
      icon: <Dumbbell className="w-5 h-5" />,
      color: 'bg-rose-50 hover:border-rose-200 text-rose-600',
      iconBg: 'bg-white',
      tagline: 'Interactive gym schedules.',
      points: ['QR entry gating standees', 'Daily fitness videos catalog', 'WhatsApp renewal reminders']
    },
    {
      id: 'events',
      title: 'Events & Conferences',
      metric: '98% Connection Rate',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-indigo-50 hover:border-indigo-200 text-indigo-600',
      iconBg: 'bg-white',
      tagline: 'Interactive badges & schedules.',
      points: ['NFC-embedded wristbands', 'Digital schedule download', 'Instant attendee networking']
    },
    {
      id: 'startups',
      title: 'Startups & Tech Teams',
      metric: '4.8x Brand Index',
      icon: <Rocket className="w-5 h-5" />,
      color: 'bg-teal-50 hover:border-teal-200 text-teal-600',
      iconBg: 'bg-white',
      tagline: 'Futuristic business footprints.',
      points: ['Unified digital profile', 'Live catalogs telemetry', 'Eco-friendly paper replacement']
    }
  ];

  return (
    <section id="use-cases" className="relative py-24 bg-white overflow-hidden border-t border-slate-200">
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-[50vw] h-[50vw] rounded-full bg-blue-50/50 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest mb-4">
              Built for Every Industry
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              Tailored Industry Solutions
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              Discover how businesses worldwide utilize OneQR smart profiles and NFC cards to streamline pipelines, capture feedback, and increase brand recognition.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind, idx) => (
            <motion.div
              key={ind.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className={`group relative p-6 border border-slate-200 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col justify-between overflow-hidden ${ind.color}`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${ind.iconBg} border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {ind.icon}
                  </div>
                  <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-white border border-slate-100 shadow-sm text-slate-600">
                    {ind.metric}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-1 group-hover:text-blue-700 transition-colors">
                  {ind.title}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm font-semibold mb-4 leading-relaxed">
                  {ind.tagline}
                </p>

                <ul className="space-y-2.5 mt-5 pt-5 border-t border-slate-200/50">
                  {ind.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-500 font-medium leading-tight">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-1" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
