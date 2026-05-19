import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Layers, User, Grid, LogOut, ChevronDown } from 'lucide-react';
import { authService } from '../services/authService';

export default function Navbar({ onOpenAuth, currentView = 'landing', onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const checkUserStatus = () => {
    setCurrentUser(authService.getCurrentUser());
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    checkUserStatus();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('auth-state-change', checkUserStatus);

    // Click outside to close profile dropdown
    const closeDropdown = () => setProfileDropdownOpen(false);
    window.addEventListener('click', closeDropdown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('auth-state-change', checkUserStatus);
      window.removeEventListener('click', closeDropdown);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };


  // Plain navigation links (Dashboard removed as requested)
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  // Helper component for Profile Dropdown (works on desktop and mobile header)
  const ProfileDropdown = ({ isMobile = false }) => {
    if (!currentUser) return null;
    return (
      <div className="relative z-50" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all shadow-glass cursor-pointer select-none"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-extrabold text-xs shadow-inner">
            <User className="w-3.5 h-3.5" />
          </div>
          {!isMobile && (
            <span className="text-xs font-bold text-slate-300 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
              {currentUser.phone}
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {profileDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-[#070b19]/95 backdrop-blur-xl p-2 shadow-2xl overflow-hidden"
            >
              {isMobile && (
                <div className="px-3 py-2 border-b border-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                  Acc: {currentUser.phone}
                </div>
              )}
              
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onNavigate('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onNavigate('dashboard');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <Grid className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dashboard</span>
              </button>

              <div className="h-px bg-white/5 my-1" />

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Log Out</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

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
          <a 
            href="#home" 
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
              }
            }}
            className="flex items-center gap-2 group"
          >
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
                onClick={(e) => {
                  if (currentView !== 'landing') {
                    onNavigate('landing');
                    setTimeout(() => {
                      const el = document.querySelector(link.href);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className="text-sm font-medium transition-colors duration-200 text-slate-400 hover:text-white relative group"
              >
                {link.name}
                <span className="absolute -inset-x-1 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 w-0 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Desktop Action Buttons / Profile Trigger */}
          <div className="flex items-center gap-3">
            {/* Desktop-only auth buttons / Profile dropdown */}
            <div className="hidden md:flex items-center gap-4">
              {currentUser ? (
                <ProfileDropdown isMobile={false} />
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Mobile Profile Trigger (Directly outside hamburger so it is easily accessible!) */}
            {currentUser && (
              <div className="md:hidden flex items-center mr-1">
                <ProfileDropdown isMobile={true} />
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
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
                  onClick={(e) => {
                    setIsOpen(false);
                    if (currentView !== 'landing') {
                      onNavigate('landing');
                      setTimeout(() => {
                        const el = document.querySelector(link.href);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }}
                  className="text-base font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
              
              {!currentUser && (
                <>
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
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
