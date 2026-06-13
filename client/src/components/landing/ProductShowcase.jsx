import { motion as motionFramer } from 'framer-motion';
import { QrCode, Smartphone, CreditCard, Star, BarChart2, Wifi } from 'lucide-react';

export default function ProductShowcase() {
  const products = [
    {
      id: 'profile',
      title: 'Digital Business Profile',
      category: 'Digital Presence',
      description: 'A mobile-optimized landing page containing all your contact info, social links, documents, catalogs, and lead capture forms.',
      icon: <Smartphone className="w-6 h-6 text-blue-600" />,
      color: 'from-blue-50 to-indigo-50',
      badgeColor: 'text-blue-700 border-blue-200 bg-white',
      visual: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-white rounded-2xl border border-slate-200 relative overflow-hidden shadow-sm">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 leading-none">Sophia Martinez</div>
              <span className="text-[10px] text-slate-500 font-medium">Business Manager</span>
            </div>
          </div>
          <div className="space-y-2 my-3">
            <div className="w-full py-2 px-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs text-slate-700 font-semibold border border-slate-100">
              <span>Save Contact</span>
              <span className="text-[10px] font-bold text-blue-600">1-Tap</span>
            </div>
            <div className="w-full py-2 px-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs text-slate-700 font-semibold border border-slate-100">
              <span>View Product Catalog</span>
              <span className="text-[10px] font-bold text-indigo-600">Catalog</span>
            </div>
            <div className="w-full py-2 px-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs text-slate-700 font-semibold border border-slate-100">
              <span>Google Review</span>
              <span className="text-[10px] text-amber-500">⭐⭐⭐⭐⭐</span>
            </div>
          </div>
          <div className="py-2.5 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl text-center">
            <span className="text-[10px] font-bold text-blue-700 block uppercase tracking-wide">Lead Capture Active</span>
          </div>
        </div>
      )
    },
    {
      id: 'qr',
      title: 'Smart QR Code',
      category: 'Smart Scan',
      description: 'Ultra-high precision styled dynamic QR codes that can be edited in real-time, redirecting users dynamically based on parameters.',
      icon: <QrCode className="w-6 h-6 text-cyan-600" />,
      color: 'from-cyan-50 to-blue-50',
      badgeColor: 'text-cyan-700 border-cyan-200 bg-white',
      visual: (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden">
          <div className="relative p-4 bg-white rounded-2xl shadow-md border border-slate-100">
            {/* Custom stylized QR code simulator */}
            <div className="w-24 h-24 grid grid-cols-5 gap-1 bg-white">
              {[...Array(25)].map((_, i) => {
                const isCorner = i === 0 || i === 4 || i === 20 || i === 24 || i === 1 || i === 3 || i === 5 || i === 9 || i === 15 || i === 19 || i === 21 || i === 23;
                const isCenter = i === 12;
                return (
                  <div
                    key={i}
                    className={`rounded-sm ${
                      isCorner || isCenter || i % 3 === 0
                        ? 'bg-slate-900'
                        : 'bg-slate-100'
                    }`}
                  />
                );
              })}
            </div>
            <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl border border-cyan-300/50 flex items-center justify-center pointer-events-none">
              <div className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_#06b6d4] animate-bounce" />
            </div>
          </div>
          <span className="text-[10px] text-cyan-600 font-bold tracking-widest mt-5 uppercase">Dynamic Link Active</span>
        </div>
      )
    },
    {
      id: 'nfc',
      title: 'NFC Smart Card',
      category: 'Physical Tap',
      description: 'Elegant physical matte-black, metallic, or customized cards embedded with secure NTAG213 chips. Tap to share.',
      icon: <CreditCard className="w-6 h-6 text-indigo-600" />,
      color: 'from-indigo-50 to-purple-50',
      badgeColor: 'text-indigo-700 border-indigo-200 bg-white',
      visual: (
        <div className="w-full h-full flex flex-col justify-between p-5 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-2xl border border-slate-200 relative overflow-hidden shadow-lg group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">OneQR Elite</span>
            <Wifi className="w-5 h-5 text-white/50 rotate-90" />
          </div>
          <div className="w-10 h-8 rounded-md bg-gradient-to-r from-amber-300 to-amber-100 p-0.5 mt-2 shadow-sm">
            <div className="w-full h-full rounded border border-amber-500/30 grid grid-cols-3 gap-0.5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border-r border-b border-amber-500/20" />
              ))}
            </div>
          </div>
          <div className="mt-8 flex justify-between items-end">
            <div>
              <span className="text-xs font-bold text-white tracking-widest block leading-none">MARCUS VANCE</span>
              <span className="text-[8px] text-slate-400 font-semibold tracking-wider block mt-1.5 uppercase">Executive Partner</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm">
              <QrCode className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>
      )
    },
    {
      id: 'standee',
      title: 'Smart QR Standee',
      category: 'In-Store Presence',
      description: 'Elevate physical checkout points, hotel desks, restaurant tables, and exhibition stands with premium physical display stands.',
      icon: <Star className="w-6 h-6 text-emerald-600" />,
      color: 'from-emerald-50 to-teal-50',
      badgeColor: 'text-emerald-700 border-emerald-200 bg-white',
      visual: (
        <div className="w-full h-full flex flex-col items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden">
          <div className="w-16 h-28 bg-white rounded-lg border border-slate-200 p-1.5 flex flex-col items-center relative shadow-md">
            <div className="w-full h-12 bg-blue-50 rounded flex items-center justify-center p-1 border border-blue-100">
              <span className="text-[7px] font-extrabold text-blue-700 text-center uppercase tracking-widest">TAP OR SCAN</span>
            </div>
            <div className="w-8 h-8 bg-white p-1 rounded-md mt-2 flex items-center justify-center border border-slate-100 shadow-sm">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-2 bg-slate-300 rounded-full shadow-sm" />
          </div>
          <span className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase mt-2">In-Store Check-In</span>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: 'Analytics & Cloud Hub',
      category: 'Data Insights',
      description: 'Comprehensive telemetry dashboards. Track scans, clicks, dynamic redirections, locations, and lead submissions in real-time.',
      icon: <BarChart2 className="w-6 h-6 text-purple-600" />,
      color: 'from-purple-50 to-indigo-50',
      badgeColor: 'text-purple-700 border-purple-200 bg-white',
      visual: (
        <div className="w-full h-full flex flex-col justify-between p-4 bg-white rounded-2xl border border-slate-200 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Telemetry Preview</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] text-emerald-700 font-bold">LIVE</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 my-3">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[9px] text-slate-500 block font-semibold uppercase">Profile Views</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">18,349</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[9px] text-slate-500 block font-semibold uppercase">Click Rate</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">84.2%</span>
            </div>
          </div>
          <div className="h-12 flex items-end gap-2 pt-2 border-t border-slate-100">
            <div className="flex-1 bg-blue-100 rounded-t-sm h-[30%]" />
            <div className="flex-1 bg-cyan-100 rounded-t-sm h-[60%]" />
            <div className="flex-1 bg-indigo-100 rounded-t-sm h-[45%]" />
            <div className="flex-1 bg-blue-500 rounded-t-sm h-[85%]" />
            <div className="flex-1 bg-cyan-500 rounded-t-sm h-[70%]" />
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="showcase" className="relative py-24 bg-white overflow-hidden">
      <div className="absolute top-[30%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-blue-50 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[35vw] h-[35vw] rounded-full bg-cyan-50 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motionFramer.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest mb-4">
              Unified Ecosystem
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              Our Premium Product Suite
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              We bridge the physical and digital world. Equip your brand, sales force, or store locations with interactive, touchless high-converting tools.
            </p>
          </motionFramer.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <motionFramer.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-[2rem] p-8 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 shadow-sm flex flex-col justify-between overflow-hidden"
            >
              <div className={`absolute -inset-px rounded-[2rem] bg-gradient-to-tr ${product.color} opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-xl -z-10`} />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {product.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${product.badgeColor}`}>
                    {product.category}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-200 mb-4">
                  {product.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">
                  {product.description}
                </p>
              </div>

              <div className="h-56 w-full bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden group-hover:border-slate-200 transition-colors">
                {product.visual}
              </div>
            </motionFramer.div>
          ))}
        </div>
      </div>
    </section>
  );
}
