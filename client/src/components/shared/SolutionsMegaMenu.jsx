import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, Store, Building, Ticket, Stethoscope, GraduationCap, 
  Home, Briefcase, TrendingUp, Megaphone, Factory, Wrench, 
  ChevronDown, ArrowRight, QrCode
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    icon: Utensils,
    title: 'Restaurants & Cafes',
    description: 'Digital menus & ordering',
    solutions: ['QR Menus', 'Table Ordering', 'Feedback Forms']
  },
  {
    icon: Store,
    title: 'Retail Stores',
    description: 'In-store digital experiences',
    solutions: ['Product Info QR', 'Loyalty Programs', 'Payments']
  },
  {
    icon: Building,
    title: 'Hotels & Hospitality',
    description: 'Guest services & directories',
    solutions: ['Room Service QR', 'Digital Compendium', 'WiFi Access']
  },
  {
    icon: Ticket,
    title: 'Events & Conferences',
    description: 'Ticketing & networking',
    solutions: ['Digital Badges', 'Event Schedules', 'Lead Capture']
  },
  {
    icon: Stethoscope,
    title: 'Healthcare & Clinics',
    description: 'Patient intake & info',
    solutions: ['Appointment Booking', 'Patient Feedback', 'Clinic Info']
  },
  {
    icon: GraduationCap,
    title: 'Education & Training',
    description: 'Campus & student portals',
    solutions: ['Campus Maps', 'Class Schedules', 'Attendance']
  },
  {
    icon: Home,
    title: 'Real Estate',
    description: 'Property listings & tours',
    solutions: ['Virtual Tours', 'Agent Contact', 'Property Info']
  },
  {
    icon: Briefcase,
    title: 'Corporate & Offices',
    description: 'Workplace management',
    solutions: ['Visitor Management', 'Meeting Rooms', 'Employee ID']
  },
  {
    icon: TrendingUp,
    title: 'Sales Teams',
    description: 'Digital business cards',
    solutions: ['vCard QR', 'Portfolio Links', 'Lead Generation']
  },
  {
    icon: Megaphone,
    title: 'Marketing & Agencies',
    description: 'Campaign tracking',
    solutions: ['Campaign QRs', 'Social Links', 'Analytics']
  },
  {
    icon: Factory,
    title: 'Manufacturing & Logistics',
    description: 'Inventory & manuals',
    solutions: ['Equipment Manuals', 'Inventory Tracking', 'Safety Guides']
  },
  {
    icon: Wrench,
    title: 'Service Businesses',
    description: 'Booking & reviews',
    solutions: ['Service Booking', 'Review Collection', 'Contact Info']
  }
];

export const SolutionsDesktopMenu = ({ onOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div 
      className="group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm font-semibold transition-all duration-300 text-slate-600 group-hover:text-blue-600 px-4 py-2 rounded-xl group-hover:bg-blue-50 cursor-pointer">
        Solutions
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-1/2 rounded-full opacity-0 group-hover:opacity-100"></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 pt-4 z-50 cursor-default px-6"
          >
            <div className="max-w-7xl mx-auto bg-white rounded-[20px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden flex">
              
              {/* Left Side: Categories Grid */}
              <div className="flex-1 p-8 grid grid-cols-3 gap-x-6 gap-y-8 relative">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1E3A8A 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                
                {categories.map((cat, index) => (
                  <div key={index} className="group/item flex gap-4 items-start relative z-10 cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover/item:bg-blue-50 group-hover/item:border-blue-100 group-hover/item:text-blue-600 transition-colors duration-300 text-slate-500 shadow-sm">
                      <cat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover/item:text-blue-600 transition-colors duration-300 mb-0.5">
                        {cat.title}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-500 mb-2 leading-snug">
                        {cat.description}
                      </p>
                      <ul className="space-y-1">
                        {cat.solutions.map((sol, i) => (
                          <li key={i} className="text-[10px] font-semibold text-slate-400 flex items-center gap-1.5 group-hover/item:text-slate-500 transition-colors">
                            <div className="w-1 h-1 rounded-full bg-slate-300 group-hover/item:bg-blue-400 transition-colors" />
                            {sol}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side: CTA Panel */}
              <div className="w-[320px] bg-[#FAFAFA] border-l border-slate-100 p-8 flex flex-col justify-between relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1E3A8A]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-[#1E3A8A] flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-600/20">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">
                    Build Your First<br/>QR Experience
                  </h3>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed mb-8">
                    Create dynamic QR codes, digital menus, forms, attendance systems, sales tracking, and business automation in minutes.
                  </p>
                </div>

                <div className="space-y-3 relative z-10">
                  <button 
                    onClick={() => { setIsOpen(false); onOpenAuth('signup'); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1E3A8A] hover:bg-slate-900 text-white text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <span>Start Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { setIsOpen(false); navigate('/?#contact'); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Book Demo
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SolutionsMobileAccordion = ({ onOpenAuth, closeMobileMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-base font-semibold text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
      >
        <span>Solutions</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="py-2 pl-2 pr-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {categories.map((cat, index) => (
                  <div key={index} className="flex gap-3 items-start cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <cat.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{cat.title}</h4>
                      <p className="text-[11px] font-medium text-slate-500 line-clamp-1">{cat.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <h4 className="text-sm font-extrabold text-slate-900 mb-2">Ready to transform?</h4>
                <p className="text-xs text-slate-600 mb-4">Create your first dynamic QR experience today.</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { closeMobileMenu(); onOpenAuth('signup'); }}
                    className="flex-1 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold shadow-sm"
                  >
                    Start Free
                  </button>
                  <button 
                    onClick={() => { closeMobileMenu(); navigate('/?#contact'); }}
                    className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-sm"
                  >
                    Book Demo
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
