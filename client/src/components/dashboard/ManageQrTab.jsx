import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Reorder } from 'framer-motion';
import { 
  QrCode, Smartphone, Sparkles, Link2, User, 
  Mail, Globe, Phone, Download, Check, RefreshCw, 
  MapPin, Plus, Trash2, ArrowUpRight, ChevronDown 
} from 'lucide-react';
import { 
  FaFacebook, FaInstagram, FaYoutube, 
  FaLinkedin, FaTwitter, FaGoogle, FaWhatsapp 
} from 'react-icons/fa';
import FilePreview from './FilePreview';
import { downloadFlyer } from '../../utils/flyerDownloader';

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
  
  // Action Handlers
  handleClearProfileForm,
  handleSaveProfileForm,
  handleLaunchMobileDemo
}) {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState('branding');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
  const [mobileActiveTab, setMobileActiveTab] = useState('edit');
  const [isCopied, setIsCopied] = useState(false);
  const [qrGeneratedUrl, setQrGeneratedUrl] = useState('');

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
      await downloadFlyer(qrUrl, activeQrId || 'code');
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
      updateDocument(id, 'file', file);
      updateDocument(id, 'filename', file.name);
      updateDocument(id, 'size', `${sizeMb} MB`);
    }
  };

  // Theme specs for mobile preview
  const activeTheme = {
    bg: 'bg-white text-slate-900',
    text: 'text-slate-900',
    border: 'border-slate-200 shadow-sm',
    avatar: 'bg-slate-100 text-slate-800',
    tag: 'bg-slate-100 border-slate-200 text-slate-800',
    buttonBg: 'bg-white border border-slate-200 hover:bg-slate-550 text-slate-800 shadow-sm',
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mobile Tabs Switcher */}
      {isMobileView && (
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner">
          <button
            type="button"
            onClick={() => setMobileActiveTab('edit')}
            className={`flex-1 py-2.5 text-center text-sm font-bold rounded-xl transition-all cursor-pointer ${
              mobileActiveTab === 'edit'
                ? 'bg-white dark:bg-slate-900 text-blue-650 dark:text-blue-400 shadow-md border border-slate-200/50 dark:border-white/5'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Edit Profile
          </button>
          <button
            type="button"
            onClick={() => setMobileActiveTab('preview')}
            className={`flex-1 py-2.5 text-center text-sm font-bold rounded-xl transition-all cursor-pointer ${
              mobileActiveTab === 'preview'
                ? 'bg-white dark:bg-slate-900 text-blue-650 dark:text-blue-400 shadow-md border border-slate-200/50 dark:border-white/5'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Live Preview
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration Forms */}
        <div className={`${isMobileView ? (mobileActiveTab === 'edit' ? 'block w-full' : 'hidden') : 'lg:col-span-8'} space-y-8`}>
          
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
                        onClick={() => setProfileLogo('')}
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
                      value={headerColor && headerColor.startsWith('#') ? headerColor : '#4f46e5'}
                      onChange={(e) => setHeaderColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 bg-transparent cursor-pointer p-0"
                    />
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 font-mono uppercase">
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
                          : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
                          headerColor === color ? 'scale-110 ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-[#030712]' : 'hover:scale-105'
                        }`}
                        title={color}
                      />
                    ))}
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white dark:focus:bg-slate-900/80 resize-none leading-relaxed transition-all"
                />
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
              <div 
                onClick={() => isMobileView && setActiveAccordion(activeAccordion === 'social' ? null : 'social')}
                className="md:hidden p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm mt-2"
              >
                <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">3. Social & UPI Links</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${activeAccordion === 'social' ? 'rotate-180' : ''}`} />
              </div>

              {/* Social Links Reorder Section */}
              <div className={`space-y-4 md:col-span-2 pt-4 border-t border-slate-200 dark:border-white/5 ${isMobileView && activeAccordion !== 'social' ? 'hidden' : 'block'}`}>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Connect & Payment Links</label>
                <p className="text-[10px] text-slate-500 dark:text-slate-500 mb-2">Drag and drop to reorder the items.</p>
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
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl cursor-grab active:cursor-grabbing hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
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
                          <span className="text-[10px] font-bold text-slate-550 uppercase">{platform.label}</span>
                          <input 
                            type="url" 
                            value={platform.value} 
                            onChange={(e) => platform.setter(e.target.value)}
                            placeholder={platform.placeholder} 
                            className="w-full bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
                          />
                        </div>
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>
              </div>

              {/* Section 4 Trigger - Mobile only */}
              <div 
                onClick={() => isMobileView && setActiveAccordion(activeAccordion === 'custom' ? null : 'custom')}
                className="md:hidden p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm mt-2"
              >
                <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">4. Custom Panels & Buttons</span>
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

              {/* Section 5 Trigger - Mobile only */}
              <div 
                onClick={() => isMobileView && setActiveAccordion(activeAccordion === 'docs' ? null : 'docs')}
                className="md:hidden p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm mt-2"
              >
                <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">5. Catalog Files & PDFs</span>
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
                
                <button
                  type="button"
                  onClick={handleLaunchMobileDemo}
                  className="px-5 py-3 rounded-2xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 text-xs font-extrabold transition-all cursor-pointer"
                >
                  Launch Live Demo Page
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

          {/* 2. QR Code Generator Card */}
          <div className="p-6 md:p-8 glass border border-slate-200 dark:border-white/5 rounded-3xl space-y-6">
            <div className="pb-4 border-b border-slate-200 dark:border-white/5">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">QR Code Generator</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Design QR code patterns and configure links</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Destination URL</label>
                  <div className="relative">
                    <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="url"
                      value={qrUrl}
                      onChange={(e) => setQrUrl(e.target.value)}
                      placeholder="Enter destination URL"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white dark:focus:bg-slate-900/80 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">QR Code Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={`#${qrColor}`}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-transparent cursor-pointer p-0.5"
                    />
                    <div className="flex flex-wrap gap-2">
                      {['000000', '2563eb', '0891b2', '4f46e5', '059669', 'e11d48'].map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setQrColor(col)}
                          style={{ backgroundColor: `#${col}` }}
                          className={`w-6 h-6 rounded-full border border-slate-200 dark:border-white/10 transition-transform ${qrColor === col ? 'scale-110 ring-2 ring-blue-500' : 'hover:scale-105'}`}
                          title={`#${col}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-white hover:text-slate-900 text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
                    type="button"
                    onClick={handleDownloadQr}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold transition-all flex items-center justify-center gap-1.5 border border-transparent dark:border-white/10 cursor-pointer hover:from-blue-500 hover:to-indigo-500"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download QR</span>
                  </button>
                </div>
              </div>

              {/* QR Code Graphic Preview */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 rounded-2xl relative overflow-hidden group">
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
                  <div className="w-32 h-32 bg-slate-200/50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-slate-500 animate-spin" />
                  </div>
                )}
                <span className="text-xs text-slate-500 font-extrabold uppercase tracking-widest mt-3">Live Active Preview</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Mobile Preview */}
        {(!isMobileView || mobileActiveTab === 'preview') && (
          <div className={`${isMobileView ? 'w-full flex flex-col items-center' : 'lg:col-span-4 lg:sticky lg:top-28'} p-6 md:p-8 glass border border-slate-200 dark:border-white/5 rounded-3xl flex flex-col items-center w-full`}>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6 block">Live Mobile Simulator</span>
            
            {/* Phone Frame */}
            <div className={`relative w-full max-w-[270px] h-[580px] rounded-[40px] border-[10px] border-slate-900 shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 ${activeTheme.bg}`}>
              
              {/* Camera Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-12 h-1 bg-slate-800 rounded-full mb-1" />
              </div>

              {/* Phone Scrollable Body */}
              <div className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar pb-6">
                {/* Header Banner */}
                <div 
                  className={`relative z-0 w-full pt-16 pb-8 shrink-0 shadow-sm border-b border-indigo-400/20 ${
                    !headerColor || headerColor === 'gradient' ? 'bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700' : ''
                  }`}
                  style={headerColor && headerColor !== 'gradient' ? { backgroundColor: headerColor } : {}}
                />

                {/* Profile Contents */}
                <div className="px-4 flex flex-col flex-1 relative z-10">
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
                      <p className="text-[9px] font-bold text-indigo-500 text-center mt-1 px-3 max-h-[40px] overflow-hidden text-ellipsis line-clamp-2">
                        {profileBio}
                      </p>
                    )}
                    {profileAddress && (
                      <div className="flex items-center justify-center gap-1 mt-1 text-slate-500">
                        <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                        <span className="text-[8px] font-bold truncate max-w-[150px]">{profileAddress}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Action buttons */}
                  <div className="mt-4 mb-2">
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
                                <RightIcon className="w-3 h-3 text-slate-500 opacity-50" />
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Social icons */}
                  <div className="space-y-2 mb-2 z-10">
                    {(socialFacebook || socialGoogle || socialInstagram || socialYoutube || socialLinkedin || socialX || socialWhatsapp || socialUPI) && (
                      <>
                        <span className="text-[8px] font-black uppercase tracking-widest block text-left mb-1.5 text-slate-500">Connect</span>
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

                  {/* Custom Links list */}
                  {customLinks.filter(link => link.label && link.url).length > 0 && (
                    <div className="space-y-2 mt-2 pt-3 border-t border-slate-200">
                      <span className="text-[8px] font-black uppercase tracking-widest block text-left mb-1.5 text-slate-500">Additional Links</span>
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

                  {/* Documents list */}
                  {profileDocuments.filter(doc => doc.filename && (doc.file || doc.url)).length > 0 && (
                    <div className="space-y-2 mt-4 pt-4 border-t border-slate-200">
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block text-left mb-1.5">Documents & Catalogs</span>
                      <div className="space-y-1.5">
                        {profileDocuments.filter(doc => doc.filename && (doc.file || doc.url)).map((doc) => (
                          <div
                            key={doc.id}
                            className={`w-full py-2 px-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-[9px] font-bold text-slate-300 transition-all ${activeTheme.buttonBg}`}
                          >
                            <span className="flex items-center gap-1.5 truncate pr-2">
                              <Smartphone className="w-3 h-3 text-cyan-400 shrink-0" />
                              <span className="truncate">{doc.label || doc.filename}</span>
                            </span>
                            <ArrowUpRight className="w-3 h-3 text-slate-500 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
          </div>
        )}
      </div>
    </div>
  );
}
