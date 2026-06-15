import React, { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  Layers,
  User,
  Grid,
  LogOut,
  ChevronDown,
  CreditCard,
  Scan,
  MessageSquare,
  RefreshCw,
  Check,
  Home,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import {
  SolutionsDesktopMenu,
  SolutionsMobileAccordion,
} from "./SolutionsMegaMenu";

export default function Navbar({
  onOpenAuth,
  currentView = "landing",
  onNavigate,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("auth-state-change", checkUserStatus);

    // Click outside to close profile dropdown
    const closeDropdown = () => setProfileDropdownOpen(false);
    window.addEventListener("click", closeDropdown);

    const onSaveStart = () => setIsSaving(true);
    const onSaveSuccess = () => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 1500);
    };
    const onSaveError = () => setIsSaving(false);

    window.addEventListener("profileSaveStart", onSaveStart);
    window.addEventListener("profileSaveSuccess", onSaveSuccess);
    window.addEventListener("profileSaveError", onSaveError);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("auth-state-change", checkUserStatus);
      window.removeEventListener("click", closeDropdown);
      window.removeEventListener("profileSaveStart", onSaveStart);
      window.removeEventListener("profileSaveSuccess", onSaveSuccess);
      window.removeEventListener("profileSaveError", onSaveError);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  const dashboardLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Feedback", path: "/feedbacks" },
    { name: "Plans", path: "/plans" },
  ];

  const isDashboardRoute = [
    "/dashboard",
    "/manage-qr",
    "/scan-qr",
    "/feedbacks",
    "/profile",
    "/plans",
  ].includes(location.pathname);

  const ProfileDropdown = ({ isMobile = false }) => {
    if (!currentUser) return null;
    return (
      <div className="relative z-50" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-4 border-l border-white/10 pl-4 ml-2">

          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full transition-all cursor-pointer ${
                isDashboardRoute 
                  ? 'hover:bg-white/10 border-white/10' 
                  : 'border border-transparent hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                isDashboardRoute 
                  ? 'bg-blue-950 text-white shadow-inner border border-white/10' 
                  : 'bg-slate-100 text-slate-600 shadow-sm border border-slate-200'
              }`}>
                <User className="w-4 h-4" />
              </div>
              <ChevronDown className={`w-3.5 h-3.5 ${isDashboardRoute ? 'text-white/70' : 'text-slate-400'}`} />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {profileDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl overflow-hidden"
            >
              {isMobile && (
                <div className="px-3 py-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Account: {currentUser.phone}
                </div>
              )}

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate("/dashboard");
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <Grid className="w-4 h-4 text-slate-400" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate("/feedbacks");
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>Feedbacks</span>
              </button>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate("/scan-qr");
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <Scan className="w-4 h-4 text-slate-400" />
                <span>Scan QR</span>
              </button>

              <div className="h-px bg-slate-100 my-2" />

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
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
          isDashboardRoute
            ? "py-4 bg-blue-950 border-b border-white/10 shadow-lg text-white"
            : scrolled
            ? "py-4 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => {
              if (location.pathname !== "/") {
                e.preventDefault();
                navigate({ pathname: "/" });
              }
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105 duration-300 ${isDashboardRoute ? 'bg-white/10' : 'bg-slate-900'}`}>
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className={`font-extrabold text-xl tracking-tight ${isDashboardRoute ? 'text-white' : 'text-slate-900'}`}>
                One<span className={isDashboardRoute ? "text-blue-400" : "text-blue-600"}>QR</span>
              </span>
            </div>
          </a>

          {location.pathname !== "/manage-qr" && (
            <div className="hidden md:flex items-center gap-2">
              {!isDashboardRoute
                ? navLinks.map((link, index) => (
                    <React.Fragment key={link.name}>
                      {index === 1 && (
                        <SolutionsDesktopMenu onOpenAuth={onOpenAuth} />
                      )}
                      <a
                        href={link.href}
                        onClick={(e) => {
                          if (location.pathname !== "/") {
                            e.preventDefault();
                            navigate({ pathname: "/", hash: link.href });
                          }
                        }}
                        className="text-sm font-semibold transition-all duration-300 text-slate-600 hover:text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 relative group"
                      >
                        {link.name}
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-1/2 rounded-full opacity-0 group-hover:opacity-100"></span>
                      </a>
                    </React.Fragment>
                  ))
                : dashboardLinks.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => navigate(link.path)}
                      className={`text-sm font-semibold transition-all duration-300 cursor-pointer px-4 py-2 relative group ${location.pathname === link.path ? "text-white" : "text-white/70 hover:text-white"}`}
                    >
                      {link.name}
                      {location.pathname === link.path && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-0.5 bg-white rounded-full"></span>
                      )}
                    </button>
                  ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            {location.pathname === "/manage-qr" ? (
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer shadow-sm"
                  title="Home"
                >
                  <Home className="w-5 h-5" />
                </button>
                <button
                  disabled={isSaving}
                  onClick={() => {
                    const saveBtn =
                      document.getElementById("manage-qr-save-btn");
                    if (saveBtn) saveBtn.click();
                  }}
                  className={`px-6 py-2 rounded-xl font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    saveSuccess
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="hidden md:inline">Saving...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="hidden md:inline">Saved!</span>
                    </>
                  ) : (
                    <span>Save</span>
                  )}
                </button>
              </div>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-4">
                  {currentUser ? (
                    <ProfileDropdown isMobile={false} />
                  ) : (
                    <button
                      onClick={() => onOpenAuth("login")}
                      className="relative inline-flex items-center justify-center px-6 py-2.5 rounded-full font-semibold text-sm text-white bg-[#0F172A] hover:bg-[#1E3A8A] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                    >
                      Login
                    </button>
                  )}
                </div>

                {currentUser &&
                  ![
                    "/dashboard",
                    "/manage-qr",
                    "/scan-qr",
                    "/feedbacks",
                    "/profile",
                    "/plans",
                  ].includes(location.pathname) && (
                    <div className="md:hidden flex items-center mr-1">
                      <ProfileDropdown isMobile={true} />
                    </div>
                  )}

                {![
                  "/dashboard",
                  "/manage-qr",
                  "/scan-qr",
                  "/feedbacks",
                  "/profile",
                  "/plans",
                ].includes(location.pathname) && (
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer bg-white rounded-xl shadow-sm border border-slate-200"
                  >
                    {isOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className={`w-5 h-5 ${isDashboardRoute ? 'text-white' : 'text-slate-600'}`} />
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[72px] z-40 md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 py-6 px-6 shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <Fragment key={link.name}>
                  {index === 1 && (
                    <SolutionsMobileAccordion
                      onOpenAuth={onOpenAuth}
                      closeMobileMenu={() => setIsOpen(false)}
                    />
                  )}
                  <a
                    href={link.href}
                    onClick={(e) => {
                      setIsOpen(false);
                      if (location.pathname !== "/") {
                        e.preventDefault();
                        navigate({ pathname: "/", hash: link.href });
                      }
                    }}
                    className="text-base font-semibold text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-50"
                  >
                    {link.name}
                  </a>
                </Fragment>
              ))}

              {!currentUser && (
                <>
                  <div className="h-px bg-slate-100 my-2" />
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onOpenAuth("login");
                      }}
                      className="w-full text-center py-3 rounded-xl bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-md cursor-pointer"
                    >
                      Login
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
