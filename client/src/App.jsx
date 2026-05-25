import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import { authService } from './services/authService';

// Section Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import DemoProfilePage from './components/DemoProfilePage';

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login'); // 'login' | 'signup'
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname;
    if (path !== '/' && path !== '/index.html') {
      return 'demo';
    }
    const isLoggedIn = !!localStorage.getItem('oneqr_current_user');
    const hash = window.location.hash;
    if (hash === '#dashboard' || hash === '#manage-qr') {
      return isLoggedIn ? 'dashboard' : 'landing';
    }
    return 'landing';
  });

  const openAuthModal = (tab = 'login') => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Handle URL Hash-based Routing
  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.pathname;
      if (path !== '/' && path !== '/index.html') {
        setCurrentView('demo');
        return;
      }

      const hash = window.location.hash;
      const isLoggedIn = !!localStorage.getItem('oneqr_current_user');

      if (hash === '#dashboard' || hash === '#manage-qr') {
        if (isLoggedIn) {
          setCurrentView('dashboard');
        } else {
          window.location.hash = '#home';
          setCurrentView('landing');
        }
      } else {
        setCurrentView('landing');
        if (hash && hash !== '#home') {
          setTimeout(() => {
            const el = document.querySelector(hash);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 150);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Run initially
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Listen to logout / auth change to auto-redirect from dashboard to landing page
  useEffect(() => {
    const handleAuthChange = () => {
      const path = window.location.pathname;
      if (path !== '/' && path !== '/index.html') return;

      const userJson = localStorage.getItem('oneqr_current_user');
      if (!userJson) {
        window.location.hash = '#home';
        setCurrentView('landing');
      } else {
        window.location.hash = '#dashboard';
        setCurrentView('dashboard');
      }
    };
    window.addEventListener('auth-state-change', handleAuthChange);
    return () => window.removeEventListener('auth-state-change', handleAuthChange);
  }, []);

  // Guarantee instant scroll-to-top whenever the primary view switches!
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  // Navigate utility that updates URL hash dynamically
  const handleNavigate = (view) => {
    if (view === 'dashboard') {
      window.location.hash = '#dashboard';
    } else if (view === 'manage-qr') {
      window.location.hash = '#manage-qr';
    } else {
      window.location.hash = '#home';
    }
  };

  if (currentView === 'demo') {
    return <DemoProfilePage />;
  }

  return (
    <div className="relative min-h-screen bg-[#030712] selection:bg-blue-500/30 selection:text-white">
      {/* Structural Global Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-[-10vw] w-[45vw] h-[45vw] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute top-[35%] left-[-15vw] w-[40vw] h-[40vw] rounded-full bg-cyan-500/5 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[-10vw] w-[35vw] h-[35vw] rounded-full bg-indigo-600/5 blur-[110px]" />
      </div>

      {/* Structural Sections Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar 
          onOpenAuth={openAuthModal} 
          currentView={currentView}
          onNavigate={handleNavigate}
        />
        
        <main className="flex-grow">
          {currentView === 'landing' ? (
            <>
              {/* 1. Hero Section */}
              <Hero onOpenAuth={openAuthModal} />
              
              {/* 2. Features Grid */}
              <Features />
              
              {/* 3. Pricing Section */}
              <Pricing onOpenAuth={openAuthModal} />
              
              {/* 4. Testimonials */}
              <Testimonials />
              
              {/* 5. Collapsible FAQ */}
              <Faq />
              
              {/* 6. Contact Form */}
              <ContactForm />
            </>
          ) : (
            <Dashboard />
          )}
        </main>
        
        <Footer />

        {/* Global Authentication Modal Center */}
        <AnimatePresence>
          {authModalOpen && (
            <AuthModal
              onClose={() => setAuthModalOpen(false)}
              initialTab={authInitialTab}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
