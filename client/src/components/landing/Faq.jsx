import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'What is OneQR?',
      a: 'OneQR is a modern business identity and smart presence platform. We combine physical high-grade NFC hardware and dynamic styled QR codes with hosted cloud profiles. In one tap or scan, your customers can view catalogs, connect to social handles, fill lead forms, launch WhatsApp chat windows, or save complete contact details to their devices.'
    },
    {
      q: 'How does NFC work?',
      a: 'NFC (Near Field Communication) allows devices to share data wirelessly within short distances. Our premium physical cards, tags, and wristbands have secure embedded microchips. When a customer holds an NFC-enabled smartphone (iOS & Android compatible) close to the card, the phone triggers a dynamic read request, launching your smart profile page instantly. No custom scanning apps or power are needed.'
    },
    {
      q: 'Can I upload catalogs?',
      a: 'Yes, absolutely! On our Pro and Business tiers, you can upload PDF menus, brochures, pamphlets, and catalog files directly. Visitors can view, read, or download files from your digital profile. Telemetry dashboards will also log scan counts and file downloads.'
    },
    {
      q: 'Can I customize themes?',
      a: 'Yes, OneQR features a full visual builder. You can tailor profile background colors, neon glass shaders, color schemes, block styles, card layouts, social icons, text fonts (e.g. Inter, Outfit), logos, and cover media banners to align with your corporate branding.'
    },
    {
      q: 'Do I get analytics?',
      a: 'Yes! Real-time analytics are included in Pro and Business subscriptions. Our telemetry systems log total profiles viewed, scan frequencies, link clicks (CTR), geographic locations, and time graphs so you can measure sales outreach performance.'
    }
  ];

  return (
    <section id="faq" className="relative py-24 bg-white overflow-hidden border-t border-slate-200">
      <div className="absolute top-[20%] left-[-10vw] w-[35vw] h-[35vw] rounded-full bg-blue-50/50 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10vw] w-[30vw] h-[30vw] rounded-full bg-cyan-50/50 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
              Got Questions?
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              Find immediate answers about setup details, NFC chip compatibility, catalog hosting, custom theme templates, and metrics monitoring.
            </p>
          </motion.div>
        </div>


        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`rounded-[1.5rem] border ${
                  isOpen ? 'border-blue-200 bg-blue-50/30 shadow-md ring-4 ring-blue-50/50' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                } transition-all duration-300 overflow-hidden`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 cursor-pointer"
                >
                  <span className={`text-base sm:text-lg font-bold transition-colors ${isOpen ? 'text-blue-700' : 'text-slate-900 group-hover:text-blue-600'}`}>
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${isOpen ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
