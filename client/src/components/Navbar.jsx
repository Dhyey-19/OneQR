import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Layers } from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'Use Cases', href: '#use-cases' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'py-4 bg-[#030712]/70 backdrop-blur-md border-b border-white/5' 
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/45 transition-all duration-300">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
              One<span className="text-blue-500">QR</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onOpenAuth('login')}
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200 px-4 py-2 cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="relative inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-sm text-white overflow-hidden group cursor-pointer"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600" />
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-2 z-10">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <span className="absolute -inset-px rounded-xl border border-white/20 pointer-events-none" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[72px] z-40 md:hidden glass border-b border-white/5 py-6 px-6 shadow-2xl"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-white/5 my-2" />
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setIsOpen(false); onOpenAuth('login'); }}
                  className="w-full text-center py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => { setIsOpen(false); onOpenAuth('signup'); }}
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-semibold text-white hover:from-blue-500 hover:to-cyan-400 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
