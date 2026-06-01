import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, MapPin, Mail, Phone, Globe, Link2, 
  ArrowUpRight, ShieldAlert, ArrowLeft, UserPlus, Download,
  Copy, X, Check, Clock, Star, RefreshCw
} from 'lucide-react';
import { 
  FaFacebook, FaInstagram, FaYoutube, 
  FaLinkedin, FaTwitter, FaGoogle,
  FaWhatsapp, FaMoneyBillWave
} from 'react-icons/fa';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from '../services/apiService';

export default function DemoProfilePage() {
  const { slug: routeSlug } = useParams();
  const location = useLocation();
  const locationSlug = location.pathname.replace(/^\/|\/$/g, '');
  const slug = routeSlug || locationSlug;

  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [isOwnerPreview, setIsOwnerPreview] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inactive, setInactive] = useState(false);
  const [expired, setExpired] = useState(false);
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [upiModalData, setUpiModalData] = useState({ upiId: '', upiLink: '', payeeName: '' });
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Google Review Feedback Modal States
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [reviewSuggestion, setReviewSuggestion] = useState('');
  const [fetchingSuggestion, setFetchingSuggestion] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);

  const fetchSuggestion = async () => {
    setFetchingSuggestion(true);
    setCopiedReview(false);
    try {
      const res = await apiRequest(`/public/profile/${slug}/review-suggestions`);
      if (res.status === 'success' && res.data?.suggestion) {
        setReviewSuggestion(res.data.suggestion);
      }
    } catch (err) {
      console.error('Error fetching suggestion:', err);
      const companyName = profileData?.profileCompany || profileData?.profileName || 'this business';
      setReviewSuggestion(`Excellent experience overall with ${companyName}. Friendly team, quick service, and top-tier quality!`);
    } finally {
      setFetchingSuggestion(false);
    }
  };

  const handleGoogleReviewClick = (e, googleLink) => {
    if (e) e.preventDefault();
    setGoogleReviewLink(googleLink);
    setSelectedRating(0);
    setHoveredRating(0);
    setFeedbackText('');
    setFeedbackSubmitted(false);
    setReviewSuggestion('');
    setCopiedReview(false);
    setReviewModalOpen(true);
  };

  const handleSelectRating = (rating) => {
    setSelectedRating(rating);
    setCopiedReview(false);
    if (rating === 4 || rating === 5) {
      fetchSuggestion();
    }
  };

  const handleCopyAndRedirect = async () => {
    try {
      await navigator.clipboard.writeText(reviewSuggestion);
      setCopiedReview(true);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
    
    const formattedLink = formatUrl(googleReviewLink);
    window.open(formattedLink, '_blank');
    
    setTimeout(() => {
      setReviewModalOpen(false);
    }, 800);
  };

  const handleSubmitFeedback = async (e) => {
    if (e) e.preventDefault();
    if (selectedRating === 0) return;
    setIsSubmittingFeedback(true);
    try {
      await apiRequest(`/public/profile/${slug}/feedback`, {
        method: 'POST',
        body: JSON.stringify({
          rating: selectedRating,
          feedbackText,
        }),
      });
      setFeedbackSubmitted(true);
      setTimeout(() => {
        setReviewModalOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // UPI Simulation & Helper States
  const [mobileConfirmOpen, setMobileConfirmOpen] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorStep, setSimulatorStep] = useState('amount'); // 'amount' | 'paying' | 'success'
  const [simulatorAmount, setSimulatorAmount] = useState('100');
  const [simulatorNote, setSimulatorNote] = useState('Payment for Services');
  const [simulatorTxId, setSimulatorTxId] = useState('');
  const [simulatorTime, setSimulatorTime] = useState('');

  const handleUpiClick = (e, upiId) => {
    if (e) e.preventDefault();
    const name = profileData?.profileCompany || profileData?.profileName || '';
    const upiLink = upiId.startsWith('upi://') 
      ? upiId 
      : `upi://pay?pa=${upiId}${name ? `&pn=${encodeURIComponent(name)}` : ''}`;
    
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isTestUpi = upiId.toLowerCase().includes('test') || 
                      upiId.toLowerCase().includes('mock') || 
                      upiId.toLowerCase().includes('example') || 
                      window.location.hostname === 'localhost';

    if (isMobile) {
      if (isTestUpi) {
        setUpiModalData({ upiId, upiLink, payeeName: name });
        setMobileConfirmOpen(true);
      } else {
        window.location.href = upiLink;
      }
    } else {
      setUpiModalData({ upiId, upiLink, payeeName: name });
      setUpiModalOpen(true);
    }
  };

  useEffect(() => {
    // 1. Verify if this session is authorized to view the demo
    const isAuth = sessionStorage.getItem('oneqr_demo_authorized') === 'true';
    const rawData = sessionStorage.getItem('oneqr_demo_profile_data');

    if (isAuth && rawData) {
      try {
        setProfileData(JSON.parse(rawData));
        setAuthorized(true);
        setIsOwnerPreview(true);
      } catch (err) {
        console.error('Failed to parse demo profile data:', err);
      }
      setLoading(false);
    } else {
      // 2. Attempt to fetch public profile using slug from URL
      if (slug && slug !== 'index.html') {
        apiRequest(`/public/profile/${slug}`)
          .then(res => {
            if (res.status === 'redirect' && res.slug) {
              navigate('/' + res.slug, { replace: true });
              return;
            }
            if (res.status === 'inactive') {
              setInactive(true);
            } else if (res.status === 'expired') {
              setExpired(true);
            } else if (res.status === 'success' && res.data?.profile) {
              const profile = res.data.profile;
              setProfileData(profile);
              setAuthorized(true);
            }
            setLoading(false);
          })
          .catch(err => {
            console.error('Failed to fetch public profile:', err);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [slug, navigate]);

  const handleReturnToBuilder = () => {
    navigate('/manage-qr');
  };

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

  const formatUrl = (url) => {
    if (!url) return '';
    if (url.includes('://') || url.startsWith('mailto:') || url.startsWith('tel:')) return url;
    return `https://${url}`;
  };

  const handleSaveContact = () => {
    if (!profileData) return;
    
    const name = profileData.profileName || profileData.profileCompany || 'Contact';
    let vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\n`;
    
    if (profileData.profileCompany) vCardData += `ORG:${profileData.profileCompany}\n`;
    if (profileData.profileTitle) vCardData += `TITLE:${profileData.profileTitle}\n`;
    if (profileData.profilePhone) vCardData += `TEL;TYPE=CELL:${profileData.profilePhone}\n`;
    if (profileData.profileEmail) vCardData += `EMAIL;TYPE=WORK:${profileData.profileEmail}\n`;
    if (profileData.profileWebsite) vCardData += `URL:${formatUrl(profileData.profileWebsite)}\n`;
    
    if (profileData.profileAddress) {
      const formattedAddress = profileData.profileAddress.replace(/\n/g, ' ');
      vCardData += `ADR;TYPE=WORK:;;${formattedAddress};;;;\n`;
    }
    
    vCardData += `END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${name.replace(/\s+/g, '_')}_Contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (inactive) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Glows */}
        <div className="absolute top-[20%] left-[-10vw] w-[45vw] h-[45vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10vw] w-[45vw] h-[45vw] rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-full max-w-md p-8 glass border border-white/10 rounded-3xl text-center space-y-6 relative z-10 backdrop-blur-xl bg-slate-950/40"
        >
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 text-[#2563eb] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/10">
            <Smartphone className="w-8 h-8 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              QR Code Not Activated
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              This dynamic QR code has not been claimed or activated by any user yet.
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-left text-xs text-slate-400 space-y-2 leading-normal">
            <strong className="text-slate-300 block">Are you the owner?</strong>
            <p className="text-slate-400">
              Please log in to your OneQR dashboard and use the **Claim / Scan QR** feature to activate this QR code and link it to your digital business card.
            </p>
          </div>

          <button
            onClick={() => { window.location.href = '/'; }}
            className="w-full py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to OneQR Home</span>
          </button>
        </motion.div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Glows */}
        <div className="absolute top-[20%] left-[-10vw] w-[45vw] h-[45vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10vw] w-[45vw] h-[45vw] rounded-full bg-cyan-600/5 blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-full max-w-md p-8 glass border border-white/10 rounded-3xl text-center space-y-6 relative z-10 backdrop-blur-xl bg-slate-950/40"
        >
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-[#ef4444] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Subscription Expired
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              This QR Code's premium subscription is expired or inactive.
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-left text-xs text-slate-400 space-y-2 leading-normal">
            <strong className="text-slate-300 block">Are you the owner?</strong>
            <p className="text-slate-400">
              Please log in to your OneQR dashboard and renew your subscription in the **Billing** tab to reactivate this page.
            </p>
          </div>

          <button
            onClick={() => { window.location.href = '/'; }}
            className="w-full py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to OneQR Home</span>
          </button>
        </motion.div>
      </div>
    );
  }

  // Profile Not Found / Access Denied view (for invalid slugs or deactivated profiles)
  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Glows */}
        <div className="absolute top-[20%] left-[-10vw] w-[40vw] h-[40vw] rounded-full bg-rose-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10vw] w-[40vw] h-[40vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-full max-w-md p-8 glass border border-white/10 rounded-3xl text-center space-y-6 relative z-10 backdrop-blur-xl bg-slate-950/40"
        >
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Profile Not Found
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              The requested profile does not exist, has expired, or is inactive.
            </p>
          </div>

          <button
            onClick={() => { window.location.href = '/'; }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to OneQR Home</span>
          </button>
        </motion.div>
      </div>
    );
  }

  const profileLogo = profileData.profileLogo || '';
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
    ownerHeader: 'bg-slate-50 border-b border-slate-200 text-slate-800 shadow-sm',
    footerText: 'text-slate-500',
    signatureText: 'text-slate-900 font-extrabold',
    bioColor: 'text-slate-700',
    detailLabel: 'text-slate-800',
    detailVal: 'text-slate-500'
  };

  const isDemoMode = new URLSearchParams(window.location.search).get('demo') === 'true';

  const profileContent = (
    <>
      {/* Floating Demo Control Header (Owner only preview assist) */}
      {isOwnerPreview && (
        <div className={`sticky top-0 z-30 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors ${activeTheme.ownerHeader}`}>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Owner Demo Live Preview</span>
          </div>
          <button
            onClick={handleReturnToBuilder}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md select-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Builder</span>
          </button>
        </div>
      )}

      {/* Decorative Top Banner */}
      <div 
        className={`relative z-0 w-full pt-32 pb-16 shrink-0 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.3)] border-b border-indigo-400/20 ${
          !profileData?.headerColor || profileData.headerColor === 'gradient' ? 'bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700' : ''
        }`}
        style={profileData?.headerColor && profileData.headerColor !== 'gradient' ? { backgroundColor: profileData.headerColor } : {}}
      >
      </div>

      {/* Standalone Business Card Container */}
      <main className="flex-grow w-full max-w-xl mx-auto px-6 relative z-10 flex flex-col pb-6">
        
        {/* Profile Logo and Company Name (Half inside, half outside banner) */}
        <div className="flex flex-col items-center -mt-16 mb-2 relative z-20">
          {profileLogo ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="p-1.5 bg-white rounded-full shadow-lg ring-4 ring-white flex items-center justify-center overflow-hidden h-[104px] w-[104px] mb-4"
            >
              <img src={profileLogo} alt="Logo" className="w-full h-full object-contain" />
            </motion.div>
          ) : profileData.profileCompany ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white font-extrabold tracking-wider rounded-full shadow-lg ring-4 ring-white flex items-center justify-center h-[104px] w-[104px] mb-4 text-3xl select-none"
            >
              {getAlphabeticalLogo(profileData.profileCompany)}
            </motion.div>
          ) : null}
          {profileData.profileCompany && (
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 leading-tight text-center px-4">
              {profileData.profileCompany}
            </h1>
          )}
          {profileData.profileBio && (
            <p className="text-sm sm:text-[15px] font-bold text-indigo-500 text-center mt-2 px-6 max-w-md">
              {profileData.profileBio}
            </p>
          )}
        </div>

        <div className="w-full space-y-4">
          
          {/* Core Contacts Detail Block */}
          <div className="space-y-3.5">
            {/* Physical Address */}
            {profileData.profileAddress && (
              <div className={`w-full py-4 px-5 rounded-2xl flex flex-col gap-3.5 text-sm leading-relaxed ${activeTheme.itemBg} ${activeTheme.text}`}>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-left whitespace-pre-line">{profileData.profileAddress}</span>
                </div>
                <a 
                  href={profileData.profileMapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profileData.profileAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-[1.01] shadow-md"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View on Google Map</span>
                </a>
              </div>
            )}

            {/* Office Timings */}
            {profileData.profileTimings && (
              <div className={`w-full py-4 px-5 rounded-2xl flex items-center gap-3.5 text-sm leading-relaxed ${activeTheme.itemBg} ${activeTheme.text}`}>
                <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-left font-semibold">{profileData.profileTimings}</span>
              </div>
            )}

            {/* Action Grid (Call, Save, Email, Web) */}
            {(() => {
              const actionCards = [];
              if (profileData.profilePhone) {
                actionCards.push({ id: 'call', type: 'link', href: `tel:${profileData.profilePhone}`, icon: Phone, iconColor: 'text-green-500', label: profileData.profilePhone });
                actionCards.push({ id: 'save', type: 'button', onClick: handleSaveContact, icon: UserPlus, iconColor: 'text-indigo-500', label: 'Save Contact' });
              }
              if (profileData.profileEmail) {
                actionCards.push({ id: 'email', type: 'link', href: `mailto:${profileData.profileEmail}`, icon: Mail, iconColor: 'text-yellow-500', label: profileData.profileEmail });
              }
              if (profileData.profileWebsite) {
                actionCards.push({ id: 'web', type: 'link', href: formatUrl(profileData.profileWebsite), target: '_blank', icon: Globe, iconColor: 'text-blue-500', label: profileData.profileWebsite });
              }

              if (actionCards.length === 0) return null;

              return (
                <div className="grid grid-cols-2 gap-3.5">
                  {actionCards.map((card, idx) => {
                    const isLastOdd = idx === actionCards.length - 1 && actionCards.length % 2 !== 0;
                    const IconComponent = card.icon;
                    const RightIcon = card.type === 'button' ? Download : ArrowUpRight;
                    
                    const commonClasses = `w-full py-4 px-4 rounded-2xl flex items-center justify-between text-sm font-semibold transition-all hover:scale-[1.01] ${activeTheme.itemBg} ${activeTheme.text} ${isLastOdd ? 'col-span-2' : ''}`;

                    if (card.type === 'button') {
                      return (
                        <button key={card.id} onClick={card.onClick} className={`${commonClasses} active:scale-95`}>
                          <span className="flex items-center gap-2.5 truncate">
                            <IconComponent className={`w-5 h-5 ${card.iconColor} shrink-0`} />
                            <span className="truncate">{card.label}</span>
                          </span>
                          <RightIcon className={`w-4 h-4 ${activeTheme.subText} opacity-50 shrink-0`} />
                        </button>
                      );
                    }

                    return (
                      <a key={card.id} href={card.href} target={card.target} rel={card.target ? "noopener noreferrer" : undefined} className={commonClasses}>
                        <span className="flex items-center gap-2.5 truncate">
                          <IconComponent className={`w-5 h-5 ${card.iconColor} shrink-0`} />
                          <span className="truncate">{card.label}</span>
                        </span>
                        <RightIcon className={`w-4 h-4 ${activeTheme.subText} opacity-50 shrink-0`} />
                      </a>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Social Channels Block */}
          {(profileData.socialFacebook || profileData.socialGoogle || profileData.socialInstagram || profileData.socialYoutube || profileData.socialLinkedin || profileData.socialX || profileData.socialWhatsapp || profileData.socialUPI) && (
            <div className="space-y-3.5">
              <span className={`text-xs font-black uppercase tracking-widest block text-left ${activeTheme.subText}`}>Connect</span>
              <div className="grid grid-cols-2 gap-3.5">
                {(profileData.socialOrder || ['whatsapp', 'upi', 'facebook', 'google', 'instagram', 'youtube', 'linkedin', 'x']).map(key => {
                  const platforms = {
                    facebook: { icon: FaFacebook, color: 'text-blue-500', label: 'Facebook', value: profileData.socialFacebook },
                    google: { imgSrc: '/assets/google_review.png', label: 'Google Review', value: profileData.socialGoogle },
                    instagram: { icon: FaInstagram, color: 'text-pink-500', label: 'Instagram', value: profileData.socialInstagram },
                    youtube: { icon: FaYoutube, color: 'text-rose-500', label: 'YouTube', value: profileData.socialYoutube },
                    linkedin: { icon: FaLinkedin, color: 'text-blue-400', label: 'LinkedIn', value: profileData.socialLinkedin },
                    x: { icon: FaTwitter, color: 'text-black', label: 'X (Twitter)', value: profileData.socialX },
                    whatsapp: { icon: FaWhatsapp, color: 'text-green-500', label: 'WhatsApp', value: profileData.socialWhatsapp },
                    upi: { imgSrc: '/assets/upi.png', label: 'UPI', value: profileData.socialUPI },
                  };
                  const p = platforms[key];
                  if (!p || !p.value) return null;
                  const Icon = p.icon;
                  return (
                    <a 
                      key={key}
                      href={key === 'upi' || key === 'google' ? '#' : formatUrl(p.value)}
                      onClick={(e) => {
                        if (key === 'upi') {
                          handleUpiClick(e, p.value);
                        } else if (key === 'google') {
                          handleGoogleReviewClick(e, p.value);
                        }
                      }}
                      target={key === 'upi' || key === 'google' ? undefined : "_blank"}
                      rel={key === 'upi' || key === 'google' ? undefined : "noopener noreferrer"}
                      className={`py-3 px-4 rounded-2xl flex items-center gap-2.5 text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all ${activeTheme.buttonBg} ${activeTheme.text}`}
                    >
                      {p.imgSrc ? (
                        <img src={p.imgSrc} alt={p.label} className="w-5 h-5 object-contain" />
                      ) : (
                        <Icon className={`w-5 h-5 ${p.color}`} />
                      )}
                      <span>{p.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dynamic Custom Links List */}
          {profileData.customLinks && profileData.customLinks.filter(link => link.label && link.url).length > 0 && (
            <div className="space-y-3.5 pt-2 border-t border-white/10">
              <span className={`text-xs font-black uppercase tracking-widest block text-left ${activeTheme.subText}`}>Additional Links</span>
              <div className="space-y-3">
                {profileData.customLinks.filter(link => link.label && link.url).map((link) => (
                  <a 
                    key={link.id} 
                    href={formatUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 px-5 rounded-2xl flex items-center justify-between text-sm font-bold transition-all hover:scale-[1.01] ${activeTheme.buttonBg} ${activeTheme.text}`}
                  >
                    <span className="flex items-center gap-3">
                      <Link2 className="w-5 h-5 text-blue-400" />
                      {link.label}
                    </span>
                    <ArrowUpRight className={`w-5 h-5 ${activeTheme.subText}`} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Documents / Catalogs List */}
          {profileData.profileDocuments && profileData.profileDocuments.filter(doc => doc.filename && (doc.file || doc.url)).length > 0 && (
            <div className="space-y-3.5 pt-1 border-t border-white/10">
              <span className={`text-xs font-black uppercase tracking-widest block text-left ${activeTheme.subText}`}>Documents & Catalogs</span>
              <div className="grid grid-cols-2 gap-3.5">
                {profileData.profileDocuments.filter(doc => doc.filename && doc.url).map((doc) => {
                  const isImg = /\.(jpe?g|png|gif|webp|svg)$/i.test(doc.url) || /\.(jpe?g|png|gif|webp|svg)/i.test(doc.filename);

                  if (isImg) {
                    return (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block relative rounded-2xl overflow-hidden border border-slate-200/10 transition-all hover:scale-[1.02] active:scale-95 bg-white/5"
                      >
                        <div className="aspect-[4/3] w-full bg-slate-150 dark:bg-white/5 relative overflow-hidden">
                          <img 
                            src={doc.url} 
                            alt={doc.label || doc.filename} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                            <span className="text-white text-xs font-extrabold truncate">{doc.label || doc.filename}</span>
                            <span className="text-white/60 text-[9px] font-medium mt-0.5">Click to view</span>
                          </div>
                        </div>
                      </a>
                    );
                  }

                  return (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`col-span-2 w-full py-4 px-5 rounded-2xl flex items-center justify-between text-sm font-bold transition-all hover:scale-[1.01] ${activeTheme.buttonBg} ${activeTheme.text}`}
                    >
                      <span className="flex items-center gap-3 truncate pr-2">
                        <Smartphone className="w-5 h-5 text-cyan-400 shrink-0" />
                        <span className="truncate">{doc.label || doc.filename}</span>
                      </span>
                      <ArrowUpRight className={`w-5 h-5 ${activeTheme.subText} shrink-0`} />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Signature Footer */}
      <footer 
        className={`text-center py-3 mt-6 relative z-10 shrink-0 ${
          !profileData?.headerColor || profileData.headerColor === 'gradient' ? 'bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700' : ''
        }`}
        style={profileData?.headerColor && profileData.headerColor !== 'gradient' ? { backgroundColor: profileData.headerColor } : {}}
      >
        <span className="text-xs font-extrabold text-white/90 uppercase tracking-widest">
          Developed By <strong className="text-white font-extrabold">One<span className="text-blue-300">QR</span></strong>
        </span>
      </footer>
    </>
  );

  return (
    <div className={`min-h-screen ${activeTheme.bg} flex flex-col justify-between relative overflow-hidden selection:bg-indigo-500/20 selection:text-indigo-400`}>
      <div className="flex-grow flex flex-col relative">
        {profileContent}
      </div>

      {/* Google Review Filtering Modal */}
      <AnimatePresence>
        {reviewModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl relative space-y-6 text-center text-slate-900 dark:text-white"
            >
              {/* Close Button */}
              <button 
                onClick={() => setReviewModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-655 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Google Brand Header */}
              <div className="flex flex-col items-center gap-2 pt-2">
                <div className="flex items-center justify-center p-2 bg-slate-50/10 dark:bg-white/5 rounded-full border border-slate-100/50 dark:border-white/5">
                  <svg viewBox="0 0 24 24" width="28" height="28" className="w-7 h-7">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                <h3 className="font-extrabold text-lg tracking-tight text-slate-800 dark:text-slate-100">Google Review</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal max-w-[220px]">
                  Share your experience about <span className="font-bold text-slate-700 dark:text-slate-200">{profileData?.profileCompany || 'our business'}</span>
                </p>
              </div>

              {!feedbackSubmitted ? (
                <div className="space-y-6">
                  {/* Star selection widget (Always visible) */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex justify-center items-center gap-2.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleSelectRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="p-0.5 hover:scale-115 active:scale-90 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-9 h-9 ${
                              star <= (hoveredRating || selectedRating)
                                ? 'text-[#fbbc05] fill-[#fbbc05]'
                                : 'text-slate-200 dark:text-slate-700'
                            } transition-colors duration-150`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic sub-views based on selectedRating */}
                  {selectedRating === 0 && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium py-4">
                      Please tap a star above to rate us.
                    </p>
                  )}

                  {selectedRating >= 4 && (
                    <motion.div 
                      key="suggestion-view"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 text-left"
                    >
                      <div className="relative p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl flex items-start gap-3 min-h-[90px] pr-10">
                        <div className="flex-grow">
                          {fetchingSuggestion ? (
                            <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                              <div className="w-4 h-4 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
                              <span>Generating suggestion...</span>
                            </div>
                          ) : (
                            <p className="text-slate-700 dark:text-slate-300 text-xs font-semibold leading-relaxed italic">
                              "{reviewSuggestion}"
                            </p>
                          )}
                        </div>
                        
                        {/* Shuffle button (No text, icon only) */}
                        <button
                          type="button"
                          disabled={fetchingSuggestion}
                          onClick={fetchSuggestion}
                          className="absolute right-2 top-2 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-500 dark:text-slate-300 hover:text-slate-700 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center border border-transparent shadow-sm"
                          title="Change Suggestion"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${fetchingSuggestion ? 'animate-spin' : ''}`} />
                        </button>
                      </div>

                      <button
                        type="button"
                        disabled={fetchingSuggestion}
                        onClick={handleCopyAndRedirect}
                        className="w-full py-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer select-none disabled:opacity-50 text-center"
                      >
                        {copiedReview ? 'Copied Review!' : 'Copy Review & Redirect'}
                      </button>
                    </motion.div>
                  )}

                  {selectedRating > 0 && selectedRating <= 3 && (
                    <motion.form 
                      key="feedback-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleSubmitFeedback}
                      className="space-y-4 text-left"
                    >
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                          Tell us how we can improve
                        </label>
                        <textarea
                          required
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="What went wrong? We value your honest feedback..."
                          rows={3}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] focus:outline-none text-xs text-slate-900 dark:text-white transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingFeedback}
                        className="w-full py-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs shadow-md shadow-blue-500/10 hover:shadow-lg transition-all cursor-pointer uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed text-center"
                      >
                        {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                      </button>
                    </motion.form>
                  )}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 py-4 text-center"
                >
                  <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Feedback Submitted</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Thank you for your constructive comments. We appreciate your input!
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* UPI QR Code Desktop Fallback Modal */}
      <AnimatePresence>
        {upiModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl relative space-y-6 text-center text-slate-900 dark:text-white"
            >
              <button 
                onClick={() => { setUpiModalOpen(false); setCopiedUpi(false); }}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5 pt-2">
                <h3 className="font-extrabold text-lg tracking-tight">Scan to Pay with UPI</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {upiModalData.payeeName ? `Paying: ${upiModalData.payeeName}` : 'Scan the QR code with any UPI app on your phone.'}
                </p>
              </div>

              <div className="flex justify-center p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiModalData.upiLink)}`} 
                  alt="UPI Payment QR Code" 
                  className="w-44 h-44 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-left">UPI ID / VPA</span>
                <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                  <span className="font-mono text-sm truncate font-medium">{upiModalData.upiId}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(upiModalData.upiId);
                      setCopiedUpi(true);
                      setTimeout(() => setCopiedUpi(false), 2000);
                    }}
                    className="p-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 dark:text-blue-400 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Test Mode Simulator trigger in Modal */}
              {(upiModalData.upiId.toLowerCase().includes('test') || 
                upiModalData.upiId.toLowerCase().includes('mock') || 
                upiModalData.upiId.toLowerCase().includes('example') || 
                window.location.hostname === 'localhost') && (
                <button
                  type="button"
                  onClick={() => {
                    setUpiModalOpen(false);
                    setSimulatorAmount('100');
                    setSimulatorNote('Payment for Services');
                    setSimulatorStep('amount');
                    setShowSimulator(true);
                  }}
                  className="w-full py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold text-xs transition-colors cursor-pointer border border-amber-500/20 flex items-center justify-center gap-2 mt-4"
                >
                  <FaMoneyBillWave className="w-3.5 h-3.5" />
                  <span>Simulate Mock Payment</span>
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Test Mode Warning Dialog */}
      {mobileConfirmOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 text-center text-slate-900 dark:text-white animate-scaleUp"
          >
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-lg tracking-tight">Test Mode P2P UPI</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You are scanning or selecting a test UPI ID (<strong>{upiModalData.upiId}</strong>). 
                Real banking apps like GPay or PhonePe will fail with an invalid UPI error.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileConfirmOpen(false);
                  setSimulatorAmount('100');
                  setSimulatorNote('Payment for Services');
                  setSimulatorStep('amount');
                  setShowSimulator(true);
                }}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                Simulate Mock Payment
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileConfirmOpen(false);
                  window.location.href = upiModalData.upiLink;
                }}
                className="w-full py-3 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 font-bold text-xs transition-colors cursor-pointer"
              >
                Proceed to UPI App Anyway
              </button>
              <button
                type="button"
                onClick={() => setMobileConfirmOpen(false)}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-650 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mock UPI Payment Simulator Overlay */}
      {showSimulator && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white dark:bg-[#070b13] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl relative space-y-6 text-slate-900 dark:text-white"
          >
            {simulatorStep !== 'paying' && (
              <button 
                onClick={() => setShowSimulator(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-650 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Step 1: Amount Selection */}
            {simulatorStep === 'amount' && (
              <div className="space-y-6 pt-2">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FaMoneyBillWave className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base tracking-tight">UPI Payment Simulator</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Paying <span className="font-bold text-slate-800 dark:text-slate-200">{upiModalData.payeeName || 'Business Profile'}</span>
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 truncate max-w-[250px] mx-auto">
                    VPA: {upiModalData.upiId}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-lg">₹</span>
                      <input
                        type="number"
                        value={simulatorAmount}
                        onChange={(e) => setSimulatorAmount(e.target.value)}
                        placeholder="Enter Amount"
                        className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none font-bold text-lg text-slate-900 dark:text-white"
                        min="1"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {['10', '100', '500', '1000'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSimulatorAmount(val)}
                          className="py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 text-xs text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-white/10 rounded-lg transition-colors font-bold cursor-pointer"
                        >
                          ₹{val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Remarks / Note</label>
                    <input
                      type="text"
                      value={simulatorNote}
                      onChange={(e) => setSimulatorNote(e.target.value)}
                      placeholder="What is this for?"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:border-blue-500 focus:outline-none text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!simulatorAmount || parseFloat(simulatorAmount) <= 0) return;
                    setSimulatorStep('paying');
                    setTimeout(() => {
                      setSimulatorTxId(`TXN${Math.floor(100000000000 + Math.random() * 900000000000)}`);
                      setSimulatorTime(new Date().toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                      }));
                      setSimulatorStep('success');
                    }, 2500);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-500/25 transition-all cursor-pointer uppercase tracking-wider"
                >
                  Pay Securely ₹{parseFloat(simulatorAmount || '0').toFixed(2)}
                </button>
              </div>
            )}

            {/* Step 2: Processing Payment */}
            {simulatorStep === 'paying' && (
              <div className="text-center py-8 space-y-6">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 border-4 border-slate-100 dark:border-white/5 rounded-full" />
                  <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                    <Clock className="w-8 h-8 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-base tracking-tight">Processing Payment</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Verifying transaction with UPI gateway...
                  </p>
                  <p className="text-[10px] text-slate-400 italic">
                    Do not refresh or close this screen.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Success Screen */}
            {simulatorStep === 'success' && (
              <div className="space-y-6 pt-2 text-center animate-scaleUp">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto relative">
                  <Check className="w-8 h-8" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Transaction Success
                  </span>
                  <h3 className="font-black text-2xl tracking-tight pt-2 text-slate-900 dark:text-white">
                    ₹{parseFloat(simulatorAmount || '0').toFixed(2)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Paid to: <span className="font-bold text-slate-800 dark:text-slate-200">{upiModalData.payeeName || 'Business Profile'}</span>
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl text-left text-xs space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">VPA Payee</span>
                    <span className="font-mono text-slate-700 dark:text-slate-350">{upiModalData.upiId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transaction ID</span>
                    <span className="font-mono text-slate-700 dark:text-slate-350">{simulatorTxId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time & Date</span>
                    <span className="text-slate-700 dark:text-slate-350 font-medium">{simulatorTime}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/50 dark:border-white/5 pt-2">
                    <span className="text-slate-400">Payment Note</span>
                    <span className="text-slate-700 dark:text-slate-350 font-bold truncate max-w-[150px]">{simulatorNote}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSimulator(false)}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors cursor-pointer uppercase tracking-wider shadow-md shadow-emerald-500/25"
                >
                  Done & Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
