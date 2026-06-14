import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/landing/Hero';
import Showcase from '../components/landing/Showcase';
import Features from '../components/landing/Features';
import Pricing from '../components/landing/Pricing';
import Testimonials from '../components/landing/Testimonials';
import Faq from '../components/landing/Faq';
import ContactForm from '../components/landing/ContactForm';

/**
 * Landing Page Wrapper Component to handle scroll-to-hash triggers and render landing sections
 */
export default function LandingPage({ openAuthModal, handleSelectPlan }) {
  const location = useLocation();

  useEffect(() => {
    if (location.hash && location.hash !== '#home') {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location.hash]);

  return (
    <>
      {/* 1. Hero Section */}
      <Hero onOpenAuth={openAuthModal} />
      
      {/* 2. Showcase Section */}
      <Showcase />
      
      {/* 3. Features Grid */}
      <Features />
      
      {/* 3. Pricing Section */}
      <Pricing onSelectPlan={handleSelectPlan} />
      
      {/* 4. Testimonials */}
      <Testimonials />
      
      {/* 5. Collapsible FAQ */}
      <Faq />
      
      {/* 6. Contact Form */}
      <ContactForm />
    </>
  );
}
