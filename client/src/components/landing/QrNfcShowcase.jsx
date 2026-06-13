import { motion } from 'framer-motion';
import { Wifi, QrCode, Smartphone, Utensils, Tag } from 'lucide-react';

export default function QrNfcShowcase() {
  const mockups = [
    {
      title: 'Premium NFC Card',
      category: 'Smart Hardware',
      description: 'Matte dark-aluminum or high-grade polymer business cards. Loaded with instant contact-sharing protocols. No power required.',
      icon: <Wifi className="w-5 h-5 text-indigo-600 rotate-90" />,
      visual: (
        <div className="w-full h-full flex flex-col justify-between p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-200 relative overflow-hidden group shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
          <div className="flex justify-between items-start">
            <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">Elite Connect</span>
            <Wifi className="w-5 h-5 text-white/50 rotate-90" />
          </div>
          <div className="w-10 h-8 rounded-md bg-gradient-to-r from-amber-300 to-amber-100 p-0.5 mt-2 shadow-sm">
            <div className="w-full h-full rounded border border-amber-500/30 grid grid-cols-3 gap-0.5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border-r border-b border-amber-500/20" />
              ))}
            </div>
          </div>
          <div className="mt-8 flex justify-between items-end z-10">
            <div>
              <span className="text-xs font-bold text-white tracking-widest block leading-none">NOLAN VANCE</span>
              <span className="text-[7px] text-slate-400 font-semibold tracking-wider block mt-1 uppercase">Founder / Architect</span>
            </div>
            <div className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-sm">
              NFC ACTIVE
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
      )
    },
    {
      title: 'Smart QR Standee',
      category: 'In-Store Check-In',
      description: 'Elegant crystal-acrylic tabletop check-in blocks. Perfect for hotel counters, retail checkout, real estate lobbies, and workspaces.',
      icon: <QrCode className="w-5 h-5 text-cyan-600" />,
      visual: (
        <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden">
          <div className="w-18 h-28 bg-white border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-between shadow-md relative group">
            <div className="w-full py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded text-center">
              <span className="text-[7px] font-bold text-white tracking-widest uppercase">SCAN HERE</span>
            </div>
            <div className="w-12 h-12 bg-white p-1 rounded-md border border-slate-100 flex items-center justify-center my-2 shadow-sm">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
            <div className="flex items-center gap-1 text-[6px] text-amber-500">
              <span>⭐⭐⭐⭐⭐</span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-2 bg-slate-300 rounded-full border-t border-slate-200 shadow-sm" />
          </div>
          <span className="text-[10px] text-cyan-700 font-bold tracking-widest uppercase mt-3">Acrylic Standee</span>
        </div>
      )
    },
    {
      title: 'Mobile Scan Demo',
      category: 'Live Interaction',
      description: 'Ultra-fast QR/NFC processing. Works instantly with the native smartphone camera app. No custom app installation required.',
      icon: <Smartphone className="w-5 h-5 text-blue-600" />,
      visual: (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 relative overflow-hidden">
          <div className="relative w-24 h-24 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
            <QrCode className="w-12 h-12 text-slate-400" />
            <div className="absolute inset-2 border-2 border-dashed border-blue-400 rounded-xl pointer-events-none" />
            <div className="absolute left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_10px_#2563eb] animate-bounce" />
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[85%] py-2 px-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2 shadow-lg">
            <div className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Smartphone className="w-3 h-3" />
            </div>
            <span className="text-[10px] text-slate-700 font-bold overflow-hidden text-ellipsis whitespace-nowrap">Open oneqr.co/alex</span>
          </div>
        </div>
      )
    },
    {
      title: 'Restaurant QR Menu',
      category: 'Hospitality',
      description: 'Premium tabletop flyers, wooden block integration, or custom coasters. Showcases active menus, pictures, pricing, and checkouts.',
      icon: <Utensils className="w-5 h-5 text-emerald-600" />,
      visual: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-[10px] font-bold text-emerald-700 tracking-widest uppercase">Rosewood Bistro</span>
            <Utensils className="w-4 h-4 text-emerald-600/50" />
          </div>
          <div className="space-y-1.5 my-3">
            <div className="flex justify-between text-[9px] text-slate-600">
              <span className="font-semibold">Dry Aged Ribeye</span>
              <span className="text-emerald-700 font-bold">$38.00</span>
            </div>
            <div className="flex justify-between text-[9px] text-slate-600">
              <span className="font-semibold">Truffle Parmesan Fries</span>
              <span className="text-emerald-700 font-bold">$12.00</span>
            </div>
            <div className="flex justify-between text-[9px] text-slate-600">
              <span className="font-semibold">Spiced Lemon Cooler</span>
              <span className="text-emerald-700 font-bold">$8.50</span>
            </div>
          </div>
          <div className="py-1.5 px-3 bg-emerald-50 border border-emerald-100 rounded-lg text-center flex items-center justify-between shadow-sm">
            <span className="text-[8px] font-bold text-emerald-700 uppercase tracking-wide">Table 12 QR</span>
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </div>
      )
    },
    {
      title: 'Smart Product Tags',
      category: 'Retail & Brands',
      description: 'Durable hangtags, keychain loops, or labels. Provides dynamic product info, proof of authenticity, registration, and user guides.',
      icon: <Tag className="w-5 h-5 text-rose-600" />,
      visual: (
        <div className="w-full h-full flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden">
          <div className="w-36 h-20 bg-white rounded-xl border border-slate-200 p-3 shadow-md flex justify-between items-center relative group">
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            </div>
            <div className="ml-3 text-left">
              <span className="text-[8px] font-extrabold text-rose-600 tracking-wider block uppercase">Original Gear</span>
              <span className="text-[10px] font-bold text-slate-900 block mt-0.5">Velo Pack v4</span>
              <span className="text-[7px] text-slate-500 block leading-none mt-1 font-medium">S/N: 9482-ADF</span>
            </div>
            <div className="w-9 h-9 bg-white p-0.5 rounded flex items-center justify-center border border-slate-200 shadow-sm">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="hardware" className="relative py-24 bg-[#FAFAFA] overflow-hidden border-t border-slate-200">
      <div className="absolute top-[20%] right-[-10vw] w-[35vw] h-[35vw] rounded-full bg-blue-100/50 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10vw] w-[30vw] h-[30vw] rounded-full bg-indigo-100/50 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest mb-4">
              Premium Hardware
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              NFC Cards & QR Accessories
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              Equip your teams, physical products, and brick-and-mortar storefronts with premium high-fidelity QR standees, elite laser-cut metallic cards, and dynamic retail tags.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockups.map((mockup, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group flex flex-col justify-between p-8 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl rounded-[2rem] transition-all duration-300 shadow-sm overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50">
                    {mockup.category}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {mockup.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors">
                  {mockup.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                  {mockup.description}
                </p>
              </div>

              <div className="h-56 w-full bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden group-hover:border-slate-200 transition-all duration-300">
                {mockup.visual}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
