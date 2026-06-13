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
    <footer className="relative border-t border-slate-200 bg-[#FAFAFA] overflow-hidden py-16">
      <div className="absolute bottom-[-10vw] left-[10vw] w-[30vw] h-[30vw] rounded-full bg-blue-100/50 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-200">
          
          <div className="lg:col-span-4 space-y-6">
            <a href="#home" className="flex items-center gap-2 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                One<span className="text-blue-600">QR</span>
              </span>
            </a>
            
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm font-medium">
              Connecting physical spaces to instant digital presence. Build next-gen landing cards, custom NFC tags, and boost business reviews.
            </p>

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
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                  aria-label={soc.name}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-3 gap-6 sm:gap-8">
            {quickLinks.map((col) => (
              <div key={col.title} className="space-y-5">
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest block">
                  {col.title}
                </span>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-[13px] font-medium text-slate-600 hover:text-blue-600 hover:underline decoration-blue-500 underline-offset-4 transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 space-y-4">
            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest block">
              Subscribe to Newsletter
            </span>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Stay ahead of digital networking. Receive weekly vCard tips and chip releases.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 shadow-sm transition-all"
              />
              <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
                Join
              </button>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
          <span className="text-sm font-medium text-slate-500">
            © {new Date().getFullYear()} OneQR Inc. All rights reserved.
          </span>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">SLA Agreement</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
