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
      gradient: 'from-blue-50 to-indigo-50'
    },
    {
      name: 'Paras Shah',
      role: 'Business Owner at Softech Infotech',
      quote: 'Earlier, I had to share website links, maps, and phone numbers separately to clients. Now, I just created a single smart profile page on OneQR and added all my links and contact details. I share it as a QR or link, and clients save my card in one click. Highly recommended for every store owner!',
      avatar: 'PS',
      rating: 5,
      gradient: 'from-cyan-50 to-blue-50'
    },
    {
      name: 'Jigar Vira',
      role: 'Accountant at SK Logistics',
      quote: 'Keeping track of client coordination was a headache. With our custom business page, clients can check our contact info and timings anytime. It has saved us so much time and made our day-to-day operations and coordinating with partners incredibly smooth.',
      avatar: 'JV',
      rating: 5,
      gradient: 'from-indigo-50 to-purple-50'
    }
  ];

  return (
    <section id="testimonials" className="relative py-24 bg-[#FAFAFA] overflow-hidden border-t border-slate-200">
      <div className="absolute top-[30%] left-[-10vw] w-[35vw] h-[35vw] rounded-full bg-blue-100/50 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10vw] w-[30vw] h-[30vw] rounded-full bg-cyan-100/50 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
              Success Stories
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              Loved by Local Business Owners
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              See how local transport companies, service shops, and retailers are using OneQR to grow their businesses.
            </p>
          </motion.div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative p-8 bg-white border border-slate-200 hover:border-blue-300 rounded-[2rem] transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden"
            >
              <div className={`absolute -inset-px rounded-[2rem] bg-gradient-to-tr ${rev.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />

              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-slate-200 group-hover:text-blue-200 transition-colors" />
                </div>

                <p className="text-slate-700 text-[15px] sm:text-base leading-relaxed font-medium mb-8">
                  "{rev.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-2 border-white flex items-center justify-center font-extrabold text-sm text-white shrink-0 shadow-md">
                  {rev.avatar}
                </div>
                <div>
                  <span className="text-base font-bold text-slate-900 block leading-none mb-1.5">{rev.name}</span>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">{rev.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
