import { motion } from 'framer-motion';

export default function Showcase() {
  return (
    <section id="showcase" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold uppercase tracking-widest mb-4">
              See It In Action
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              Powerful Dashboard & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Beautiful Profiles</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              Everything you need to manage your digital presence, all in one place. Take a look at our easy-to-use platform.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
          {/* Dashboard Screenshot */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex-1 w-full relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-50 flex items-center justify-center min-h-[300px]">
              {/* Replace src below with actual screenshot path */}
              <img 
                src="/assets/dashboard-screenshot.png" 
                alt="OneQR Dashboard" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback placeholder if image is missing */}
              <div className="hidden absolute inset-0 bg-slate-100 flex-col items-center justify-center text-slate-400">
                <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-semibold">Please add /assets/dashboard-screenshot.png</span>
              </div>
            </div>
            <h3 className="text-center mt-6 text-xl font-bold text-slate-900">Advanced Analytics Dashboard</h3>
          </motion.div>

          {/* Profile Screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 w-full lg:max-w-sm relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-slate-900 bg-slate-50 flex items-center justify-center min-h-[500px]">
              {/* Replace src below with actual screenshot path */}
              <img 
                src="/assets/profile-screenshot.png" 
                alt="OneQR Digital Profile" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback placeholder if image is missing */}
              <div className="hidden absolute inset-0 bg-slate-100 flex-col items-center justify-center text-slate-400 text-center p-4">
                <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-semibold">Please add /assets/profile-screenshot.png</span>
              </div>
            </div>
            <h3 className="text-center mt-6 text-xl font-bold text-slate-900">Customizable Digital Profile</h3>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
