import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, CreditCard, Scan, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';

export default function BottomNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('oneqr_current_user'));

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem('oneqr_current_user'));
    };
    window.addEventListener('auth-state-change', handleAuthChange);
    return () => window.removeEventListener('auth-state-change', handleAuthChange);
  }, []);

  // Show bottom navbar only if logged in and on system routes (excluding landing)
  const systemRoutes = ['/dashboard', '/manage-qr', '/billing', '/scan-qr'];
  const showNavbar = isLoggedIn && systemRoutes.includes(location.pathname);

  if (!showNavbar) return null;

  const tabs = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Billing', path: '/billing', icon: CreditCard },
    { name: 'Scan', path: '/scan-qr', icon: Scan, isFab: true },
    { name: 'Profile', path: '/manage-qr', icon: User },
    { name: 'Logout', path: 'logout', icon: LogOut },
  ];

  const handleTabClick = (tab) => {
    if (tab.path === 'logout') {
      authService.logout();
      navigate('/');
    } else {
      navigate(tab.path);
    }
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="md:hidden fixed bottom-4 left-4 right-4 z-50"
    >
      {/* Floating pill navigation container with glassmorphic style */}
      <div className="relative h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-2xl flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          if (tab.isFab) {
            return (
              <div key={tab.name} className="relative -mt-6">
                {/* Glowing ring animation behind FAB */}
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md animate-pulse -z-10 scale-110" />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTabClick(tab)}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-650 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 ring-4 ring-white dark:ring-slate-950 cursor-pointer"
                  aria-label="Scan QR Code"
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            );
          }

          return (
            <motion.button
              key={tab.name}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl relative transition-all cursor-pointer ${
                isActive 
                  ? 'text-blue-500 dark:text-blue-400 font-extrabold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              {/* Highlight active tab with a small background dot/glow */}
              {isActive && (
                <motion.div 
                  layoutId="bottom-active-indicator"
                  className="absolute -inset-1 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl -z-10"
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-[9px] mt-1 font-semibold">{tab.name}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
