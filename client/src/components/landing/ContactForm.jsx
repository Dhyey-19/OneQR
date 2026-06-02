import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setToastMessage('Please fill out all fields.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
      return;
    }

    setStatus('loading');

    try {
      // Submitting to the local backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setStatus('success');
        setToastMessage(data.message || 'Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        throw new Error(data.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setToastMessage(error.message || 'Something went wrong. Please try again or email us directly.');
      setTimeout(() => setStatus('idle'), 6000);
    }
  };

  return (
    <section id="contact" className="relative py-24 border-t border-slate-200 dark:border-white/5 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[30%] left-[-15vw] w-[40vw] h-[40vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-15vw] w-[35vw] h-[35vw] rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none" />


      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div>
              <span className="text-blue-600 dark:text-blue-500 text-sm font-extrabold uppercase tracking-widest block mb-3">
                Let's Grow Your Business Together!  
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                Book a Coffee with us!
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-10 max-w-md">
                We’d love to learn about your business and help you create a modern customer experience using OneQR
              </p>

              {/* Info Details */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block uppercase">Email Support</span>
                    <div className="flex flex-col gap-2 mt-1">
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        <a href="mailto:gopaldhorajiya205@gmail.com" className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          Gopal Dhorajiya
                        </a>
                        <span className="text-slate-500 font-normal"> : (gopaldhorajiya205@gmail.com)</span>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        <a href="mailto:dhyeyshah009@gmail.com" className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          Dhyey Shah
                        </a>
                        <span className="text-slate-500 font-normal"> : (dhyeyshah009@gmail.com)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block uppercase">Call Sales & Support</span>
                    <div className="flex flex-col gap-1 mt-0.5">
                      <a href="tel:+918200875023" className="text-sm font-bold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                        +91 82008 75023
                      </a>
                      <a href="tel:+919724277321" className="text-sm font-bold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                        +91 97242 77321
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick trust metric badge */}
            <div className="mt-12 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center gap-4 max-w-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                Our support team is online. Average response time: <strong className="text-slate-900 dark:text-white">15 minutes</strong>.
              </span>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-2xl relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900/80 focus:shadow-sm dark:focus:shadow-glass-glow transition-all"
                  />
                </div>

                {/* Email and Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900/80 focus:shadow-sm dark:focus:shadow-glass-glow transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900/80 focus:shadow-sm dark:focus:shadow-glass-glow transition-all"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2.5">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your business or how you want to use OneQR..."
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900/80 focus:shadow-sm dark:focus:shadow-glass-glow transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 border border-white/15 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Brewing connection... ☕</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Let's Connect! ☕</span>
                    </>
                  )}
                </button>
              </form>

              {/* Status Toast Alert */}
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute -bottom-16 left-0 right-0 py-3 px-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md flex items-center gap-2.5 text-xs font-semibold text-emerald-400 shadow-xl"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{toastMessage}</span>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute -bottom-16 left-0 right-0 py-3 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 backdrop-blur-md flex items-center gap-2.5 text-xs font-semibold text-rose-400 shadow-xl"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{toastMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
