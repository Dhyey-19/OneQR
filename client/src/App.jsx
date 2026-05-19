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

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login'); // 'login' | 'signup'
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard'

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

  // Listen to logout / auth change to auto-redirect from dashboard to landing page
  useEffect(() => {
    const handleAuthChange = () => {
      if (!authService.isAuthenticated()) {
        setCurrentView('landing');
      }
    };
    window.addEventListener('auth-state-change', handleAuthChange);
    return () => window.removeEventListener('auth-state-change', handleAuthChange);
  }, []);

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
          onNavigate={setCurrentView}
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
