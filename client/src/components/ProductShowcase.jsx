import { motion as motionFramer } from 'framer-motion';
import { QrCode, Smartphone, CreditCard, Star, BarChart2, Wifi } from 'lucide-react';

export default function ProductShowcase() {
  const products = [
    {
      id: 'profile',
      title: 'Digital Business Profile',
      category: 'Digital Presence',
      description: 'A mobile-optimized landing page containing all your contact info, social links, documents, catalogs, and lead capture forms.',
      icon: <Smartphone className="w-6 h-6 text-blue-400" />,
      color: 'from-blue-600/20 to-indigo-600/20',
      badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/5',
      visual: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-slate-950/80 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-none">Sophia Martinez</div>
              <span className="text-[9px] text-slate-500">Business Manager</span>
            </div>
          </div>
          <div className="space-y-1.5 my-3">
            <div className="w-full py-1.5 px-2 bg-white/5 rounded-lg flex items-center justify-between text-[10px] text-slate-300 font-semibold border border-white/5">
              <span>Save Contact</span>
              <span className="text-[9px] text-blue-400">1-Tap</span>
            </div>
            <div className="w-full py-1.5 px-2 bg-white/5 rounded-lg flex items-center justify-between text-[10px] text-slate-300 font-semibold border border-white/5">
              <span>View Product Catalog</span>
              <span className="text-[9px] text-indigo-400">Catalog</span>
            </div>
            <div className="w-full py-1.5 px-2 bg-white/5 rounded-lg flex items-center justify-between text-[10px] text-slate-300 font-semibold border border-white/5">
              <span>Google Review</span>
              <span className="text-[9px] text-amber-400">⭐⭐⭐⭐⭐</span>
            </div>
          </div>
          <div className="py-2 px-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/20 rounded-xl text-center">
            <span className="text-[9px] font-bold text-white block">Lead Capture Active</span>
          </div>
        </div>
      )
    },
    {
      id: 'qr',
      title: 'Smart QR Code',
      category: 'Smart Scan',
      description: 'Ultra-high precision styled dynamic QR codes that can be edited in real-time, redirecting users dynamically based on parameters.',
      icon: <QrCode className="w-6 h-6 text-cyan-400" />,
      color: 'from-cyan-600/20 to-blue-600/20',
      badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5',
      visual: (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950/80 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="relative p-3 bg-white rounded-2xl shadow-xl shadow-cyan-500/5">
            {/* Custom stylized QR code simulator */}
            <div className="w-24 h-24 grid grid-cols-5 gap-0.5 bg-white p-1">
              {[...Array(25)].map((_, i) => {
                // Generate a visual representation of a QR code
                const isCorner = i === 0 || i === 4 || i === 20 || i === 24 || i === 1 || i === 3 || i === 5 || i === 9 || i === 15 || i === 19 || i === 21 || i === 23;
                const isCenter = i === 12;
                return (
                  <div
                    key={i}
                    className={`rounded-sm ${
                      isCorner || isCenter || i % 3 === 0
                        ? 'bg-slate-950'
                        : 'bg-transparent'
                    }`}
                  />
                );
              })}
            </div>
            <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 flex items-center justify-center pointer-events-none">
              {/* Dynamic pulse scanner line */}
              <div className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_#06b6d4] animate-bounce" />
            </div>
          </div>
          <span className="text-[10px] text-cyan-400 font-bold tracking-widest mt-4 uppercase">Dynamic Link Active</span>
        </div>
      )
    },
    {
      id: 'nfc',
      title: 'NFC Smart Card',
      category: 'Physical Tap',
      description: 'Elegant physical matte-black, metallic, or customized cards embedded with secure NTAG213 chips. Tap to share.',
      icon: <CreditCard className="w-6 h-6 text-indigo-400" />,
      color: 'from-indigo-600/20 to-purple-600/20',
      badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5',
      visual: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-tr from-slate-900 to-[#0e1630] rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl group">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">OneQR Elite</span>
            <Wifi className="w-4 h-4 text-white/50 rotate-90" />
          </div>
          {/* Smart Card Chip */}
          <div className="w-9 h-7 rounded-md bg-gradient-to-r from-amber-400 to-amber-200 p-0.5 mt-2 opacity-80 shadow-md">
            <div className="w-full h-full rounded border border-amber-600/30 grid grid-cols-3 gap-0.5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border-r border-b border-amber-600/20" />
              ))}
            </div>
          </div>
          <div className="mt-8 flex justify-between items-end">
            <div>
              <span className="text-[11px] font-bold text-white tracking-widest block leading-none">MARCUS VANCE</span>
              <span className="text-[7px] text-slate-400 font-semibold tracking-wider block mt-1 uppercase">Executive Partner</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
              <QrCode className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          {/* Glass glare effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
      )
    },
    {
      id: 'standee',
      title: 'Smart QR Standee',
      category: 'In-Store Presence',
      description: 'Elevate physical checkout points, hotel desks, restaurant tables, and exhibition stands with premium physical display stands.',
      icon: <Star className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-600/20 to-teal-600/20',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
      visual: (
        <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-slate-950/80 rounded-2xl border border-white/5 relative overflow-hidden">
          {/* 3D-like Standee Representation */}
          <div className="w-16 h-28 bg-gradient-to-b from-slate-800 to-slate-950 rounded-lg border border-white/10 p-1.5 flex flex-col items-center relative shadow-lg">
            <div className="w-full h-12 bg-blue-600/30 rounded flex items-center justify-center p-1 border border-blue-500/20">
              <span className="text-[6px] font-extrabold text-blue-300 text-center uppercase tracking-widest">TAP OR SCAN</span>
            </div>
            <div className="w-7 h-7 bg-white p-0.5 rounded-md mt-2 flex items-center justify-center shadow-inner">
              <QrCode className="w-full h-full text-black" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-2 bg-slate-900 border-t border-white/15 rounded-full shadow-md" />
          </div>
          <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">In-Store Check-In</span>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: 'Analytics & Cloud Hub',
      category: 'Data Insights',
      description: 'Comprehensive telemetry dashboards. Track scans, clicks, dynamic redirections, locations, and lead submissions in real-time.',
      icon: <BarChart2 className="w-6 h-6 text-purple-400" />,
      color: 'from-purple-600/20 to-indigo-600/20',
      badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/5',
      visual: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-slate-950/80 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-slate-400">TELEMETRY PREVIEW</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] text-emerald-400 font-bold">LIVE</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 my-2">
            <div className="p-1.5 bg-white/5 rounded-lg border border-white/5">
              <span className="text-[8px] text-slate-500 block leading-none">Profile Views</span>
              <span className="text-xs font-bold text-white mt-1 block">18,349</span>
            </div>
            <div className="p-1.5 bg-white/5 rounded-lg border border-white/5">
              <span className="text-[8px] text-slate-500 block leading-none">Click Rate</span>
              <span className="text-xs font-bold text-white mt-1 block">84.2%</span>
            </div>
          </div>
          {/* Miniature glowing bar chart */}
          <div className="h-10 flex items-end gap-1.5 pt-2 border-t border-white/5">
            <div className="flex-1 bg-blue-500/40 rounded-t-sm h-[30%]" />
            <div className="flex-1 bg-cyan-500/50 rounded-t-sm h-[60%]" />
            <div className="flex-1 bg-indigo-500/60 rounded-t-sm h-[45%]" />
            <div className="flex-1 bg-blue-600 rounded-t-sm h-[85%] shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
            <div className="flex-1 bg-cyan-400 rounded-t-sm h-[70%] shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="showcase" className="relative py-24 border-t border-white/5 overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-[30%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-blue-600/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[35vw] h-[35vw] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motionFramer.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-500 text-sm font-extrabold uppercase tracking-widest">
              Unified Ecosystem
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-3 mb-6">
              Our Premium Product Suite
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              We bridge the physical and digital world. Equip your brand, sales force, or store locations with interactive, touchless high-converting tools.
            </p>
          </motionFramer.div>
        </div>

        {/* Product Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <motionFramer.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-3xl p-6 bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-900/60 transition-all duration-300 shadow-glass flex flex-col justify-between overflow-hidden"
            >
              {/* Colored Glow on Hover */}
              <div className={`absolute -inset-px rounded-3xl bg-gradient-to-tr ${product.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />

              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {product.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${product.badgeColor}`}>
                    {product.category}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200 mb-3">
                  {product.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  {product.description}
                </p>
              </div>

              {/* Visual Display Mockup Panel */}
              <div className="h-48 w-full bg-slate-900/20 border border-white/5 rounded-2xl flex items-center justify-center p-3 relative overflow-hidden group-hover:border-white/10 transition-colors">
                {product.visual}
              </div>
            </motionFramer.div>
          ))}
        </div>
      </div>
    </section>
  );
}
