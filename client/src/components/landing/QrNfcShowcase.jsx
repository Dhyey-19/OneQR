import { motion } from 'framer-motion';
import { Wifi, QrCode, Smartphone, Utensils, Tag } from 'lucide-react';

export default function QrNfcShowcase() {
  const mockups = [
    {
      title: 'Premium NFC Card',
      category: 'Smart Hardware',
      description: 'Matte dark-aluminum or high-grade polymer business cards. Loaded with instant contact-sharing protocols. No power required.',
      icon: <Wifi className="w-5 h-5 text-indigo-400 rotate-90" />,
      visual: (
        <div className="w-full h-full flex flex-col justify-between p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 rounded-2xl border border-white/10 relative overflow-hidden group shadow-2xl">
          {/* Holographic glowing lines overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.15),transparent)] pointer-events-none" />
          <div className="flex justify-between items-start">
            <span className="text-[8px] font-bold text-slate-500 tracking-widest uppercase">Elite Connect</span>
            <Wifi className="w-5 h-5 text-indigo-400/60 rotate-90 animate-pulse" />
          </div>
          {/* Hologram Circle */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400/20 via-indigo-500/20 to-pink-500/20 border border-white/10 mt-4 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-blue-500/30 blur-[2px]" />
          </div>
          <div className="mt-8 flex justify-between items-end z-10">
            <div>
              <span className="text-xs font-bold text-white tracking-widest block leading-none">NOLAN VANCE</span>
              <span className="text-[7px] text-slate-400 font-semibold tracking-wider block mt-1 uppercase">Founder / Architect</span>
            </div>
            <div className="text-[8px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-400">
              NFC ACTIVE
            </div>
          </div>
          {/* Glass sheen */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
      )
    },
    {
      title: 'Smart QR Standee',
      category: 'In-Store Check-In',
      description: 'Elegant crystal-acrylic tabletop check-in blocks. Perfect for hotel counters, retail checkout, real estate lobbies, and workspaces.',
      icon: <QrCode className="w-5 h-5 text-cyan-400" />,
      visual: (
        <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-slate-950/80 rounded-2xl border border-white/5 relative overflow-hidden">
          {/* 3D Glass stand mockup */}
          <div className="w-18 h-28 bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col items-center justify-between shadow-lg relative group">
            {/* Header banner inside stand */}
            <div className="w-full py-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded text-center">
              <span className="text-[6px] font-bold text-white tracking-widest uppercase">SCAN TO CONNECT</span>
            </div>
            {/* Styled QR inside stand */}
            <div className="w-10 h-10 bg-white p-0.5 rounded flex items-center justify-center my-2 shadow-inner">
              <QrCode className="w-full h-full text-black" />
            </div>
            {/* Bottom rating tag inside stand */}
            <div className="flex items-center gap-0.5 text-[5px] text-amber-400">
              <span>⭐⭐⭐⭐⭐</span>
              <span className="text-white/60 font-semibold ml-0.5">Rate Us</span>
            </div>
            {/* Solid stand base */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-2 bg-slate-800 rounded-full border-t border-white/15" />
          </div>
          <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase mt-2">Crystal Standee</span>
        </div>
      )
    },
    {
      title: 'Mobile Scan Demo',
      category: 'Live Interaction',
      description: 'Ultra-fast QR/NFC processing. Works instantly with the native smartphone camera app. No custom app installation required.',
      icon: <Smartphone className="w-5 h-5 text-blue-400" />,
      visual: (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-white/5 relative overflow-hidden">
          {/* Scanning simulation */}
          <div className="relative w-24 h-24 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <QrCode className="w-12 h-12 text-slate-300" />
            {/* Camera targeting frame lines */}
            <div className="absolute inset-2 border-2 border-dashed border-blue-500/40 rounded-xl pointer-events-none" />
            {/* Horizontal glowing bar animation */}
            <div className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_#2563eb] animate-bounce" />
          </div>
          {/* Small floating phone notification */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[85%] py-1.5 px-2 bg-[#090d1a] border border-blue-500/30 rounded-lg flex items-center gap-2 shadow-2xl">
            <div className="w-3.5 h-3.5 rounded bg-blue-500 flex items-center justify-center text-white">
              <Smartphone className="w-2.5 h-2.5" />
            </div>
            <span className="text-[8px] text-slate-200 font-bold overflow-hidden text-ellipsis whitespace-nowrap">Open oneqr.co/alex</span>
          </div>
        </div>
      )
    },
    {
      title: 'Restaurant QR Menu',
      category: 'Hospitality',
      description: 'Premium tabletop flyers, wooden block integration, or custom coasters. Showcases active menus, pictures, pricing, and checkouts.',
      icon: <Utensils className="w-5 h-5 text-emerald-400" />,
      visual: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-slate-950/80 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-[9px] font-bold text-emerald-400 tracking-wider">ROSEWOOD BISTRO</span>
            <Utensils className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="space-y-1 my-2">
            <div className="flex justify-between text-[8px] text-slate-300">
              <span className="font-semibold">Dry Aged Ribeye</span>
              <span className="text-emerald-400 font-bold">$38.00</span>
            </div>
            <div className="flex justify-between text-[8px] text-slate-300">
              <span className="font-semibold">Truffle Parmesan Fries</span>
              <span className="text-emerald-400 font-bold">$12.00</span>
            </div>
            <div className="flex justify-between text-[8px] text-slate-300">
              <span className="font-semibold">Spiced Lemon Cooler</span>
              <span className="text-emerald-400 font-bold">$8.50</span>
            </div>
          </div>
          {/* Action button inside coaster */}
          <div className="py-1 px-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center flex items-center justify-between">
            <span className="text-[7px] font-bold text-emerald-400 uppercase">SCAN TABLE 12 QR</span>
            <QrCode className="w-3 h-3 text-emerald-400" />
          </div>
        </div>
      )
    },
    {
      title: 'Smart Product Tags',
      category: 'Retail & Brands',
      description: 'Durable hangtags, keychain loops, or labels. Provides dynamic product info, proof of authenticity, registration, and user guides.',
      icon: <Tag className="w-5 h-5 text-rose-400" />,
      visual: (
        <div className="w-full h-full flex items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-white/5 relative overflow-hidden">
          {/* Stylish physical label design */}
          <div className="w-32 h-18 bg-gradient-to-tr from-slate-900 via-[#181124] to-slate-950 rounded-xl border border-white/10 p-3 shadow-lg flex justify-between items-center relative group">
            {/* Cord hole in product tag */}
            <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#030712] border border-white/10 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </div>
            <div className="ml-1 text-left">
              <span className="text-[7px] font-extrabold text-indigo-400 tracking-wider block uppercase">Original Gear</span>
              <span className="text-[9px] font-bold text-white block mt-0.5">Velo Pack v4</span>
              <span className="text-[6px] text-slate-500 block leading-none mt-1">S/N: 9482-ADF</span>
            </div>
            {/* Micro Tag QR */}
            <div className="w-8 h-8 bg-white p-0.5 rounded flex items-center justify-center border border-indigo-500/20 shadow-md">
              <QrCode className="w-full h-full text-black" />
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="hardware" className="relative py-24 border-t border-white/5 overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-[20%] right-[-10vw] w-[35vw] h-[35vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10vw] w-[30vw] h-[30vw] rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none" />

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
              Premium Hardware
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 mb-6">
              NFC Cards & QR Accessories
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Equip your teams, physical products, and brick-and-mortar storefronts with premium high-fidelity QR standees, elite laser-cut metallic cards, and dynamic retail tags.
            </p>
          </motion.div>
        </div>

        {/* Mockup Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockups.map((mockup, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group flex flex-col justify-between p-6 bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-900/60 rounded-3xl transition-all duration-300 shadow-glass overflow-hidden"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/5 bg-white/5">
                    {mockup.category}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform duration-300">
                    {mockup.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {mockup.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  {mockup.description}
                </p>
              </div>

              {/* Visual Container */}
              <div className="h-48 w-full bg-slate-950/20 border border-white/5 rounded-2xl flex items-center justify-center p-3 relative overflow-hidden group-hover:border-white/10 transition-all duration-300">
                {mockup.visual}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
