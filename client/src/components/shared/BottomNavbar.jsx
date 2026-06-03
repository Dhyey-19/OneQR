import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Scan, User, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const systemRoutes = ['/dashboard', '/manage-qr', '/scan-qr', '/feedbacks', '/profile', '/plans'];
  const showNavbar = isLoggedIn && systemRoutes.includes(location.pathname);

  if (!showNavbar) return null;

  const tabs = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Scan', path: '/scan-qr', icon: Scan },
    { name: 'Feedback', path: '/feedbacks', icon: MessageSquare },
    { name: 'Plans', path: '/plans', icon: CreditCard },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleTabClick = (tab) => {
    navigate(tab.path);
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe"
    >
      {/* Navigation container docked directly to bottom of viewport */}
      <div className="h-16 flex items-center justify-around px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

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
