import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  QrCode, Smartphone, BarChart2, Sparkles, Link2, User, 
  Mail, Globe, Phone, Download, Check, RefreshCw, 
  MapPin, CreditCard, Star, Plus, Trash2, ArrowUpRight,
  Sun, Moon
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaTwitter, FaGoogle, FaWhatsapp, FaMoneyBillWave } from 'react-icons/fa';
import { authService } from '../services/authService';
import { apiRequest } from '../services/apiService';

// Dynamic file preview helper component (handles ObjectURL memory leak safety)
function FilePreview({ doc }) {
  const [localUrl, setLocalUrl] = useState(null);

  useEffect(() => {
    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      setLocalUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setLocalUrl(null);
    }
  }, [doc.file]);

  const url = localUrl || doc.url;
  
  const isImage = () => {
    if (doc.file) return doc.file.type.startsWith('image/');
    const name = doc.filename || '';
    const u = doc.url || '';
    return /\.(jpeg|jpg|gif|png|webp|svg)/i.test(name) || /\.(jpeg|jpg|gif|png|webp|svg)/i.test(u);
  };

  const isPdf = () => {
    if (doc.file) return doc.file.type === 'application/pdf';
    const name = doc.filename || '';
    const u = doc.url || '';
    return name.toLowerCase().endsWith('.pdf') || u.toLowerCase().endsWith('.pdf');
  };

  if (!url) {
    return (
      <div className="w-16 h-16 rounded-xl bg-slate-900/60 border border-dashed border-white/10 flex items-center justify-center text-slate-600 shrink-0">
        <Smartphone className="w-6 h-6 opacity-30 animate-pulse" />
      </div>
    );
  }

  if (isImage()) {
    return (
      <div className="w-16 h-16 rounded-xl bg-slate-900 border border-white/10 overflow-hidden shrink-0 relative group/thumb cursor-pointer">
        <img 
          src={url} 
          alt={doc.filename} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110" 
        />
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center"
        >
          <ArrowUpRight className="w-4 h-4 text-white" />
        </a>
      </div>
    );
  }

  if (isPdf()) {
    return (
      <div className="w-16 h-16 rounded-xl bg-rose-950/20 border border-rose-500/20 flex flex-col items-center justify-center text-rose-400 shrink-0 relative group/thumb cursor-pointer">
        <span className="text-[10px] font-black tracking-wider uppercase mb-1">PDF</span>
        <div className="text-[8px] bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 text-rose-300">View</div>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute inset-0 bg-black/45 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center rounded-xl"
        >
          <ArrowUpRight className="w-4 h-4 text-white" />
        </a>
      </div>
    );
  }

  return (
    <div className="w-16 h-16 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center text-slate-400 shrink-0 relative group/thumb cursor-pointer">
      <span className="text-[9px] font-bold tracking-wider uppercase mb-1 text-slate-500">FILE</span>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center rounded-xl"
      >
        <ArrowUpRight className="w-4 h-4 text-white" />
      </a>
    </div>
  );
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [subView, setSubView] = useState('overview'); // 'overview' | 'manage-qr'

  // Payment integration states
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockPaymentData, setMockPaymentData] = useState(null);
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' | 'yearly'
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successPlanName, setSuccessPlanName] = useState('');

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      description: 'Perfect for small shops and personal businesses starting their digital presence.',
      monthlyPrice: 1,
      yearlyPrice: 1,
      features: [
        'Create your own digital business profile page',
        'Share one smart QR code with customers',
        'Add WhatsApp, Instagram, Facebook, and other links',
        'Let customers save your contact in one click',
        'Add shop name, address, phone number, and timings',
        'Simple colors and design customization',
        'Easy mobile-friendly page for all customers',
        'Update your business information anytime'
      ],
      glow: 'from-slate-800 to-slate-900',
      buttonStyle: 'glass-light hover:bg-white/5 text-white border-white/10'
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      description: 'Best for growing businesses that want more customers, reviews, and better branding.',
      monthlyPrice: 1,
      yearlyPrice: 1,
      features: [
        'Everything in Starter, plus:',
        'See how many people scanned your QR code',
        'Track customer visits and link clicks',
        'Upload PDF menus, brochures, and product catalogs',
        'Send customers directly to your Google Review page',
        'Remove OneQR branding from your profile',
        'Create a more professional business experience',
        'Better customization and premium business tools'
      ],
      glow: 'from-blue-600/20 via-indigo-600/10 to-[#030712]',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-400'
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleUpgrade = async (planId) => {
    setIsPaymentLoading(true);
    try {
      const res = await apiRequest('/payment/create-order', {
        method: 'POST',
        body: JSON.stringify({ planId }),
      });

      if (res.status === 'success' && res.data) {
        const orderData = res.data;

        if (orderData.isMock) {
          setMockPaymentData({
            planId,
            orderId: orderData.orderId,
            planName: orderData.planName,
            amount: orderData.amount,
          });
          setShowMockModal(true);
        } else {
          const options = {
            key: orderData.keyId,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "OneQR Platforms",
            description: orderData.planName,
            order_id: orderData.orderId,
            handler: async function (response) {
              try {
                const verifyRes = await apiRequest('/payment/verify-payment', {
                  method: 'POST',
                  body: JSON.stringify({
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                    planId,
                  }),
                });

                if (verifyRes.status === 'success') {
                  const updatedUser = await authService.getProfile();
                  setCurrentUser(updatedUser);
                  setSuccessPlanName(orderData.planName);
                  setShowSuccessModal(true);
                } else {
                  alert(verifyRes.message || 'Payment verification failed.');
                }
              } catch (err) {
                console.error('Payment verification error:', err);
                alert(err.message || 'Error verifying payment signature.');
              }
            },
            prefill: {
              contact: currentUser?.phone || '',
            },
            theme: {
              color: "#2563eb",
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        }
      }
    } catch (err) {
      console.error('Error initiating subscription:', err);
      alert(err.message || 'Failed to initiate checkout. Please try again.');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleCompleteMockPayment = async () => {
    if (!mockPaymentData) return;
    setIsPaymentLoading(true);
    try {
      const verifyRes = await apiRequest('/payment/verify-payment', {
        method: 'POST',
        body: JSON.stringify({
          razorpayPaymentId: `mock_pay_${Date.now()}`,
          razorpayOrderId: mockPaymentData.orderId,
          razorpaySignature: "mock_signature",
          planId: mockPaymentData.planId,
        }),
      });

      if (verifyRes.status === 'success') {
        const updatedUser = await authService.getProfile();
        setCurrentUser(updatedUser);
        setShowMockModal(false);
        setMockPaymentData(null);
        setSuccessPlanName(mockPaymentData.planName);
        setShowSuccessModal(true);
      } else {
        alert(verifyRes.message || 'Mock verification failed.');
      }
    } catch (err) {
      console.error('Mock verification error:', err);
      alert(err.message || 'Error during simulated payment verification.');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const renderBillingView = () => {
    const currentPlanId = currentUser?.plan || 'free';
    const isSubscribed = currentUser?.subscriptionStatus === 'active';

    return (
      <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
        {/* Header banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 glass border border-white/10 rounded-3xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Billing & Subscription</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
              Manage Subscription Plan
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
              Upgrade your profile capabilities, unlock analytics, and manage digital integrations.
            </p>
          </div>
          <div>
            <button
              onClick={() => { window.location.hash = '#dashboard'; }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white text-sm font-bold transition-all cursor-pointer shadow-md"
            >
              &larr; Back to Dashboard
            </button>
          </div>
        </div>

        {/* Current Plan Overview Card */}
        <div className="p-6 md:p-8 glass border border-white/5 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-500/5 to-transparent blur-2xl pointer-events-none" />
          <h3 className="text-base font-bold text-white mb-4">Subscription Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Current Account Plan</span>
              <span className="text-lg font-extrabold text-white mt-1 block uppercase tracking-tight">
                {currentPlanId === 'free' ? 'Free Plan' : currentPlanId.replace('_', ' ')}
              </span>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Subscription Status</span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border mt-2 ${
                isSubscribed 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isSubscribed ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {isSubscribed ? 'Active' : 'Inactive / Expired'}
              </span>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Valid Until</span>
              <span className="text-sm font-bold text-slate-300 mt-1.5 block">
                {isSubscribed && currentUser?.subscriptionExpiresAt 
                  ? formatDate(currentUser.subscriptionExpiresAt) 
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Selection Tiers */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Available Subscriptions (₹1 special promo)
          </h2>
          <p className="text-slate-400 text-sm">
            Activate premium layout features, catalog uploads, and rich profile metrics instantly.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`text-xs font-bold ${billingPeriod === 'monthly' ? 'text-white' : 'text-slate-500'} transition-colors`}>
              Billed Monthly
            </span>
            <div 
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 rounded-full bg-white/5 border border-white/10 p-0.5 cursor-pointer relative flex items-center"
            >
              <div 
                className="w-5 h-5 rounded-full bg-blue-500 absolute transition-all duration-300"
                style={{
                  left: billingPeriod === 'monthly' ? '2px' : 'calc(100% - 22px)'
                }}
              />
            </div>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${billingPeriod === 'yearly' ? 'text-white' : 'text-slate-500'} transition-colors`}>
              Billed Annually
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {pricingPlans.map((plan) => {
            const planKey = `${plan.id}_${billingPeriod}`;
            const isActivePlan = currentPlanId === planKey && isSubscribed;
            const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            
            return (
              <div
                key={plan.id}
                className={`group relative rounded-3xl p-8 bg-slate-900/40 border ${
                  isActivePlan 
                    ? 'border-emerald-500/50 shadow-glass-glow' 
                    : plan.id === 'pro' 
                      ? 'border-blue-500/30' 
                      : 'border-white/5 hover:border-white/10'
                } transition-all duration-300 flex flex-col justify-between overflow-hidden`}
              >
                <div className={`absolute -inset-px rounded-3xl bg-gradient-to-tr ${plan.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-white">{plan.name}</span>
                    {isActivePlan ? (
                      <span className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-[9px] font-extrabold uppercase tracking-widest">
                        Current Plan
                      </span>
                    ) : plan.id === 'pro' ? (
                      <span className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] font-extrabold uppercase tracking-widest">
                        Most Popular
                      </span>
                    ) : null}
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-1.5 mb-6 border-b border-white/5 pb-6">
                    <span className="text-4xl font-extrabold text-white tracking-tight">
                      ₹{price}
                    </span>
                    <span className="text-slate-500 text-xs font-semibold">
                      / {billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-xs text-slate-300 leading-normal">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={isActivePlan || isPaymentLoading}
                  onClick={() => handleUpgrade(planKey)}
                  className={`w-full py-3 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    isActivePlan 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-default' 
                      : plan.id === 'pro'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white border-transparent'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  {isPaymentLoading ? 'Processing...' : isActivePlan ? 'Active Subscribed' : 'Upgrade to Plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Profile Theme Selection State
  const [profileLogo, setProfileLogo] = useState(''); // Base64 or URL
  const [headerColor, setHeaderColor] = useState('gradient');

  // QR Generator States
  const [qrUrl, setQrUrl] = useState('https://oneqr.co/user/profile');
  const [qrColor, setQrColor] = useState('000000'); 
  const [qrGeneratedUrl, setQrGeneratedUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Digital Profile Builder States (Cleared Default Values)
  const [profileName, setProfileName] = useState('');
  const [profileTitle, setProfileTitle] = useState('');
  const [profileCompany, setProfileCompany] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileWebsite, setProfileWebsite] = useState('');
  const [profileAddress, setProfileAddress] = useState('');

  // Social Links States (Cleared Default Values)
  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialGoogle, setSocialGoogle] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialYoutube, setSocialYoutube] = useState('');
  const [socialLinkedin, setSocialLinkedin] = useState('');
  const [socialX, setSocialX] = useState('');
  const [socialWhatsapp, setSocialWhatsapp] = useState('');
  const [socialUPI, setSocialUPI] = useState('');
  const [socialOrder, setSocialOrder] = useState(['whatsapp', 'upi', 'facebook', 'instagram', 'youtube', 'linkedin', 'google', 'x']);

  // Dynamic Custom Links States (Cleared Default Values)
  const [customLinks, setCustomLinks] = useState([]);

  // Documents / Catalog Uploads States (Cleared Default Values)
  const [profileDocuments, setProfileDocuments] = useState([]);

  // Mobile responsive layout check state
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const getAlphabeticalLogo = (name) => {
    if (!name) return '';
    const cleanName = name.trim();
    if (!cleanName) return '';
    const words = cleanName.split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return cleanName.slice(0, 2).toUpperCase();
  };

  // Load current user details and fetch profile
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      
      const fetchProfile = async () => {
        try {
          const response = await apiRequest('/profile', { method: 'GET' });
          if (response.status === 'success' && response.data?.profile) {
            const profile = response.data.profile;
            setProfileLogo(profile.profileLogo || '');
            setHeaderColor(profile.headerColor || 'gradient');
            setQrUrl(profile.qrUrl || 'https://oneqr.co/user/profile');
            setQrColor(profile.qrColor || '000000');
            setProfileCompany(profile.profileCompany || '');
            setProfileName(profile.profileName || '');
            setProfileTitle(profile.profileTitle || '');
            setProfileAddress(profile.profileAddress || '');
            setProfileBio(profile.profileBio || '');
            setProfileEmail(profile.profileEmail || '');
            setProfilePhone(profile.profilePhone || profile.phone || '');
            setProfileWebsite(profile.profileWebsite || '');
            setSocialFacebook(profile.socialFacebook || '');
            setSocialGoogle(profile.socialGoogle || '');
            setSocialInstagram(profile.socialInstagram || '');
            setSocialYoutube(profile.socialYoutube || '');
            setSocialLinkedin(profile.socialLinkedin || '');
            setSocialX(profile.socialX || '');
            setSocialWhatsapp(profile.socialWhatsapp || '');
            setSocialUPI(profile.socialUPI || '');
            if (profile.socialOrder && profile.socialOrder.length > 0) {
              setSocialOrder(profile.socialOrder);
            }
            setCustomLinks(profile.customLinks || []);
            setProfileDocuments(profile.profileDocuments || []);
          }
        } catch (err) {
          console.error('Error fetching profile from server:', err);
        }
      };
      
      fetchProfile();
    }
  }, []);

  // Listen to hash changes to sync subView
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash;
      const user = authService.getCurrentUser() || currentUser;
      const isSubscribed = user?.subscriptionStatus === 'active';

      if (hash === '#manage-qr') {
        if (!isSubscribed) {
          window.location.hash = '#billing';
          setSubView('billing');
        } else {
          setSubView('manage-qr');
        }
      } else if (hash === '#billing') {
        setSubView('billing');
      } else if (hash === '#dashboard' || hash === '#overview') {
        setSubView('overview');
      }
    };

    window.addEventListener('hashchange', handleHashSync);
    // Sync initially
    handleHashSync();

    return () => window.removeEventListener('hashchange', handleHashSync);
  }, [currentUser]);

  // Trigger pending plan auto-upgrades when navigating to billing view
  useEffect(() => {
    if (subView === 'billing' && currentUser) {
      const pendingPlan = localStorage.getItem('pending_plan_checkout');
      if (pendingPlan) {
        localStorage.removeItem('pending_plan_checkout');
        handleUpgrade(pendingPlan);
      }
    }
  }, [subView, currentUser]);

  // Scroll to top instantly on subView changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [subView]);

  // Update QR Code URL
  useEffect(() => {
    const cleanColor = qrColor.replace('#', '');
    const encodedUrl = encodeURIComponent(qrUrl);
    setQrGeneratedUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=${cleanColor}&data=${encodedUrl}`);
  }, [qrUrl, qrColor]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadQr = async () => {
    try {
      const response = await fetch(qrGeneratedUrl);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `oneqr_code_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.open(qrGeneratedUrl, '_blank');
    }
  };

  // Custom Links actions
  const addCustomLink = () => {
    setCustomLinks([...customLinks, { id: Date.now(), label: '', url: '' }]);
  };

  const removeCustomLink = (id) => {
    setCustomLinks(customLinks.filter(link => link.id !== id));
  };

  const updateCustomLink = (id, field, value) => {
    setCustomLinks(customLinks.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  // Documents/Images actions
  const addDocument = () => {
    setProfileDocuments([...profileDocuments, { id: Date.now(), label: '', filename: 'No file chosen', size: '' }]);
  };

  const removeDocument = (id) => {
    setProfileDocuments(profileDocuments.filter(doc => doc.id !== id));
  };

  const updateDocument = (id, field, value) => {
    setProfileDocuments(profileDocuments.map(doc => doc.id === id ? { ...doc, [field]: value } : doc));
  };

  // Form actions
  const handleClearProfileForm = () => {
    setProfileName('');
    setProfileTitle('');
    setProfileCompany('');
    setProfileBio('');
    setProfileEmail('');
    setProfilePhone('');
    setProfileWebsite('');
    setProfileAddress('');
    setSocialFacebook('');
    setSocialGoogle('');
    setSocialInstagram('');
    setSocialYoutube('');
    setSocialLinkedin('');
    setSocialX('');
    setSocialWhatsapp('');
    setSocialUPI('');
    setSocialOrder(['whatsapp', 'upi', 'facebook', 'instagram', 'youtube', 'linkedin', 'google', 'x']);
    setCustomLinks([]);
    setProfileDocuments([]);
    setHeaderColor('gradient');
  };

  const handleSaveProfileForm = async () => {
    setIsSaving(true);
    try {
      // 1. Upload any new files to Cloudinary first
      const updatedDocs = [...profileDocuments];
      for (let i = 0; i < updatedDocs.length; i++) {
        const doc = updatedDocs[i];
        if (doc.file) {
          const formData = new FormData();
          formData.append('file', doc.file);

          const token = localStorage.getItem('oneqr_token');
          const headers = {};
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const uploadRes = await fetch('http://localhost:5000/api/profile/upload', {
            method: 'POST',
            headers,
            body: formData,
          });

          if (!uploadRes.ok) {
            throw new Error(`Failed to upload file "${doc.filename}". Please try again.`);
          }

          const uploadData = await uploadRes.json();
          if (uploadData.status === 'success') {
            updatedDocs[i] = {
              id: doc.id,
              label: doc.label,
              filename: doc.filename,
              size: doc.size,
              url: uploadData.data.url,
              publicId: uploadData.data.publicId,
            };
          }
        }
      }

      // Update state with newly uploaded Cloudinary URLs
      setProfileDocuments(updatedDocs);

      // 2. Build payload to save in MongoDB
      const payload = {
        profileLogo,
        qrUrl,
        qrColor,
        headerColor,
        profileCompany,
        profileName,
        profileTitle,
        profileAddress,
        profileBio,
        profileEmail,
        profilePhone,
        profileWebsite,
        socialFacebook,
        socialGoogle,
        socialInstagram,
        socialYoutube,
        socialLinkedin,
        socialX,
        socialWhatsapp,
        socialUPI,
        socialOrder,
        profileDocuments: updatedDocs.map((d) => ({
          id: d.id,
          label: d.label,
          filename: d.filename,
          size: d.size,
          url: d.url || '',
          publicId: d.publicId || '',
        })),
      };

      // 3. Save to MongoDB
      await apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Error saving profile settings:', err);
      alert(err.message || 'Error occurred while saving profile settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Themes Configuration (Solid Light Mode)
  const activeTheme = {
    bg: 'bg-white text-slate-900',
    text: 'text-slate-900',
    border: 'border-slate-200 shadow-sm',
    avatar: 'bg-slate-100 text-slate-800',
    tag: 'bg-slate-100 border-slate-200 text-slate-800',
    buttonBg: 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 shadow-sm',
    bodyCard: 'bg-white border border-slate-200 shadow-xl text-slate-900',
    headerText: 'text-slate-950 font-black',
    subText: 'text-slate-500',
    itemBg: 'bg-slate-50 border border-slate-200 hover:bg-slate-100',
    labelBg: 'bg-slate-100 text-slate-700',
    footerText: 'text-slate-500',
    signatureText: 'text-slate-900 font-extrabold',
    bioColor: 'text-slate-700',
    detailLabel: 'text-slate-800',
    detailVal: 'text-slate-500'
  };

  const handleLaunchMobileDemo = () => {
    const companyName = profileCompany || profileName || "demo-profile";
    const companySlug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const demoData = {
      profileCompany,
      profileName,
      profileTitle,
      profileAddress,
      profileBio,
      profileEmail,
      profilePhone,
      profileWebsite,
      socialFacebook,
      socialGoogle,
      socialInstagram,
      socialYoutube,
      socialLinkedin,
      socialX,
      socialWhatsapp,
      socialUPI,
      socialOrder,
      headerColor,
      customLinks: customLinks.filter(link => link.label && link.url),
      profileDocuments: profileDocuments.filter(doc => doc.filename && (doc.file || doc.url)).map(d => ({
        id: d.id,
        label: d.label,
        filename: d.filename,
        size: d.size,
        url: d.url || (d.file ? URL.createObjectURL(d.file) : '')
      }))
    };

    sessionStorage.setItem('oneqr_demo_profile_data', JSON.stringify(demoData));
    sessionStorage.setItem('oneqr_demo_authorized', 'true');

    // Launch beautiful standalone demo page in new tab
    window.open('/' + companySlug, '_blank');
  };


  // Mock telemetry data
  const stats = [
    { name: 'Total QR Scans', value: '1,842', change: '+24% this week', color: 'text-blue-500' },
    { name: 'Unique Visitors', value: '1,280', change: '+18% this week', color: 'text-cyan-400' },
    { name: 'vCard Downloads', value: '492', change: '+32% this week', color: 'text-indigo-400' },
    { name: 'Engagement Rate', value: '82.4%', change: '+5.3% this week', color: 'text-emerald-400' }
  ];

  const devices = [
    { name: 'Executive Matte Black Card', type: 'NFC Card', status: 'Active', id: 'NFC-9842-A' },
    { name: 'HQ Reception Standee', type: 'Tabletop Standee', status: 'Active', id: 'QR-5542-C' },
  ];

  return (
    <div className="min-h-screen bg-[#030712] pt-28 pb-16 px-4 md:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[10%] left-[-10vw] w-[40vw] h-[40vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10vw] w-[35vw] h-[35vw] rounded-full bg-indigo-600/5 blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {subView === 'overview' && (
          <>
            {/* Welcome Top Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 glass border border-white/10 rounded-3xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Workspace Dashboard</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
                  Welcome back!
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                  Monitor scans, check connected hardware devices, and manage your dynamic OneQR profiles.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Connected to OneQR DB
                </span>
              </div>
            </div>

            {/* Core Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.name} className="p-6 glass border border-white/5 hover:border-white/10 rounded-2xl transition-all shadow-glass flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{stat.name}</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white mt-2 block tracking-tight">{stat.value}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium mt-3 block">
                    <strong className={stat.color}>{stat.change}</strong>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Main Work Area based on subView */}
        {subView === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Manage QR Option (Large, Beautiful, Premium Card) - Span 7 */}
            <div className="lg:col-span-7 p-8 glass border border-white/10 rounded-3xl relative overflow-hidden flex flex-col justify-between group hover:border-blue-500/30 transition-all duration-300">
              {/* Background gradient lights */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl pointer-events-none transition-all duration-500 group-hover:from-blue-600/20" />
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                    <QrCode className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Manage Dynamic QR & Profile</h3>
                    <p className="text-slate-400 text-xs mt-1">Configure your destination links and digital business card themes.</p>
                  </div>
                </div>

                <div className="h-px bg-white/5" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Live QR Redirection</span>
                    <p className="text-xs text-slate-300">Update the landing URL at any time without changing or re-printing the QR code.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">{"NFC / Digital Profile"}</span>
                    <p className="text-xs text-slate-300">Build an elegant responsive micro-website for networking, social channels, and lead capture.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Responsive Simulator</span>
                    <p className="text-xs text-slate-300">Preview changes in real-time inside the interactive visual mobile phone simulator.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Harmonious Themes</span>
                    <p className="text-xs text-slate-300">Switch styles instantly with pre-curated color systems like Midnight, Sunset, and Cyber.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                  No code required
                </span>
                {currentUser?.subscriptionStatus === 'active' ? (
                  <button
                    onClick={() => { window.location.hash = '#manage-qr'; }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all border border-white/10 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Manage QR & Profile</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => { window.location.hash = '#billing'; }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold text-sm hover:from-amber-500 hover:to-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all border border-white/10 flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/10"
                  >
                    <span>Unlock with a Premium Plan</span>
                    <ArrowUpRight className="w-4 h-4 animate-pulse" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column (NFC Cards & Standees) - Span 5 */}
            <div className="lg:col-span-5 p-8 glass border border-white/5 rounded-3xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">NFC Cards & Standees</h3>
                  <span className="text-[10px] text-slate-400">Manage connected physical accessories</span>
                </div>
              </div>

              <div className="space-y-4">
                {devices.map((dev) => (
                  <div key={dev.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:border-white/10 transition-colors">
                    <div>
                      <span className="text-xs font-bold text-white block">{dev.name}</span>
                      <span className="text-[9px] font-bold text-slate-500 block uppercase tracking-wider mt-1">{dev.type} ({dev.id})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[9px] font-bold text-emerald-400">
                      {dev.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : subView === 'billing' ? (
          renderBillingView()
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Configuration Forms (col-span-8 / col-span-12) */}
            <div className={`${isMobileView ? 'lg:col-span-12 w-full' : 'lg:col-span-8'} space-y-8`}>
              
              {/* 1. Digital Profile Builder */}
            <div className="p-6 md:p-8 glass border border-white/5 rounded-3xl space-y-6">
              
              {/* Header & Theme Selection */}
              <div className="pb-6 border-b border-white/5 space-y-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Digital Profile Builder</h3>
                      <span className="text-xs text-slate-400">Select active themes and enter contact info</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { window.location.hash = '#dashboard'; }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white text-sm font-bold transition-all cursor-pointer shadow-md"
                  >
                    &larr; Back to Dashboard
                  </button>
                </div>

                  </div>

                  {/* Core Profile Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* 1. Business / Company */}
                    {/* 0. Business Logo */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Business Logo</label>
                      <div className="flex items-center gap-4">
                        {profileLogo ? (
                          <div className="relative w-16 h-16 rounded-xl border border-white/10 overflow-hidden bg-white/5">
                            <img src={profileLogo} alt="Logo" className="w-full h-full object-contain" />
                            <button 
                              onClick={() => setProfileLogo('')}
                              className="absolute top-1 right-1 bg-red-500 rounded-full p-1 shadow-md hover:bg-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        ) : profileCompany ? (
                          <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white font-bold tracking-wider flex items-center justify-center text-sm select-none border border-white/10">
                            {getAlphabeticalLogo(profileCompany)}
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center">
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Logo</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const reader = new FileReader();
                              reader.onload = (event) => setProfileLogo(event.target.result);
                              reader.readAsDataURL(e.target.files[0]);
                            }
                          }}
                          className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Header Color Picker */}
                    <div className="space-y-3 md:col-span-2 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Header Banner Color</label>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 bg-[#0a0f1d] px-3 py-1.5 rounded-xl border border-white/10">
                          <input 
                            type="color" 
                            value={headerColor && headerColor.startsWith('#') ? headerColor : '#4f46e5'}
                            onChange={(e) => setHeaderColor(e.target.value)}
                            className="w-8 h-8 rounded-lg border border-white/10 bg-transparent cursor-pointer p-0"
                          />
                          <span className="text-[11px] text-slate-300 font-mono uppercase">
                            {headerColor === 'gradient' ? 'Default Gradient' : headerColor}
                          </span>
                        </div>
                        
                        <div className="flex gap-2 flex-wrap items-center">
                          <button
                            type="button"
                            onClick={() => setHeaderColor('gradient')}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                              headerColor === 'gradient'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-white/20 text-white shadow-lg'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            Default Gradient
                          </button>
                          
                          {/* Presets */}
                          {['#4f46e5', '#0ea5e9', '#10b981', '#ef4444', '#f59e0b', '#ec4899', '#1f2937'].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setHeaderColor(color)}
                              style={{ backgroundColor: color }}
                              className={`w-6 h-6 rounded-full border border-white/15 transition-all ${
                                headerColor === color ? 'scale-115 ring-2 ring-blue-500 ring-offset-2 ring-offset-[#030712]' : 'hover:scale-105'
                              }`}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 1. Business / Company */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Business / Company Name</label>
                      <input 
                        type="text"
                        value={profileCompany}
                        onChange={(e) => setProfileCompany(e.target.value)}
                        placeholder="Enter business / company name"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                      />
                    </div>

                    {/* 3. Short Description */}
                    <div className="space-y-2 md:col-span-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Short Description</label>
                        <span className="text-xs font-semibold text-slate-500">
                          Letters written: {profileBio ? profileBio.length : 0} characters
                        </span>
                      </div>
                      <textarea 
                        value={profileBio}
                        onChange={(e) => setProfileBio(e.target.value)}
                        rows={3}
                        placeholder="Enter short description..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40 resize-y leading-normal"
                      />
                    </div>

                    {/* 4. Physical Address */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Physical Address</label>
                      <textarea 
                        value={profileAddress}
                        onChange={(e) => setProfileAddress(e.target.value)}
                        rows={2}
                        placeholder="Enter physical address"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40 resize-none leading-relaxed"
                      />
                    </div>

                    {/* Email, Phone, and Website URL in 1 line on Webview (Desktop) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:col-span-2">
                      {/* 7. Email Address */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="email"
                            value={profileEmail}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            placeholder="Enter email address"
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                          />
                        </div>
                      </div>

                      {/* 8. Phone Number */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="tel"
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            placeholder="Enter phone number"
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                          />
                        </div>
                      </div>

                      {/* Website URL */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Website URL</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="url"
                            value={profileWebsite}
                            onChange={(e) => setProfileWebsite(e.target.value)}
                            placeholder="Enter website URL"
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Networks Form Links */}
                    <div className="space-y-4 md:col-span-2 pt-4 border-t border-white/5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Connect & Payment Links</label>
                      <p className="text-[10px] text-slate-500 mb-2">Drag and drop to reorder the items.</p>
                      <Reorder.Group 
                        axis="y" 
                        values={socialOrder} 
                        onReorder={setSocialOrder} 
                        className="space-y-3"
                      >
                        {socialOrder.map((key) => {
                          const platforms = {
                            facebook: { icon: FaFacebook, color: 'text-blue-500', label: 'Facebook', placeholder: 'e.g. https://facebook.com/yourusername', value: socialFacebook, setter: setSocialFacebook },
                            google: { imgSrc: '/assets/google_review.png', label: 'Google Review', placeholder: 'e.g. https://g.page/r/yourplace/review', value: socialGoogle, setter: setSocialGoogle },
                            instagram: { icon: FaInstagram, color: 'text-pink-500', label: 'Instagram', placeholder: 'e.g. https://instagram.com/yourusername', value: socialInstagram, setter: setSocialInstagram },
                            youtube: { icon: FaYoutube, color: 'text-rose-500', label: 'YouTube', placeholder: 'e.g. https://youtube.com/@yourchannel', value: socialYoutube, setter: setSocialYoutube },
                            linkedin: { icon: FaLinkedin, color: 'text-blue-400', label: 'LinkedIn', placeholder: 'e.g. https://linkedin.com/in/yourusername', value: socialLinkedin, setter: setSocialLinkedin },
                            x: { icon: FaTwitter, color: 'text-black', label: 'X (Twitter)', placeholder: 'e.g. https://x.com/yourusername', value: socialX, setter: setSocialX },
                            whatsapp: { icon: FaWhatsapp, color: 'text-green-500', label: 'WhatsApp', placeholder: 'e.g. https://wa.me/yournumber', value: socialWhatsapp, setter: setSocialWhatsapp },
                            upi: { imgSrc: '/assets/upi.png', label: 'UPI Link', placeholder: 'e.g. upi://pay?pa=yourvpa@upi', value: socialUPI, setter: setSocialUPI },
                          };
                          const platform = platforms[key];
                          if (!platform) return null;
                          const Icon = platform.icon;

                          return (
                            <Reorder.Item 
                              key={key} 
                              value={key} 
                              className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors"
                            >
                              <div className="shrink-0 flex flex-col items-center gap-1 w-6">
                                <div className="flex flex-col gap-0.5 opacity-50">
                                  <div className="w-4 h-0.5 bg-slate-500 rounded-full"></div>
                                  <div className="w-4 h-0.5 bg-slate-500 rounded-full"></div>
                                  <div className="w-4 h-0.5 bg-slate-500 rounded-full"></div>
                                </div>
                              </div>
                              <div className="shrink-0">
                                {platform.imgSrc ? (
                                  <img src={platform.imgSrc} alt={platform.label} className="w-5 h-5 object-contain" />
                                ) : (
                                  <Icon className={`w-5 h-5 ${platform.color}`} />
                                )}
                              </div>
                              <div className="flex-grow space-y-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">{platform.label}</span>
                                <input 
                                  type="url" 
                                  value={platform.value} 
                                  onChange={(e) => platform.setter(e.target.value)}
                                  placeholder={platform.placeholder} 
                                  className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-slate-600"
                                />
                              </div>
                            </Reorder.Item>
                          );
                        })}
                      </Reorder.Group>
                    </div>

                    {/* Dynamic Customized Links Creator */}
                    <div className="space-y-4 md:col-span-2 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Custom Links (Dynamic Panels)</label>
                        <button
                          type="button"
                          onClick={addCustomLink}
                          className="px-2.5 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          Add Custom Link
                        </button>
                      </div>

                      <div className="space-y-3">
                        {customLinks.map((link) => (
                          <div key={link.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center gap-3 relative group">
                            
                            {/* Remove Link Button */}
                            <button
                              type="button"
                              onClick={() => removeCustomLink(link.id)}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 flex items-center justify-center text-xs transition-all shadow-lg cursor-pointer z-10"
                              title="Remove custom link"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>

                            <div className="w-full sm:w-[40%] space-y-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Button Label</span>
                              <input 
                                type="text"
                                value={link.label}
                                onChange={(e) => updateCustomLink(link.id, 'label', e.target.value)}
                                placeholder="Enter button label"
                                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                              />
                            </div>

                            <div className="w-full sm:w-[60%] space-y-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Destination URL</span>
                              <input 
                                type="url"
                                value={link.url}
                                onChange={(e) => updateCustomLink(link.id, 'url', e.target.value)}
                                placeholder="Enter destination URL"
                                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Documents, Menus & Images Catalog Uploader */}
                    <div className="space-y-4 md:col-span-2 pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Product Catalogs, Menus & Images</label>
                          <span className="text-xs text-slate-500">Upload PDF menus, price lists, brochures, or store images</span>
                        </div>
                        <button
                          type="button"
                          onClick={addDocument}
                          className="px-2.5 py-1.5 bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/20 text-cyan-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          Add Document
                        </button>
                      </div>

                      <div className="space-y-3">
                        {profileDocuments.map((doc) => (
                          <div key={doc.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col md:flex-row items-center gap-4 relative group">
                            
                            {/* Remove Document Button */}
                            <button
                              type="button"
                              onClick={() => removeDocument(doc.id)}
                              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 flex items-center justify-center text-xs transition-all shadow-lg cursor-pointer z-10"
                              title="Remove document"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>

                            {/* File Preview Thumbnail */}
                            <FilePreview doc={doc} />

                            {/* Document Title Label Input */}
                            <div className="w-full md:w-[32%] space-y-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Document Label</span>
                              <input 
                                type="text"
                                value={doc.label}
                                onChange={(e) => updateDocument(doc.id, 'label', e.target.value)}
                                placeholder="Enter document label"
                                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                              />
                            </div>

                            {/* Simulated File Selector Input */}
                            <div className="w-full md:w-[53%] space-y-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload / File Attachment</span>
                              <div className="flex items-center gap-3">
                                <div className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-sm text-slate-400 flex items-center justify-between overflow-hidden">
                                  {doc.url ? (
                                    <a 
                                      href={doc.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="truncate text-blue-400 hover:underline hover:text-blue-300"
                                    >
                                      {doc.filename}
                                    </a>
                                  ) : (
                                    <span className="truncate">{doc.filename}</span>
                                  )}
                                  <span className="text-xs font-bold text-slate-500 shrink-0">({doc.size})</span>
                                </div>
                                <label className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer select-none">
                                  Browse
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        updateDocument(doc.id, 'filename', file.name);
                                        updateDocument(doc.id, 'size', (file.size / (1024 * 1024)).toFixed(2) + ' MB');
                                        updateDocument(doc.id, 'file', file);
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Save and Clear Form Actions */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/5 md:col-span-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleLaunchMobileDemo}
                        className="px-5 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Smartphone className="w-4 h-4" />
                        View Demo
                      </button>
                      <button
                        type="button"
                        onClick={handleClearProfileForm}
                        className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-bold transition-all cursor-pointer"
                      >
                        Clear Form
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProfileForm}
                        disabled={isSaving}
                        className="relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Saving...
                          </>
                        ) : saveSuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Saved Successfully!
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>

                {/* 2. Dynamic QR Code Generator */}
                <div className="p-6 md:p-8 glass border border-white/5 rounded-3xl space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">Dynamic QR Generator</h3>
                        <span className="text-xs text-slate-400">Update destinations and color highlights</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Real-time
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Inputs */}
                    <div className="md:col-span-7 space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Destination URL</label>
                        <div className="relative">
                          <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="url"
                            value={qrUrl}
                            onChange={(e) => setQrUrl(e.target.value)}
                            placeholder="Enter destination URL"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/40"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">QR Code Color</label>
                        <div className="flex items-center gap-3">
                          <input 
                            type="color" 
                            value={`#${qrColor}`}
                            onChange={(e) => setQrColor(e.target.value)}
                            className="w-10 h-10 rounded-xl border border-white/10 bg-transparent cursor-pointer p-0.5"
                          />
                          <div className="flex flex-wrap gap-2">
                            {['000000', '2563eb', '0891b2', '4f46e5', '059669', 'e11d48'].map((col) => (
                              <button
                                key={col}
                                onClick={() => setQrColor(col)}
                                style={{ backgroundColor: `#${col}` }}
                                className={`w-6 h-6 rounded-full border border-white/10 transition-transform ${qrColor === col ? 'scale-110 ring-2 ring-blue-500' : 'hover:scale-105'}`}
                                title={`#${col}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleCopyLink}
                          className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleDownloadQr}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold transition-all flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer hover:from-blue-500 hover:to-indigo-500"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download QR</span>
                        </button>
                      </div>
                    </div>

                    {/* QR Display Preview */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-950/40 border border-white/5 rounded-2xl relative overflow-hidden group">
                      {qrGeneratedUrl ? (
                        <div className="relative p-3 bg-white rounded-2xl shadow-xl">
                          <img 
                            src={qrGeneratedUrl} 
                            alt="Dynamic QR Code" 
                            className="w-32 h-32 select-none"
                          />
                          <div className="absolute inset-0 bg-blue-500/5 rounded-2xl border border-blue-500/10 pointer-events-none" />
                        </div>
                      ) : (
                        <div className="w-32 h-32 bg-white/5 rounded-2xl border border-dashed border-white/10 flex items-center justify-center">
                          <RefreshCw className="w-6 h-6 text-slate-500 animate-spin" />
                        </div>
                      )}
                      <span className="text-xs text-slate-500 font-extrabold uppercase tracking-widest mt-3">Live Active Preview</span>
                    </div>
                  </div>
                </div>
              </div> {/* End of lg:col-span-8 */}

              {/* Right Column: Live Mobile Preview (col-span-4) - sticky */}
              {!isMobileView && (
                <div className="lg:col-span-4 lg:sticky lg:top-28 p-6 md:p-8 glass border border-white/5 rounded-3xl flex flex-col items-center w-full">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6 block">Live Mobile Simulator</span>
                  
                  {/* Phone Body Container with Dynamic Theme Class */}
                  <div className={`relative w-full max-w-[270px] h-[580px] rounded-[40px] border-[10px] border-slate-900 shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 ${activeTheme.bg}`}>
                    
                    {/* Speaker Grill / Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
                      <div className="w-12 h-1 bg-slate-800 rounded-full mb-1" />
                    </div>

                    {/* Live Content Panel */}
                    <div className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar pb-6">

                      {/* Decorative Top Banner */}
                      <div 
                        className={`relative z-0 w-full pt-16 pb-8 shrink-0 shadow-sm border-b border-indigo-400/20 ${
                          !headerColor || headerColor === 'gradient' ? 'bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700' : ''
                        }`}
                        style={headerColor && headerColor !== 'gradient' ? { backgroundColor: headerColor } : {}}
                      >
                      </div>

                      {/* Padded Content Body */}
                      <div className="px-4 flex flex-col flex-1 relative z-10">
                        
                        {/* Profile Logo and Company Name */}
                        <div className="flex flex-col items-center -mt-8 mb-0 relative z-20">
                          {profileLogo ? (
                            <div className="p-1 bg-white rounded-full shadow-md ring-2 ring-white flex items-center justify-center overflow-hidden h-[56px] w-[56px] mb-2">
                              <img src={profileLogo} alt="Logo" className="w-full h-full object-contain" />
                            </div>
                          ) : profileCompany ? (
                            <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white font-bold tracking-wider rounded-full shadow-md ring-2 ring-white flex items-center justify-center h-[56px] w-[56px] mb-2 text-sm select-none">
                              {getAlphabeticalLogo(profileCompany)}
                            </div>
                          ) : null}
                          {profileCompany && (
                            <h1 className="text-[12px] font-extrabold tracking-tight text-slate-900 leading-tight text-center px-2">
                              {profileCompany}
                            </h1>
                          )}
                          {profileBio && (
                            <p className="text-[9px] font-bold text-indigo-500 text-center mt-1 px-3 max-w-[200px]">
                              {profileBio}
                            </p>
                          )}
                        </div>
                        
                      {/* Core Details Grid (Hiding Blank Fields completely) */}
                      <div className="space-y-2.5 mt-2 mb-4 z-10">
                        
                        {/* Multiline Address Container */}
                        {profileAddress && (
                          <div className={`w-full py-2 px-3 rounded-xl flex items-start justify-between gap-2 text-[9px] leading-relaxed ${activeTheme.itemBg}`}>
                            <span className="flex items-start gap-2">
                              <MapPin className={`w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5`} />
                              <span className={`text-left whitespace-pre-line ${activeTheme.detailLabel}`}>{profileAddress}</span>
                            </span>
                            <ArrowUpRight className={`w-3.5 h-3.5 ${activeTheme.subText} opacity-50 shrink-0 mt-0.5`} />
                          </div>
                        )}

                        {(() => {
                          const actionCards = [];
                          if (profilePhone) {
                            actionCards.push({ id: 'call', icon: Phone, color: 'text-green-500', label: 'Call', isButton: false });
                            actionCards.push({ id: 'save', icon: User, color: 'text-indigo-500', label: 'Save', isButton: true });
                          }
                          if (profileEmail) {
                            actionCards.push({ id: 'email', icon: Mail, color: 'text-yellow-500', label: 'Email', isButton: false });
                          }
                          if (profileWebsite) {
                            actionCards.push({ id: 'web', icon: Globe, color: 'text-blue-500', label: 'Web', isButton: false });
                          }

                          if (actionCards.length === 0) return null;

                          return (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {actionCards.map((card, idx) => {
                                const isLastOdd = idx === actionCards.length - 1 && actionCards.length % 2 !== 0;
                                const IconComponent = card.icon;
                                const RightIcon = card.isButton ? Download : ArrowUpRight;
                                
                                return (
                                  <div key={card.id} className={`w-full py-2 px-2.5 rounded-xl flex items-center justify-between text-[9px] font-bold ${activeTheme.itemBg} ${isLastOdd ? 'col-span-2' : ''}`}>
                                    <span className={`flex items-center gap-1.5 ${activeTheme.detailLabel}`}>
                                      <IconComponent className={`w-3 h-3 ${card.color}`} />
                                      {card.label}
                                    </span>
                                    <RightIcon className={`w-3 h-3 ${activeTheme.subText} opacity-50`} />
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Social Buttons Container (Showing only Icon + Label, gating blanks) */}
                      <div className="space-y-2 mb-2 z-10">
                        {(socialFacebook || socialGoogle || socialInstagram || socialYoutube || socialLinkedin || socialX || socialWhatsapp || socialUPI) && (
                          <>
                            <span className={`text-[8px] font-black uppercase tracking-widest block text-left mb-1.5 ${activeTheme.subText}`}>Connect</span>
                            <div className="grid grid-cols-2 gap-2">
                              {socialOrder.map(key => {
                                const platforms = {
                                  facebook: { icon: FaFacebook, color: 'text-blue-500', label: 'Facebook', value: socialFacebook },
                                  google: { imgSrc: '/assets/google_review.png', label: 'Google Review', value: socialGoogle },
                                  instagram: { icon: FaInstagram, color: 'text-pink-500', label: 'Instagram', value: socialInstagram },
                                  youtube: { icon: FaYoutube, color: 'text-rose-500', label: 'YouTube', value: socialYoutube },
                                  linkedin: { icon: FaLinkedin, color: 'text-blue-400', label: 'LinkedIn', value: socialLinkedin },
                                  x: { icon: FaTwitter, color: 'text-black', label: 'X (Twitter)', value: socialX },
                                  whatsapp: { icon: FaWhatsapp, color: 'text-green-500', label: 'WhatsApp', value: socialWhatsapp },
                                  upi: { imgSrc: '/assets/upi.png', label: 'UPI', value: socialUPI },
                                };
                                const p = platforms[key];
                                if (!p || !p.value) return null;
                                const Icon = p.icon;
                                return (
                                  <div key={key} className={`py-1.5 px-2 rounded-xl flex items-center gap-1.5 text-[8px] font-bold ${activeTheme.buttonBg}`}>
                                    {p.imgSrc ? (
                                      <img src={p.imgSrc} alt={p.label} className="w-3 h-3 shrink-0 object-contain" />
                                    ) : (
                                      <Icon className={`w-3 h-3 shrink-0 ${p.color}`} />
                                    )}
                                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">{p.label}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>

                        {/* Dynamic Custom Links List (Gating blanks, showing Icon + Custom Label) */}
                        {customLinks.filter(link => link.label && link.url).length > 0 && (
                          <div className="space-y-2 mt-2 pt-3 border-t border-slate-200">
                            <span className={`text-[8px] font-black uppercase tracking-widest block text-left mb-1.5 ${activeTheme.subText}`}>Additional Links</span>
                            <div className="space-y-1.5">
                              {customLinks.filter(link => link.label && link.url).map((link) => (
                                <div 
                                  key={link.id} 
                                  className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-[9px] font-bold transition-all ${activeTheme.buttonBg}`}
                                >
                                  <span className={`flex items-center gap-1.5 ${activeTheme.detailLabel}`}>
                                    <Link2 className="w-3 h-3 text-blue-400 shrink-0" />
                                    {link.label}
                                  </span>
                                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Documents / Catalogs List */}
                        {profileDocuments.filter(doc => doc.filename && (doc.file || doc.url)).length > 0 && (
                          <div className="space-y-2 mt-4 pt-4 border-t border-slate-200">
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block text-left mb-1.5">Documents & Catalogs</span>
                            <div className="space-y-1.5">
                              {profileDocuments.filter(doc => doc.filename && (doc.file || doc.url)).map((doc) => (
                                <a
                                  key={doc.id}
                                  href={doc.url || '#'}
                                  target={doc.url ? "_blank" : undefined}
                                  rel={doc.url ? "noopener noreferrer" : undefined}
                                  className={`w-full py-2 px-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-[9px] font-bold text-slate-300 transition-all ${doc.url ? 'hover:bg-white/10' : ''} ${activeTheme.buttonBg}`}
                                >
                                  <span className="flex items-center gap-1.5 truncate pr-2">
                                    <Smartphone className="w-3 h-3 text-cyan-400 shrink-0" />
                                    <span className="truncate">{doc.label || doc.filename}</span>
                                  </span>
                                  <ArrowUpRight className="w-3 h-3 text-slate-500 shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Brand Signature */}
                      <div 
                        className={`text-center py-2 mt-auto shrink-0 ${
                          !headerColor || headerColor === 'gradient' ? 'bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700' : ''
                        }`}
                        style={headerColor && headerColor !== 'gradient' ? { backgroundColor: headerColor } : {}}
                      >
                        <span className="text-[8px] font-bold text-white/90 uppercase tracking-widest">
                          Developed By <strong className="text-white font-extrabold">One<span className="text-blue-300">QR</span></strong>
                        </span>
                      </div>

                      </div> {/* End of Padded Content Body */}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
      </div>

      {/* Mock Sandbox Payment Modal Overlay */}
      {showMockModal && mockPaymentData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0b0f19] border border-white/10 rounded-3xl p-6 shadow-2xl relative space-y-6 animate-fade-in"
          >
            {/* Header banner */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-base">Razorpay Payment Sandbox</h4>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Simulation Mode</span>
              </div>
            </div>

            {/* Note text */}
            <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-xs text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong>Notice:</strong> Your Razorpay credentials (<code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code>) are not yet configured in the server's <code>.env</code> file.
              </p>
              <p>
                The gateway has loaded this sandbox modal to allow you to simulate a successful checkout and verify your subscription workflow end-to-end.
              </p>
            </div>

            {/* Invoice summary */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Selected Plan</span>
                <span className="text-white font-bold">{mockPaymentData.planName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Amount to Pay</span>
                <span className="text-white font-extrabold">₹{(mockPaymentData.amount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Order ID</span>
                <span className="text-slate-300 font-mono text-[10px]">{mockPaymentData.orderId}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowMockModal(false); setMockPaymentData(null); }}
                className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                Cancel Transaction
              </button>
              <button
                type="button"
                onClick={handleCompleteMockPayment}
                disabled={isPaymentLoading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold transition-all cursor-pointer hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5"
              >
                {isPaymentLoading ? 'Verifying...' : 'Authorize Payment'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Customized App Theme Premium Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-[#070b19] border border-emerald-500/20 rounded-3xl p-8 shadow-2xl relative text-center space-y-6 overflow-hidden animate-fade-in"
          >
            {/* Background Glows */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />

            {/* Success Pulsing Checkmark Ring */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/5">
              <Check className="w-8 h-8 animate-bounce" />
            </div>

            {/* Copy/Content block */}
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white tracking-tight">Subscription Activated!</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Thank you for upgrading! Your premium dynamic QR features, customized links, and design customizer are now fully unlocked.
              </p>
            </div>

            {/* Plan Details Summary Box */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Activated Plan</span>
                <span className="text-white font-bold">{successPlanName || 'Premium Plan'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Status</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Active (Subscribed)
                </span>
              </div>
            </div>

            {/* Call to Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  window.location.hash = '#manage-qr';
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm transition-all border border-white/10 shadow-lg shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Manage QR & Profile</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
