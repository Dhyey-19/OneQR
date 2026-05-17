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
    <section id="faq" className="relative py-24 border-t border-white/5 overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-[20%] left-[-10vw] w-[35vw] h-[35vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10vw] w-[30vw] h-[30vw] rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-500 text-sm font-extrabold uppercase tracking-widest">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Find immediate answers about setup details, NFC chip compatibility, catalog hosting, custom theme templates, and metrics monitoring.
            </p>
          </motion.div>
        </div>

        {/* Collapsible FAQ Accordions */}
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
                className={`rounded-2xl border ${
                  isOpen ? 'border-blue-500/30 bg-[#0c1224]/80' : 'border-white/5 bg-slate-900/40'
                } transition-all duration-300 overflow-hidden shadow-glass`}
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 shrink-0"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-white/5 pt-4">
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
