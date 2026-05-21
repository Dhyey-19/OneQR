import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: 'Kinjan Vasant',
      role: 'Business Owner at Ranjit Logistics',
      quote: 'We printed our OneQR code on all our transport receipt files and bills. Now, our transport customers and drivers just scan the code on their mobile to instantly find our office location, call us, or save our number. It has made our dispatch communication so much easier!',
      avatar: 'KV',
      rating: 5,
      gradient: 'from-blue-600/10 to-indigo-600/10'
    },
    {
      name: 'Paras Shah',
      role: 'Business Owner at Softech Infotech',
      quote: 'Earlier, I had to share website links, maps, and phone numbers separately to clients. Now, I just created a single smart profile page on OneQR and added all my links and contact details. I share it as a QR or link, and clients save my card in one click. Highly recommended for every store owner!',
      avatar: 'PS',
      rating: 5,
      gradient: 'from-cyan-600/10 to-blue-600/10'
    },
    {
      name: 'Jigar Vira',
      role: 'Accountant at SK Logistics',
      quote: 'Keeping track of client coordination was a headache. With our custom business page, clients can check our contact info and timings anytime. It has saved us so much time and made our day-to-day operations and coordinating with partners incredibly smooth.',
      avatar: 'JV',
      rating: 5,
      gradient: 'from-[#1e1b4b]/30 to-indigo-950/20'
    }
  ];

  return (
    <section id="testimonials" className="relative py-24 border-t border-white/5 overflow-hidden">
      {/* Background radial blobs */}
      <div className="absolute top-[30%] left-[-10vw] w-[35vw] h-[35vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10vw] w-[30vw] h-[30vw] rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none" />

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
              Success Stories
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 mb-6">
              Loved by Local Business Owners
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              See how local transport companies, service shops, and retailers are using OneQR to grow their businesses.
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative p-8 bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-900/60 rounded-3xl transition-all duration-300 shadow-glass flex flex-col justify-between overflow-hidden"
            >
              {/* Colored Glow Backdrop */}
              <div className={`absolute -inset-px rounded-3xl bg-gradient-to-tr ${rev.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />

              <div>
                {/* Rating & Quote Icon Row */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-7 h-7 text-slate-700 group-hover:text-blue-500/20 transition-colors" />
                </div>

                {/* Quote Text */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic mb-8">
                  "{rev.quote}"
                </p>
              </div>

              {/* Reviewer Details Row */}
              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5">
                {/* Avatar with gradient glow */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-white/15 flex items-center justify-center font-extrabold text-sm text-white shrink-0 shadow-lg shadow-blue-500/10">
                  {rev.avatar}
                </div>
                <div>
                  <span className="text-sm font-bold text-white block leading-none">{rev.name}</span>
                  <span className="text-[10px] text-slate-500 font-semibold block mt-1.5 uppercase tracking-wider">{rev.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
