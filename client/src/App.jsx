import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';

// Layout & Shared Components
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import AuthModal from './components/shared/AuthModal';
import BottomNavbar from './components/shared/BottomNavbar';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import DemoProfilePage from './pages/DemoProfilePage';

// App Layout wrapper component
function AppLayout({ children, openAuthModal, handleNavigate }) {
  const location = useLocation();
  // If we are on landing, currentView is 'landing', otherwise 'dashboard'
  const currentView = location.pathname === '/' ? 'landing' : 'dashboard';

  return (
    <div className="relative min-h-screen bg-transparent selection:bg-blue-500/30 selection:text-slate-900 dark:selection:text-white transition-colors duration-300">
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
          {children}
        </main>
        
        {location.pathname === '/' && <Footer />}
        
        {/* Mobile Bottom Navigation for Authenticated Users */}
        <BottomNavbar />
      </div>
    </div>
  );
}

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login'); // 'login' | 'signup'

  const navigate = useNavigate();
  const location = useLocation();

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
      const isLoggedIn = !!localStorage.getItem('oneqr_current_user');
      const currentPath = window.location.pathname;
      
      const isSystemPath = currentPath === '/' || currentPath === '/index.html' || 
                            ['/dashboard', '/manage-qr', '/scan-qr', '/feedbacks', '/profile', '/plans'].includes(currentPath);

      if (!isSystemPath) return;

      if (!isLoggedIn) {
        if (currentPath !== '/' && currentPath !== '/index.html') {
          navigate('/');
        }
      } else {
        const pendingPlan = localStorage.getItem('pending_plan_checkout');
        if (pendingPlan) {
          navigate('/dashboard');
        } else {
          // If we are already on a dashboard path, don't force redirect to main dashboard
          if (!['/dashboard', '/manage-qr', '/scan-qr', '/feedbacks', '/profile', '/plans'].includes(currentPath)) {
            navigate('/dashboard');
          }
        }
      }
    };

    handleAuthChange();

    window.addEventListener('auth-state-change', handleAuthChange);
    return () => window.removeEventListener('auth-state-change', handleAuthChange);
  }, [navigate, location.pathname]);

  // Guarantee instant scroll-to-top whenever the primary path switches!
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Navigate utility that updates URL path dynamically
  const handleNavigate = (view) => {
    if (view === 'dashboard') {
      navigate('/dashboard');
    } else if (view === 'manage-qr') {
      navigate('/manage-qr');
    } else if (view === 'billing') {
      navigate('/dashboard');
    } else if (view === 'scan-qr') {
      navigate('/scan-qr');
    } else if (view === 'feedbacks') {
      navigate('/feedbacks');
    } else if (view === 'profile') {
      navigate('/profile');
    } else if (view === 'plans') {
      navigate('/plans');
    } else {
      navigate('/');
    }
  };

  const handleSelectPlan = (planKey) => {
    const isLoggedIn = !!localStorage.getItem('oneqr_current_user');
    localStorage.setItem('pending_plan_checkout', planKey);
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      openAuthModal('signup');
    }
  };

  // Check if current route is a system path or not
  const systemPaths = ['/', '/dashboard', '/manage-qr', '/scan-qr', '/feedbacks', '/profile', '/plans'];
  const isSlugPath = !systemPaths.includes(location.pathname) && location.pathname !== '/index.html';

  if (isSlugPath) {
    return <DemoProfilePage />;
  }

  return (
    <AppLayout 
      openAuthModal={openAuthModal} 
      handleNavigate={handleNavigate}
    >
      <Routes>
        <Route path="/" element={<LandingPage openAuthModal={openAuthModal} handleSelectPlan={handleSelectPlan} />} />
        
        {/* Protected Dashboard Views */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage subViewProp="overview" />
          </ProtectedRoute>
        } />
        <Route path="/manage-qr" element={
          <ProtectedRoute>
            <DashboardPage subViewProp="manage-qr" />
          </ProtectedRoute>
        } />
        <Route path="/billing" element={
          <Navigate to="/dashboard" replace />
        } />
        <Route path="/scan-qr" element={
          <ProtectedRoute>
            <DashboardPage subViewProp="qr-scan" />
          </ProtectedRoute>
        } />
        <Route path="/feedbacks" element={
          <ProtectedRoute>
            <DashboardPage subViewProp="feedbacks" />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <DashboardPage subViewProp="profile" />
          </ProtectedRoute>
        } />
        <Route path="/plans" element={
          <ProtectedRoute>
            <DashboardPage subViewProp="plans" />
          </ProtectedRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Authentication Modal Center */}
      <AnimatePresence>
        {authModalOpen && (
          <AuthModal
            onClose={() => setAuthModalOpen(false)}
            initialTab={authInitialTab}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
