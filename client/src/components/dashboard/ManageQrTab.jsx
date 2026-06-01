import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Reorder, AnimatePresence, useDragControls } from 'framer-motion';
import { 
  QrCode, Smartphone, Sparkles, Link2, User, UserPlus,
  Mail, Globe, Phone, Download, Check, RefreshCw, 
  MapPin, Plus, Trash2, ArrowUpRight, ChevronDown,
  Clock, Copy, X, Building, CreditCard, Star
} from 'lucide-react';
import { 
  FaFacebook, FaInstagram, FaYoutube, 
  FaLinkedin, FaTwitter, FaGoogle, FaWhatsapp 
} from 'react-icons/fa';
import FilePreview from './FilePreview';
import { downloadFlyer } from '../../utils/flyerDownloader';
import { apiRequest } from '../../services/apiService';

export default function ManageQrTab({
  activeQrId,
  isSaving,
  saveSuccess,
  
  // Profile Data States
  profileLogo, setProfileLogo,
  headerColor, setHeaderColor,
  qrUrl, setQrUrl,
  qrColor, setQrColor,
  profileCompany, setProfileCompany,
  profileName, setProfileName,
  profileTitle, setProfileTitle,
  profileBio, setProfileBio,
  profileEmail, setProfileEmail,
  profilePhone, setProfilePhone,
  profileWebsite, setProfileWebsite,
  profileAddress, setProfileAddress,
  profileMapUrl, setProfileMapUrl,
  profileTimings, setProfileTimings,
  
  // Social States
  socialFacebook, setSocialFacebook,
  socialGoogle, setSocialGoogle,
  socialInstagram, setSocialInstagram,
  socialYoutube, setSocialYoutube,
  socialLinkedin, setSocialLinkedin,
  socialX, setSocialX,
  socialWhatsapp, setSocialWhatsapp,
  socialUPI, setSocialUPI,
  socialOrder, setSocialOrder,
  
  // Custom Lists States
  customLinks, setCustomLinks,
  profileDocuments, setProfileDocuments,

  // Selected Feedbacks States
  selectedFeedbacks, setSelectedFeedbacks,
  profilePlan = 'free',

  // Bank & UPI Details States
  bankUpiId, setBankUpiId,
  bankName, setBankName,
  bankAccountNo, setBankAccountNo,
  bankIfsc, setBankIfsc,
  bankAccountName, setBankAccountName,
  
  // Action Handlers
  handleClearProfileForm,
  handleSaveProfileForm
}) {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState('branding');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
  const [isCopied, setIsCopied] = useState(false);
  const [qrGeneratedUrl, setQrGeneratedUrl] = useState('');
  const logoInputRef = useRef(null);
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [upiModalData, setUpiModalData] = useState({ upiId: '', upiLink: '', payeeName: '' });
  const [copiedUpi, setCopiedUpi] = useState(false);

  const handleUpiClick = (e, upiId) => {
    if (e) e.preventDefault();
    const name = profileCompany || profileName || '';
    const upiLink = upiId.startsWith('upi://') 
      ? upiId 
      : `upi://pay?pa=${upiId}${name ? `&pn=${encodeURIComponent(name)}` : ''}`;
    
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = upiLink;
    } else {
      setUpiModalData({ upiId, upiLink, payeeName: name });
      setUpiModalOpen(true);
    }
  };

  const formatUrl = (url) => {
    if (!url) return '';
    if (url.includes('://') || url.startsWith('mailto:') || url.startsWith('tel:')) return url;
    return `https://${url}`;
  };

  const formatWhatsappUrl = (val) => {
    if (!val) return '';
    if (val.includes('wa.me') || val.includes('whatsapp.com')) return formatUrl(val);
    const clean = val.replace(/[^\d+]/g, '');
    return `https://wa.me/${clean}`;
  };

  // Mobile view resize hook
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update QR Code URL preview
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
      await downloadFlyer(qrUrl, activeQrId || 'code', profileCompany);
    } catch (err) {
      window.open(qrGeneratedUrl, '_blank');
    }
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

  // Custom Links Actions
  const addCustomLink = () => {
    setCustomLinks([...customLinks, { id: Date.now(), label: '', url: '' }]);
  };

  const removeCustomLink = (id) => {
    setCustomLinks(customLinks.filter(link => link.id !== id));
  };

  const updateCustomLink = (id, field, value) => {
    setCustomLinks(customLinks.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  // Documents/Images Actions
  const addDocument = () => {
    setProfileDocuments([...profileDocuments, { id: Date.now(), label: '', filename: 'No file chosen', size: '' }]);
  };

  const removeDocument = (id) => {
    setProfileDocuments(profileDocuments.filter(doc => doc.id !== id));
  };

  const updateDocument = (id, field, value) => {
    setProfileDocuments(profileDocuments.map(doc => doc.id === id ? { ...doc, [field]: value } : doc));
  };

  const handleFileChange = (id, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setProfileDocuments(prev => prev.map(doc => 
        doc.id === id 
          ? { ...doc, file, filename: file.name, size: `${sizeMb} MB` } 
          : doc
      ));
    }
  };

  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const response = await apiRequest('/profile/feedbacks');
        if (response.status === 'success' && response.data?.feedbacks) {
          setAllFeedbacks(response.data.feedbacks);
        }
      } catch (err) {
        console.error('Failed to load feedbacks for customizer:', err);
      } finally {
        setLoadingFeedbacks(false);
      }
    };
    loadFeedbacks();
  }, []);

  const handleToggleFeedback = (feedback) => {
    const isSelected = selectedFeedbacks.some(f => (f._id || f) === feedback._id);
    if (isSelected) {
      setSelectedFeedbacks(selectedFeedbacks.filter(f => (f._id || f) !== feedback._id));
    } else {
      if (selectedFeedbacks.length >= 3) {
        alert("You can select up to 3 feedbacks to showcase on your profile.");
        return;
      }
      setSelectedFeedbacks([...selectedFeedbacks, feedback]);
    }
  };

  // Theme specs for mobile preview
  const activeTheme = {
    bg: 'bg-white text-slate-900',
    text: 'text-slate-900',
    border: 'border-slate-200 shadow-sm',
    avatar: 'bg-slate-100 text-slate-800',
    tag: 'bg-slate-100 border-slate-200 text-slate-800',
    buttonBg: 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 shadow-sm',
    bodyCard: 'bg-white border border-slate-200 shadow-xl text-slate-900',
    headerText: 'text-slate-900 font-black',
    subText: 'text-slate-500',
    itemBg: 'bg-slate-50 border border-slate-200 hover:bg-slate-100',
    labelBg: 'bg-slate-100 text-slate-700',
    footerText: 'text-slate-500',
    signatureText: 'text-slate-900 font-extrabold',
    bioColor: 'text-slate-700',
    detailLabel: 'text-slate-800',
    detailVal: 'text-slate-500'
  };

  const isFormFilled = !!profileCompany?.trim();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration Forms */}
        <div className="lg:col-span-8 w-full space-y-8">
          
          {/* 1. Digital Profile Builder Card */}
          <div className="p-6 md:p-8 glass border border-slate-200 dark:border-white/5 rounded-3xl space-y-6">
            
            {/* Form Header */}
            <div className="pb-6 border-b border-slate-200 dark:border-white/5 space-y-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">Digital Profile Builder</h3>
                      {activeQrId && (
                        <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center gap-1">
                          <QrCode className="w-3.5 h-3.5" />
                          QR: {activeQrId}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Select active themes and enter contact info</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { navigate('/dashboard'); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-bold transition-all cursor-pointer shadow-md"
                >
                  &larr; Back to Dashboard
                </button>
              </div>
            </div>

            {/* Core Profile Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {/* Section 1 Trigger - Mobile only */}
              <div 
                onClick={() => isMobileView && setActiveAccordion(activeAccordion === 'branding' ? null : 'branding')}
                className="md:hidden p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm"
              >
                <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">1. Profile & Branding</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${activeAccordion === 'branding' ? 'rotate-180' : ''}`} />
              </div>

              {/* 1. Business Logo */}
              <div className={`space-y-2 md:col-span-2 ${isMobileView && activeAccordion !== 'branding' ? 'hidden' : 'block'}`}>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Business Logo</label>
                <div className="flex items-center gap-4">
                  {profileLogo ? (
                    <div className="relative w-16 h-16 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-white/5">
                      <img src={profileLogo} alt="Logo" className="w-full h-full object-contain" />
                      <button 
                        type="button"
                        onClick={() => {
                          setProfileLogo('');
                          if (logoInputRef.current) logoInputRef.current.value = '';
                        }}
                        className="absolute top-1 right-1 bg-red-500 rounded-full p-1 shadow-md hover:bg-red-650 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : profileCompany ? (
                    <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white font-bold tracking-wider flex items-center justify-center text-sm select-none border border-slate-200 dark:border-white/10">
                      {getAlphabeticalLogo(profileCompany)}
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Logo</span>
                    </div>
                  )}
                  <input 
                    ref={logoInputRef}
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (event) => setProfileLogo(event.target.result);
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                    className="text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-100 dark:file:bg-white/10 file:text-slate-700 dark:file:text-white hover:file:bg-slate-200 dark:hover:file:bg-white/20 cursor-pointer"
                  />
                </div>
              </div>

              {/* Header Color Picker */}
              <div className={`space-y-3 md:col-span-2 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 ${isMobileView && activeAccordion !== 'branding' ? 'hidden' : 'block'}`}>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Header Banner Color</label>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0a0f1d] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10">
                    <input 
                      type="color" 
                      value={headerColor && headerColor.startsWith('#') ? headerColor : '#2563eb'}
                      onChange={(e) => setHeaderColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 bg-transparent cursor-pointer p-0"
                    />
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 font-mono uppercase">
                      {headerColor && headerColor.startsWith('#') ? headerColor : '#2563eb'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Business/Company Name */}
              <div className={`space-y-2 md:col-span-2 ${isMobileView && activeAccordion !== 'branding' ? 'hidden' : 'block'}`}>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Business / Company Name</label>
                <input 
                  type="text"
                  value={profileCompany}
                  onChange={(e) => setProfileCompany(e.target.value)}
                  placeholder="Enter business / company name"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white dark:focus:bg-slate-900/80 transition-all"
                />
              </div>

              {/* Description */}
              <div className={`space-y-2 md:col-span-2 ${isMobileView && activeAccordion !== 'branding' ? 'hidden' : 'block'}`}>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Short Description</label>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-500">
                    Letters written: {profileBio ? profileBio.length : 0} characters
                  </span>
                </div>
                <textarea 
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  rows={3}
                  placeholder="Enter short description..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white dark:focus:bg-slate-900/80 resize-y leading-normal transition-all"
                />
              </div>

              {/* Physical Address */}
              <div className={`space-y-2 md:col-span-2 ${isMobileView && activeAccordion !== 'branding' ? 'hidden' : 'block'}`}>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Physical Address</label>
                <textarea 
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  rows={2}
                  placeholder="Enter physical address"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white dark:focus:bg-slate-900/80 resize-y leading-relaxed transition-all"
                />
              </div>

              {/* Google Map Link & Timings */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 md:col-span-2 ${isMobileView && activeAccordion !== 'branding' ? 'hidden' : 'grid'}`}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Google Map URL</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 animate-pulse" />
                    <input 
                      type="url"
                      value={profileMapUrl}
                      onChange={(e) => setProfileMapUrl(e.target.value)}
                      placeholder="e.g. https://maps.app.goo.gl/..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white dark:focus:bg-slate-900/80 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Office Timings / Working Hours</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      value={profileTimings}
                      onChange={(e) => setProfileTimings(e.target.value)}
                      placeholder="e.g. Mon - Fri: 9:00 AM - 6:00 PM"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white dark:focus:bg-slate-900/80 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2 Trigger - Mobile only */}
              <div 
                onClick={() => isMobileView && setActiveAccordion(activeAccordion === 'contact' ? null : 'contact')}
                className="md:hidden p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm mt-2"
              >
                <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">2. Contact Channels</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${activeAccordion === 'contact' ? 'rotate-180' : ''}`} />
              </div>

              {/* Email, Phone, and Website URL */}
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 md:col-span-2 ${isMobileView && activeAccordion !== 'contact' ? 'hidden' : 'grid'}`}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white dark:focus:bg-slate-900/80 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900/80 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Website URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="url"
                      value={profileWebsite}
                      onChange={(e) => setProfileWebsite(e.target.value)}
                      placeholder="Enter website URL"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white dark:focus:bg-slate-900/80 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3 Trigger - Mobile only */}
              {/* Section 3 Trigger - Mobile only */}
              <div 
                onClick={() => isMobileView && setActiveAccordion(activeAccordion === 'social' ? null : 'social')}
                className="md:hidden p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm mt-2"
              >
                <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">3. Social & Connect Channels</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${activeAccordion === 'social' ? 'rotate-180' : ''}`} />
              </div>

              {/* Social Links Reorder Section */}
              <div className={`space-y-4 md:col-span-2 pt-4 border-t border-slate-200 dark:border-white/5 ${isMobileView && activeAccordion !== 'social' ? 'hidden' : 'block'}`}>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Social & Connect Channels</label>
                <p className="text-[10px] text-slate-500 dark:text-slate-550 mb-2">Drag and drop to reorder the items.</p>
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
                      whatsapp: { icon: FaWhatsapp, color: 'text-green-500', label: 'WhatsApp', placeholder: 'e.g. WhatsApp Mobile Number (with country code)', value: socialWhatsapp, setter: setSocialWhatsapp },
                      upi: { imgSrc: '/assets/upi.png', label: 'UPI VPA ID', placeholder: 'e.g. yourname@okaxis', value: socialUPI, setter: setSocialUPI },
                    };
                    const platform = platforms[key];
                    if (!platform) return null;

                    const Icon = platform.icon;

                    return (
                      <Reorder.Item 
                        key={key} 
                        value={key} 
                        className="flex items-center gap-2.5 p-2 bg-white dark:bg-[#0c101b]/60 border border-slate-200 dark:border-white/10 rounded-2xl cursor-grab active:cursor-grabbing hover:border-blue-500/30 transition-all relative group"
                      >
                        {/* 1. Drag Handle indicator dots */}
                        <div className="flex flex-col gap-0.5 opacity-30 group-hover:opacity-75 transition-opacity shrink-0 pl-1">
                          <div className="flex gap-0.5">
                            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                          </div>
                          <div className="flex gap-0.5">
                            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                          </div>
                          <div className="flex gap-0.5">
                            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                          </div>
                        </div>

                        {/* 2. Brand Icon Circle Container */}
                        <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-white/5">
                          {platform.imgSrc ? (
                            <img src={platform.imgSrc} alt={platform.label} className="w-4 h-4 object-contain" />
                          ) : (
                            <Icon className={`w-4 h-4 ${platform.color}`} />
                          )}
                        </div>

                        {/* 3. Streamlined Input Field (No label text, just icon & input) */}
                        <div 
                          className="flex-grow"
                          onPointerDown={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <input 
                            type="text" 
                            value={platform.value} 
                            onChange={(e) => platform.setter(e.target.value)}
                            placeholder={platform.placeholder} 
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500/40 focus:bg-white dark:focus:bg-slate-900/80 transition-all"
                          />
                        </div>
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>
              </div>
              {/* Section Bank Trigger - Mobile only */}
              <div 
                onClick={() => isMobileView && setActiveAccordion(activeAccordion === 'bank' ? null : 'bank')}
                className="md:hidden p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm mt-2"
              >
                <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">4. Bank Details</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${activeAccordion === 'bank' ? 'rotate-180' : ''}`} />
              </div>

              {/* Bank Details Section */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 md:col-span-2 pt-4 border-t border-slate-200 dark:border-white/5 ${isMobileView && activeAccordion !== 'bank' ? 'hidden' : 'grid'}`}>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Bank Details</label>
                  <p className="text-[10px] text-slate-500 dark:text-slate-550 mt-1">Provide your bank account details to receive payments directly. Fill only what is needed.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Bank Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white dark:focus:bg-slate-900/80 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Account Holder Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white dark:focus:bg-slate-900/80 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Account Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      value={bankAccountNo}
                      onChange={(e) => setBankAccountNo(e.target.value)}
                      placeholder="e.g. 501001234567"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white dark:focus:bg-slate-900/80 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">IFSC Code</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value)}
                      placeholder="e.g. HDFC0000240"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white dark:focus:bg-slate-900/80 transition-all"
                    />
                  </div>
                </div>
              </div>

              {profilePlan !== 'basic' && profilePlan !== 'free' && (
                <>
                  {/* Section 5 Trigger - Mobile only */}
                  <div 
                    onClick={() => isMobileView && setActiveAccordion(activeAccordion === 'custom' ? null : 'custom')}
                    className="md:hidden p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm mt-2"
                  >
                    <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">5. Custom Panels & Buttons</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${activeAccordion === 'custom' ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dynamic Custom Links Panels */}
                  <div className={`space-y-4 md:col-span-2 pt-4 border-t border-slate-200 dark:border-white/5 ${isMobileView && activeAccordion !== 'custom' ? 'hidden' : 'block'}`}>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Custom Links (Dynamic Panels)</label>
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
                        <div key={link.id} className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col sm:flex-row items-center gap-3 relative group">
                          <button
                            type="button"
                            onClick={() => removeCustomLink(link.id)}
                            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:text-rose-300 hover:bg-rose-500/20 flex items-center justify-center text-xs transition-all shadow-lg cursor-pointer z-10"
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
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500/40"
                            />
                          </div>

                          <div className="w-full sm:w-[60%] space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Destination URL</span>
                            <input 
                              type="url"
                              value={link.url}
                              onChange={(e) => updateCustomLink(link.id, 'url', e.target.value)}
                              placeholder="Enter destination URL"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500/40"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {profilePlan !== 'basic' && profilePlan !== 'free' && (
                <>
                  {/* Section 6 Trigger - Mobile only */}
                  <div 
                    onClick={() => isMobileView && setActiveAccordion(activeAccordion === 'docs' ? null : 'docs')}
                    className="md:hidden p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm mt-2"
                  >
                    <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">6. Catalog Files & PDFs</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${activeAccordion === 'docs' ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Documents & PDF Menu Catalog Uploader */}
                  <div className={`space-y-4 md:col-span-2 pt-6 border-t border-slate-200 dark:border-white/5 ${isMobileView && activeAccordion !== 'docs' ? 'hidden' : 'block'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Product Catalogs, Menus & Images</label>
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
                        <div key={doc.id} className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col md:flex-row items-center gap-4 relative group">
                          <button
                            type="button"
                            onClick={() => removeDocument(doc.id)}
                            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:text-rose-300 hover:bg-rose-500/20 flex items-center justify-center text-xs transition-all shadow-lg cursor-pointer z-10"
                            title="Remove document"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          <FilePreview doc={doc} />

                          <div className="w-full md:w-[32%] space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Document Label</span>
                            <input 
                              type="text"
                              value={doc.label}
                              onChange={(e) => updateDocument(doc.id, 'label', e.target.value)}
                              placeholder="Enter document label"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500/40"
                            />
                          </div>

                          <div className="w-full md:w-[53%] space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Choose File</span>
                            <div className="flex items-center gap-2">
                              <label className="flex-grow flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 cursor-pointer hover:border-slate-300 dark:hover:border-white/20 transition-all text-xs text-slate-500 truncate max-w-[200px] sm:max-w-none">
                                <span className="truncate">{doc.filename}</span>
                                <span className="text-[10px] text-blue-500 font-bold uppercase shrink-0 ml-2">Browse</span>
                                <input 
                                  type="file" 
                                  accept=".pdf,image/*"
                                  onChange={(e) => handleFileChange(doc.id, e)}
                                  className="hidden"
                                />
                              </label>
                              {doc.size && (
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2 py-1 rounded-lg shrink-0">
                                  {doc.size}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {profilePlan !== 'basic' && profilePlan !== 'free' && (
                <>
                  {/* Section 7 Trigger - Mobile only */}
                  <div 
                    onClick={() => isMobileView && setActiveAccordion(activeAccordion === 'feedbacks' ? null : 'feedbacks')}
                    className="md:hidden p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm mt-2"
                  >
                    <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">7. Showcase Client Reviews</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${activeAccordion === 'feedbacks' ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Showcase Client Reviews Section */}
                  <div className={`space-y-4 md:col-span-2 pt-6 border-t border-slate-200 dark:border-white/5 ${isMobileView && activeAccordion !== 'feedbacks' ? 'hidden' : 'block'}`}>
                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Showcase Client Reviews & Testimonials</label>
                      <span className="text-xs text-slate-500">Select up to 3 customer reviews/feedbacks to feature at the bottom of your profile page.</span>
                    </div>

                    {loadingFeedbacks ? (
                      <div className="py-4 text-center text-xs text-slate-500 animate-pulse">Loading feedbacks...</div>
                    ) : allFeedbacks.length === 0 ? (
                      <div className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-center space-y-2">
                        <span className="text-xs font-semibold text-slate-450 dark:text-slate-500 block">No Feedbacks / Reviews Found</span>
                        <p className="text-[11px] text-slate-550 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                          Constructive or positive feedback entered by users when they submit reviews will be stored here, allowing you to select and feature them.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allFeedbacks.map((f) => {
                          const isSelected = selectedFeedbacks.some(selected => (selected._id || selected) === f._id);
                          return (
                            <div 
                              key={f._id}
                              onClick={() => handleToggleFeedback(f)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-sm relative overflow-hidden ${
                                isSelected 
                                  ? 'bg-blue-500/10 border-blue-500 dark:border-blue-400 shadow-blue-500/15 animate-pulse' 
                                  : 'bg-slate-50 dark:bg-[#0c101b]/60 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-0.5 text-amber-500">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-3.5 h-3.5 ${i < f.rating ? 'fill-current' : 'opacity-25'}`} 
                                    />
                                  ))}
                                </div>
                                {isSelected && (
                                  <span className="p-1 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                    <Check className="w-3 h-3" />
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
                                "{f.feedbackText || 'No comment provided.'}"
                              </p>

                              {(f.customerName || f.customerPhone) && (
                                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-450 border-t border-slate-200/50 dark:border-white/5 pt-2 mt-1">
                                  <span className="font-bold truncate max-w-[120px]">
                                    {f.customerName || 'Anonymous Customer'}
                                  </span>
                                  {f.createdAt && (
                                    <span>{new Date(f.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>

            {/* Form Actions Footer Panel */}
            <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClearProfileForm}
                  className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-extrabold transition-all cursor-pointer"
                >
                  Clear Form
                </button>
              </div>

              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveProfileForm}
                className={`px-8 py-3 rounded-2xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  saveSuccess 
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                    : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-blue-500/20'
                }`}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Profile Saved!</span>
                  </>
                ) : (
                  <span>Save Profile Settings</span>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Live Mobile Preview */}
        {!isMobileView && (
          <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start p-6 md:p-8 glass border border-slate-200 dark:border-white/5 rounded-3xl flex flex-col items-center w-full">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6 block">Live Mobile Simulator</span>
            
            {/* Phone Frame */}
            {!isFormFilled ? (
              <div className="w-full flex flex-col items-center justify-center py-20 text-center space-y-4 min-h-[480px] border border-dashed border-slate-300 dark:border-white/10 rounded-[32px] p-6 bg-slate-50/30 dark:bg-white/5 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 dark:text-indigo-450 animate-pulse">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">Preview Unavailable</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-[200px] mx-auto">
                    Start entering your business or personal details in the form to see a live mockup of your dynamic page here!
                  </p>
                </div>
              </div>
            ) : (
              <div className={`relative w-full max-w-[270px] h-[580px] rounded-[40px] border-[10px] border-slate-900 shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 ${activeTheme.bg}`}>
              
              {/* Camera Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-12 h-1 bg-slate-800 rounded-full mb-1" />
              </div>

              {/* Phone Scrollable Body */}
              <div className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar pb-6">
                {/* Header Banner */}
                <div 
                  className={`relative z-0 w-full pt-10 pb-5 shrink-0 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.3)] border-b border-indigo-400/20 ${
                    !headerColor || headerColor === 'gradient' ? 'bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700' : ''
                  }`}
                  style={headerColor && headerColor !== 'gradient' ? { backgroundColor: headerColor } : {}}
                />

                {/* Profile Contents */}
                <div className="px-4 flex flex-col flex-1 relative z-10">
                  {/* Name & Bio block */}
                  <div className="flex flex-col items-center -mt-8 mb-2 relative z-20">
                    {profileLogo ? (
                      <div className="p-1 bg-white rounded-full shadow-md ring-2 ring-white flex items-center justify-center overflow-hidden h-[56px] w-[56px] mb-2">
                        <img src={profileLogo} alt="Logo" className="w-full h-full object-cover scale-[1.18]" />
                      </div>
                    ) : profileCompany ? (
                      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white font-extrabold tracking-wider rounded-full shadow-md ring-2 ring-white flex items-center justify-center h-[56px] w-[56px] mb-2 text-sm select-none">
                        {getAlphabeticalLogo(profileCompany)}
                      </div>
                    ) : null}
                    {profileCompany && (
                      <h1 className="text-[12px] font-extrabold tracking-tight text-slate-900 leading-tight text-center px-2">
                        {profileCompany}
                      </h1>
                    )}
                    {profileBio && (
                      <p className="text-[9px] font-bold text-indigo-500 text-center mt-1 px-3 max-h-[40px] overflow-hidden text-ellipsis line-clamp-2">
                        {profileBio}
                      </p>
                    )}
                  </div>

                  {/* Main contents container - space-y-3 to match actual page's space-y-4 */}
                  <div className="w-full space-y-3">
                    
                    {/* Core Contacts Detail Block */}
                    <div className="space-y-2">
                      {/* Physical Address Card */}
                      {profileAddress && (
                        <div className={`w-full py-2 px-3 rounded-xl flex flex-col gap-2 text-[9px] leading-normal ${activeTheme.itemBg} ${activeTheme.text}`}>
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                            <span className="text-left whitespace-pre-line truncate max-w-[200px]">{profileAddress}</span>
                          </div>
                          <a 
                            href={profileMapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profileAddress)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 text-[8px] font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
                          >
                            <MapPin className="w-2.5 h-2.5" />
                            <span>View on Google Map</span>
                          </a>
                        </div>
                      )}

                      {/* Timings Card */}
                      {profileTimings && (
                        <div className={`w-full py-2 px-3 rounded-xl flex items-center gap-1.5 text-[9px] leading-normal ${activeTheme.itemBg} ${activeTheme.text}`}>
                          <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="text-left font-semibold truncate max-w-[200px]">{profileTimings}</span>
                        </div>
                      )}

                      {/* Quick Action buttons Grid */}
                      {(() => {
                        const actionCards = [];
                        if (profilePhone) {
                          actionCards.push({ id: 'call', icon: Phone, color: 'text-green-500', label: 'Call', href: `tel:${profilePhone}`, target: undefined });
                          actionCards.push({ id: 'save', icon: UserPlus, color: 'text-indigo-500', label: 'Save Contact', href: '#', target: undefined });
                        }
                        if (profileEmail) {
                          actionCards.push({ id: 'email', icon: Mail, color: 'text-yellow-500', label: 'Email', href: `mailto:${profileEmail}`, target: undefined });
                        }
                        if (profileWebsite) {
                          const targetUrl = /^https?:\/\//i.test(profileWebsite) ? profileWebsite : `https://${profileWebsite}`;
                          actionCards.push({ id: 'web', icon: Globe, color: 'text-blue-500', label: 'Website', href: targetUrl, target: '_blank' });
                        }

                        if (actionCards.length === 0) return null;

                        return (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {actionCards.map((card, idx) => {
                              const isLastOdd = idx === actionCards.length - 1 && actionCards.length % 2 !== 0;
                              const IconComponent = card.icon;
                              const RightIcon = card.id === 'save' ? Download : ArrowUpRight;
                              
                              return (
                                <a 
                                  key={card.id} 
                                  href={card.href || '#'}
                                  target={card.target}
                                  rel={card.target ? "noopener noreferrer" : undefined}
                                  className={`w-full py-2 px-2.5 rounded-xl flex items-center justify-between text-[9px] font-bold ${activeTheme.itemBg} ${isLastOdd ? 'col-span-2' : ''} hover:scale-[1.01] transition-transform ${activeTheme.text}`}
                                >
                                  <span className={`flex items-center gap-1.5 truncate pr-1`}>
                                    <IconComponent className={`w-3 h-3 ${card.color} shrink-0`} />
                                    <span className="truncate">{card.label}</span>
                                  </span>
                                  <RightIcon className="w-3 h-3 text-slate-500 opacity-55 shrink-0" />
                                </a>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>

                     {/* Social icons */}
                    {(socialFacebook || socialGoogle || socialInstagram || socialYoutube || socialLinkedin || socialX || socialWhatsapp || socialUPI) && (
                      <div className="space-y-2 mt-2">
                        <span className="text-[8px] font-black uppercase tracking-widest block text-left text-slate-500">Connect</span>
                        <div className="grid grid-cols-2 gap-2">
                          {socialOrder.map(key => {
                            const platforms = {
                              facebook: { icon: FaFacebook, color: 'text-blue-500', label: 'Facebook', value: socialFacebook },
                              google: { icon: Star, color: 'text-[#fbbc05] fill-[#fbbc05]', label: 'Google Review', value: socialGoogle },
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
                              <a 
                                key={key} 
                                href={key === 'upi' ? '#' : (key === 'whatsapp' ? formatWhatsappUrl(p.value) : formatUrl(p.value))}
                                onClick={key === 'upi' ? (e) => handleUpiClick(e, p.value) : undefined}
                                target={key === 'upi' ? undefined : "_blank"}
                                rel={key === 'upi' ? undefined : "noopener noreferrer"}
                                className={`py-1.5 px-2 rounded-xl flex items-center gap-1.5 text-[8px] font-bold ${activeTheme.buttonBg} hover:scale-[1.02] transition-all ${activeTheme.text}`}
                              >
                                {p.imgSrc ? (
                                  <img src={p.imgSrc} alt={p.label} className="w-3 h-3 shrink-0 object-contain" />
                                ) : (
                                  <Icon className={`w-3 h-3 shrink-0 ${p.color}`} />
                                )}{" "}
                                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{p.label}</span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Bank Details Card */}
                    {(bankName || bankAccountNo || bankIfsc || bankAccountName) && (
                      <div className="space-y-2 mt-2">
                        <span className="text-[8px] font-black uppercase tracking-widest block text-left text-slate-500">Bank Details</span>
                        <div className={`p-3 rounded-xl flex flex-col gap-2 text-[8px] font-bold shadow-sm ${activeTheme.buttonBg} ${activeTheme.text}`}>
                          {bankName && (
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="opacity-60 flex items-center gap-1"><Building className="w-3 h-3 text-slate-500 shrink-0" /> Bank</span>
                              <span className="opacity-95 truncate">{bankName}</span>
                            </div>
                          )}
                          {bankAccountName && (
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="opacity-60 flex items-center gap-1"><User className="w-3 h-3 text-slate-500 shrink-0" /> Holder</span>
                              <span className="opacity-95 truncate">{bankAccountName}</span>
                            </div>
                          )}
                          {bankAccountNo && (
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="opacity-60 flex items-center gap-1"><CreditCard className="w-3 h-3 text-slate-500 shrink-0" /> A/C No</span>
                              <span className="opacity-95 truncate">{bankAccountNo}</span>
                            </div>
                          )}
                          {bankIfsc && (
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="opacity-60 flex items-center gap-1"><Globe className="w-3 h-3 text-slate-500 shrink-0" /> IFSC</span>
                              <span className="opacity-95 truncate">{bankIfsc}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Custom Links list */}
                    {customLinks.filter(link => link.label && link.url).length > 0 && (
                      <div className="space-y-2 mt-2 pt-2 border-t border-slate-200">
                        <span className="text-[8px] font-black uppercase tracking-widest block text-left text-slate-500">Additional Links</span>
                        <div className="space-y-1.5">
                          {customLinks.filter(link => link.label && link.url).map((link) => (
                            <a 
                              key={link.id} 
                              href={formatUrl(link.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-[9px] font-bold transition-all ${activeTheme.buttonBg} ${activeTheme.text}`}
                            >
                              <span className={`flex items-center gap-1.5`}>
                                <Link2 className="w-3 h-3 text-blue-400 shrink-0" />
                                {link.label}
                              </span>
                              <ArrowUpRight className="w-3 h-3 text-slate-500" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Documents list */}
                    {profileDocuments.filter(doc => doc.filename && (doc.file || doc.url)).length > 0 && (
                      <div className="space-y-2 mt-2 pt-2 border-t border-slate-200">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block text-left">Documents & Catalogs</span>
                        <div className="grid grid-cols-2 gap-2">
                          {profileDocuments.filter(doc => doc.filename && (doc.file || doc.url)).map((doc) => {
                            const fileUrl = doc.file ? URL.createObjectURL(doc.file) : doc.url;
                            const isImg = doc.file 
                              ? doc.file.type?.startsWith('image/')
                              : /\.(jpe?g|png|gif|webp|svg)$/i.test(doc.url) || /\.(jpe?g|png|gif|webp|svg)/i.test(doc.filename);

                            if (isImg) {
                              return (
                                <a
                                  key={doc.id}
                                  href={fileUrl || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group block relative rounded-xl overflow-hidden border border-slate-200/10 transition-all hover:scale-[1.02] active:scale-95 bg-white/5"
                                >
                                  <div className="aspect-[4/3] w-full bg-slate-100 dark:bg-white/5 relative overflow-hidden">
                                    <img 
                                      src={fileUrl} 
                                      alt={doc.label || doc.filename} 
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2">
                                      <span className="text-white text-[8px] font-extrabold truncate">{doc.label || doc.filename}</span>
                                      <span className="text-white/60 text-[6px] font-medium mt-0.5">Click to view</span>
                                    </div>
                                  </div>
                                </a>
                              );
                            }

                            return (
                              <a
                                key={doc.id}
                                href={fileUrl || '#'}
                                target={fileUrl ? "_blank" : undefined}
                                rel={fileUrl ? "noopener noreferrer" : undefined}
                                className={`col-span-2 w-full py-2 px-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-[9px] font-bold text-slate-350 transition-all ${fileUrl ? 'hover:bg-white/10' : ''} ${activeTheme.buttonBg} ${activeTheme.text}`}
                              >
                                <span className="flex items-center gap-1.5 truncate pr-2">
                                  <Smartphone className="w-3 h-3 text-cyan-400 shrink-0" />
                                  <span className="truncate">{doc.label || doc.filename}</span>
                                </span>
                                <ArrowUpRight className="w-3 h-3 text-slate-500 shrink-0" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {/* Client Reviews Section in Emulator */}
                    {selectedFeedbacks && selectedFeedbacks.filter(Boolean).length > 0 && (
                      <div className="space-y-2 mt-2 pt-2 border-t border-slate-200">
                        <span className="text-[8px] font-black uppercase tracking-widest block text-left text-slate-500">Client Reviews</span>
                        <div className="space-y-2">
                          {selectedFeedbacks.filter(Boolean).map((f) => (
                            <div 
                              key={f._id || Math.random()} 
                              className={`p-2.5 rounded-xl border border-slate-200/40 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex flex-col gap-1 text-[8px] ${activeTheme.text}`}
                            >
                              <div className="flex items-center gap-0.5 text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-2.5 h-2.5 ${i < f.rating ? 'fill-current text-amber-500' : 'opacity-25'}`} 
                                  />
                                ))}
                              </div>
                              <p className="italic text-slate-650 dark:text-slate-350 leading-relaxed text-left text-[8px]">
                                "{f.feedbackText || 'No comment.'}"
                              </p>
                              {f.customerName && (
                                <span className="font-extrabold text-right block text-slate-550 dark:text-slate-400 text-[7px] mt-0.5">
                                  — {f.customerName}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Branded footer in simulator */}
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
              </div>

            </div>
            )}
          </div>
        )}
      </div>

      {/* UPI QR Code Desktop Fallback Modal inside Simulator */}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
