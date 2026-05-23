import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, Smartphone, BarChart2, Sparkles, Link2, User, 
  Mail, Globe, Phone, Download, Check, RefreshCw, 
  MapPin, CreditCard, Star, Plus, Trash2, ArrowUpRight
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaTwitter, FaGoogle } from 'react-icons/fa';
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

  // Profile Theme Selection State
  const [selectedTheme, setSelectedTheme] = useState('midnight'); // 'midnight' | 'emerald' | 'sunset' | 'cyber' | 'royal'

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
  const [profileLocation, setProfileLocation] = useState('');
  const [profileAddress, setProfileAddress] = useState('');

  // Social Links States (Cleared Default Values)
  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialGoogle, setSocialGoogle] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialYoutube, setSocialYoutube] = useState('');
  const [socialLinkedin, setSocialLinkedin] = useState('');
  const [socialX, setSocialX] = useState('');

  // Dynamic Custom Links States (Cleared Default Values)
  const [customLinks, setCustomLinks] = useState([]);

  // Documents / Catalog Uploads States (Cleared Default Values)
  const [profileDocuments, setProfileDocuments] = useState([]);

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
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
            setSelectedTheme(profile.selectedTheme || 'midnight');
            setQrUrl(profile.qrUrl || 'https://oneqr.co/user/profile');
            setQrColor(profile.qrColor || '000000');
            setProfileCompany(profile.profileCompany || '');
            setProfileName(profile.profileName || '');
            setProfileTitle(profile.profileTitle || '');
            setProfileLocation(profile.profileLocation || '');
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
      if (hash === '#manage-qr') {
        setSubView('manage-qr');
      } else if (hash === '#dashboard' || hash === '#overview') {
        setSubView('overview');
      }
    };

    window.addEventListener('hashchange', handleHashSync);
    // Sync initially
    handleHashSync();

    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

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
    setProfileLocation('');
    setProfileAddress('');
    setSocialFacebook('');
    setSocialGoogle('');
    setSocialInstagram('');
    setSocialYoutube('');
    setSocialLinkedin('');
    setSocialX('');
    setCustomLinks([]);
    setProfileDocuments([]);
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
        selectedTheme,
        qrUrl,
        qrColor,
        profileCompany,
        profileName,
        profileTitle,
        profileLocation,
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
        customLinks,
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

  // Themes Configuration
  const themes = [
    { id: 'midnight', name: 'Midnight Sleek', gradient: 'from-blue-600 to-indigo-600', ring: 'ring-blue-500' },
    { id: 'emerald', name: 'Emerald Glow', gradient: 'from-emerald-600 to-teal-500', ring: 'ring-emerald-500' },
    { id: 'sunset', name: 'Sunset Rose', gradient: 'from-rose-600 to-amber-500', ring: 'ring-rose-500' },
    { id: 'cyber', name: 'Cyber Neon', gradient: 'from-fuchsia-600 to-cyan-500', ring: 'ring-fuchsia-500' },
    { id: 'royal', name: 'Royal Gold', gradient: 'from-amber-600 via-yellow-500 to-amber-700', ring: 'ring-amber-500' }
  ];

  const getThemeClasses = () => {
    switch (selectedTheme) {
      case 'emerald':
        return {
          bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/80',
          text: 'text-emerald-400',
          border: 'border-emerald-500/20',
          avatar: 'from-emerald-600 to-teal-500',
          tag: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
          buttonBg: 'bg-emerald-500/10 border-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300'
        };
      case 'sunset':
        return {
          bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/80',
          text: 'text-rose-400',
          border: 'border-rose-500/20',
          avatar: 'from-rose-600 to-amber-500',
          tag: 'bg-rose-500/10 border-rose-500/25 text-rose-400',
          buttonBg: 'bg-rose-500/10 border-rose-500/10 hover:bg-rose-500/20 text-rose-300'
        };
      case 'cyber':
        return {
          bg: 'bg-gradient-to-br from-[#0c051a] via-[#05020c] to-[#1a052e]',
          text: 'text-fuchsia-400',
          border: 'border-fuchsia-500/20',
          avatar: 'from-fuchsia-600 to-cyan-500',
          tag: 'bg-fuchsia-500/10 border-fuchsia-500/25 text-fuchsia-400',
          buttonBg: 'bg-fuchsia-500/10 border-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-300'
        };
      case 'royal':
        return {
          bg: 'bg-gradient-to-br from-[#0a0805] via-[#050402] to-[#1e160a]',
          text: 'text-amber-500',
          border: 'border-amber-500/20',
          avatar: 'from-amber-600 via-yellow-500 to-amber-700',
          tag: 'bg-amber-500/10 border-amber-500/25 text-amber-500',
          buttonBg: 'bg-amber-500/10 border-amber-500/10 hover:bg-amber-500/20 text-amber-300'
        };
      case 'midnight':
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80',
          text: 'text-blue-400',
          border: 'border-blue-500/20',
          avatar: 'from-blue-600 to-indigo-600',
          tag: 'bg-blue-500/10 border-blue-500/25 text-blue-400',
          buttonBg: 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'
        };
    }
  };

  const activeTheme = getThemeClasses();

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
                <button
                  onClick={() => { window.location.hash = '#manage-qr'; }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all border border-white/10 flex items-center gap-2 cursor-pointer"
                >
                  <span>Manage QR & Profile</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Configuration Forms (col-span-8) */}
            <div className="lg:col-span-8 space-y-8">
              
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

                    {/* Dynamic Theme Circular Selector */}
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Profile Color Theme</label>
                      <div className="flex flex-wrap items-center gap-4">
                        {themes.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => setSelectedTheme(theme.id)}
                             className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 transition-all text-sm font-bold text-slate-300 hover:bg-white/5 cursor-pointer ${
                               selectedTheme === theme.id ? 'bg-white/10 ring-2 ' + theme.ring + ' text-white' : ''
                             }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${theme.gradient} border border-white/10`} />
                            <span>{theme.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Core Profile Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* 1. Business / Company */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Business / Company</label>
                      <input 
                        type="text"
                        value={profileCompany}
                        onChange={(e) => setProfileCompany(e.target.value)}
                        placeholder="Enter business / company name"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                      />
                    </div>

                    {/* 2. Owner Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Owner Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          placeholder="Enter owner name"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                        />
                      </div>
                    </div>

                    {/* 3. Job Title */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Job Title</label>
                      <input 
                        type="text"
                        value={profileTitle}
                        onChange={(e) => setProfileTitle(e.target.value)}
                        placeholder="Enter job title"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                      />
                    </div>

                    {/* 4. City */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">City</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text"
                          value={profileLocation}
                          onChange={(e) => setProfileLocation(e.target.value)}
                          placeholder="Enter city"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                        />
                      </div>
                    </div>

                    {/* 5. Address */}
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

                    {/* 6. Short Description (Letters counter) */}
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
                        rows={2}
                        placeholder="Enter short description..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40 resize-none leading-normal"
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
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Social Network URLs</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                            <FaFacebook className="w-3 h-3 text-blue-500" /> Facebook
                          </span>
                          <input 
                            type="url" 
                            value={socialFacebook} 
                            onChange={(e) => setSocialFacebook(e.target.value)}
                            placeholder="e.g. https://facebook.com/yourusername" 
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                            <FaGoogle className="w-3 h-3 text-yellow-500" /> Google Review
                          </span>
                          <input 
                            type="url" 
                            value={socialGoogle} 
                            onChange={(e) => setSocialGoogle(e.target.value)}
                            placeholder="e.g. https://g.page/r/yourplace/review" 
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                            <FaInstagram className="w-3 h-3 text-pink-500" /> Instagram
                          </span>
                          <input 
                            type="url" 
                            value={socialInstagram} 
                            onChange={(e) => setSocialInstagram(e.target.value)}
                            placeholder="e.g. https://instagram.com/yourusername" 
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                            <FaYoutube className="w-3 h-3 text-rose-500" /> YouTube
                          </span>
                          <input 
                            type="url" 
                            value={socialYoutube} 
                            onChange={(e) => setSocialYoutube(e.target.value)}
                            placeholder="e.g. https://youtube.com/@yourchannel" 
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                            <FaLinkedin className="w-3 h-3 text-blue-400" /> LinkedIn
                          </span>
                          <input 
                            type="url" 
                            value={socialLinkedin} 
                            onChange={(e) => setSocialLinkedin(e.target.value)}
                            placeholder="e.g. https://linkedin.com/in/yourusername" 
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                            <FaTwitter className="w-3 h-3 text-slate-300" /> X (Twitter)
                          </span>
                          <input 
                            type="url" 
                            value={socialX} 
                            onChange={(e) => setSocialX(e.target.value)}
                            placeholder="e.g. https://x.com/yourusername" 
                            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/40"
                          />
                        </div>
                      </div>
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
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/5 md:col-span-2">
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
              <div className="lg:col-span-4 lg:sticky lg:top-28 p-6 md:p-8 glass border border-white/5 rounded-3xl flex flex-col items-center w-full">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6 block">Live Mobile Simulator</span>
                  
                  {/* Phone Body Container with Dynamic Theme Class */}
                  <div className={`relative w-full max-w-[270px] h-[580px] rounded-[40px] border-[10px] border-slate-900 shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 ${activeTheme.bg}`}>
                    
                    {/* Speaker Grill / Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
                      <div className="w-12 h-1 bg-slate-800 rounded-full mb-1" />
                    </div>

                    {/* Live Content Panel */}
                    <div className="flex-1 flex flex-col justify-between pt-10 pb-6 px-4 overflow-y-auto relative no-scrollbar">
                      
                      {/* Banner Gradient representing Active Theme */}
                      <div className={`absolute -top-12 -left-12 w-32 h-32 rounded-full bg-gradient-to-tr ${activeTheme.avatar} opacity-20 blur-2xl pointer-events-none`} />

                      {/* Profile Info Header */}
                      <div className="text-center pt-4">
                        {profileName && (
                          <div className={`w-18 h-18 rounded-2xl bg-gradient-to-tr ${activeTheme.avatar} border-2 border-white/10 shadow-lg flex items-center justify-center text-white font-black text-xl mx-auto transition-all`}>
                            {getInitials(profileName)}
                          </div>
                        )}
                        
                        {profileName && (
                          <h4 className="font-extrabold text-white text-sm mt-3 overflow-hidden text-ellipsis whitespace-nowrap px-1">
                            {profileName}
                          </h4>
                        )}

                        {profileTitle && (
                          <span className={`text-[9px] ${activeTheme.text} font-bold tracking-wide uppercase block mt-0.5`}>
                            {profileTitle}
                          </span>
                        )}

                        {profileCompany && (
                          <span className="text-[8px] text-slate-500 font-semibold uppercase block leading-tight mt-0.5">
                            {profileCompany}
                          </span>
                        )}

                        {profileLocation && (
                          <div className="flex items-center justify-center gap-1 mt-2 text-[8px] font-medium text-slate-400">
                            <MapPin className="w-2.5 h-2.5 text-slate-500" />
                            <span>{profileLocation}</span>
                          </div>
                        )}

                        {profileBio && (
                          <p className="text-[9px] text-slate-400 leading-normal mt-3 px-3 italic font-medium">
                            "{profileBio}"
                          </p>
                        )}
                      </div>

                      {/* Core Details Grid (Hiding Blank Fields completely) */}
                      <div className="space-y-2.5 my-5">
                        
                        {/* Multiline Address Container */}
                        {profileAddress && (
                          <div className="w-full py-2 px-3 bg-white/5 border border-white/5 rounded-xl flex items-start gap-2 text-[9px] text-slate-300 font-semibold leading-relaxed">
                            <MapPin className={`w-3.5 h-3.5 ${activeTheme.text} shrink-0 mt-0.5`} />
                            <span className="text-left whitespace-pre-line">{profileAddress}</span>
                          </div>
                        )}

                        {profileEmail && (
                          <div className="w-full py-2 px-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-[9px] text-slate-300 font-semibold">
                            <span className="flex items-center gap-1.5">
                              <Mail className={`w-3.5 h-3.5 ${activeTheme.text}`} />
                              Email Us
                            </span>
                            <span className="text-[8px] text-slate-500 font-medium overflow-hidden text-ellipsis max-w-[90px]">{profileEmail}</span>
                          </div>
                        )}

                        {profilePhone && (
                          <div className="w-full py-2 px-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-[9px] text-slate-300 font-semibold">
                            <span className="flex items-center gap-1.5">
                              <Phone className={`w-3.5 h-3.5 ${activeTheme.text}`} />
                              Call Office
                            </span>
                            <span className="text-[8px] text-slate-500 font-medium">{profilePhone}</span>
                          </div>
                        )}

                        {profileWebsite && (
                          <div className="w-full py-2 px-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-[9px] text-slate-300 font-semibold">
                            <span className="flex items-center gap-1.5">
                              <Globe className={`w-3.5 h-3.5 ${activeTheme.text}`} />
                              Website
                            </span>
                            <span className="text-[8px] text-slate-500 font-medium overflow-hidden text-ellipsis max-w-[90px]">{profileWebsite}</span>
                          </div>
                        )}
                      </div>

                      {/* Social Buttons Container (Showing only Icon + Label, gating blanks) */}
                      <div className="space-y-2 mb-6">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block text-left mb-1.5">Social Channels</span>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {socialFacebook && (
                            <div className={`py-1.5 px-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-1.5 text-[8px] text-slate-300 font-bold ${activeTheme.buttonBg}`}>
                              <FaFacebook className="w-3 h-3 text-blue-500" />
                              <span>Facebook</span>
                            </div>
                          )}

                          {socialGoogle && (
                            <div className={`py-1.5 px-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-1.5 text-[8px] text-slate-300 font-bold ${activeTheme.buttonBg}`}>
                              <FaGoogle className="w-3 h-3 text-yellow-500" />
                              <span>Google Review</span>
                            </div>
                          )}

                          {socialInstagram && (
                            <div className={`py-1.5 px-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-1.5 text-[8px] text-slate-300 font-bold ${activeTheme.buttonBg}`}>
                              <FaInstagram className="w-3 h-3 text-pink-500" />
                              <span>Instagram</span>
                            </div>
                          )}

                          {socialYoutube && (
                            <div className={`py-1.5 px-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-1.5 text-[8px] text-slate-300 font-bold ${activeTheme.buttonBg}`}>
                              <FaYoutube className="w-3 h-3 text-rose-500" />
                              <span>YouTube</span>
                            </div>
                          )}

                          {socialLinkedin && (
                            <div className={`py-1.5 px-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-1.5 text-[8px] text-slate-300 font-bold ${activeTheme.buttonBg}`}>
                              <FaLinkedin className="w-3 h-3 text-blue-400" />
                              <span>LinkedIn</span>
                            </div>
                          )}

                          {socialX && (
                            <div className={`py-1.5 px-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-1.5 text-[8px] text-slate-300 font-bold ${activeTheme.buttonBg}`}>
                              <FaTwitter className="w-3 h-3 text-slate-300" />
                              <span>X (Twitter)</span>
                            </div>
                          )}
                        </div>

                        {/* Dynamic Custom Links List (Gating blanks, showing Icon + Custom Label) */}
                        {customLinks.filter(link => link.label && link.url).length > 0 && (
                          <div className="space-y-2 mt-4 pt-3 border-t border-white/5">
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block text-left mb-1.5">Additional Links</span>
                            <div className="space-y-1.5">
                              {customLinks.filter(link => link.label && link.url).map((link) => (
                                <div 
                                  key={link.id} 
                                  className={`w-full py-2 px-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-[9px] font-bold text-slate-300 transition-all ${activeTheme.buttonBg}`}
                                >
                                  <span className="flex items-center gap-1.5">
                                    <Link2 className="w-3 h-3 text-blue-400" />
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
                          <div className="space-y-2 mt-4 pt-3 border-t border-white/5">
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
                      </div>

                      {/* Brand Signature */}
                      <div className="text-center pt-2 border-t border-white/5">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                          Powered by <strong className="text-white font-extrabold">One<span className="text-blue-500">QR</span></strong>
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
          )}
      </div>
    </div>
  );
}
