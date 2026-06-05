import { Layers } from 'lucide-react';
import { FaTwitter, FaLinkedinIn, FaYoutube, FaGithub } from 'react-icons/fa';

export default function Footer() {
  const quickLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features List', href: '#features' },
        { name: 'Pricing Tiers', href: '#pricing' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Developer API', href: '#' },
        { name: 'Support Center', href: '#faq' },
        { name: 'NFC Chip Guide', href: '#' },
        { name: 'Video Tutorials', href: '#' },
        { name: 'Success Stories', href: '#testimonials' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About OneQR', href: '#' },
        { name: 'Partnership Program', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Press Kit', href: '#' },
        { name: 'Contact Sales', href: '#contact' }
      ]
    }
  ];

  return (
    <footer className="relative border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#02050f]/80 backdrop-blur-xl overflow-hidden py-16">
      {/* Background glowing blobs */}
      <div className="absolute bottom-[-10vw] left-[10vw] w-[30vw] h-[30vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-200 dark:border-white/5">
          
          {/* Logo Column */}
          <div className="lg:col-span-4 space-y-6">
            <a href="#home" className="flex items-center gap-2 group w-fit">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                <Layers className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                One<span className="text-blue-500">QR</span>
              </span>
            </a>
            
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">

              Connecting physical spaces to instant digital presence. Build next-gen landing cards, custom NFC tags, and boost business reviews.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: <FaTwitter className="w-4 h-4" />, href: '#', name: 'Twitter' },
                { icon: <FaLinkedinIn className="w-4 h-4" />, href: '#', name: 'LinkedIn' },
                { icon: <FaYoutube className="w-4 h-4" />, href: '#', name: 'YouTube' },
                { icon: <FaGithub className="w-4 h-4" />, href: '#', name: 'GitHub' }
              ].map((soc) => (
                <a
                  key={soc.name}
                  href={soc.href}
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-blue-500/30 hover:bg-blue-500/5 transition-all shadow-sm"
                  aria-label={soc.name}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-6 sm:gap-8">
            {quickLinks.map((col) => (
              <div key={col.title} className="space-y-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  {col.title}
                </span>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:underline decoration-blue-500 underline-offset-4 transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3 space-y-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Subscribe to Newsletter
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-normal">
              Stay ahead of digital networking. Receive weekly vCard tips and chip releases.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
              />
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
          <span className="text-xs text-slate-500">
            © {new Date().getFullYear()} OneQR Inc. All rights reserved.
          </span>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">SLA Agreement</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
