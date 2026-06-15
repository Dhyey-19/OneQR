import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  Reorder,
  AnimatePresence,
  useDragControls,
} from "framer-motion";
import {
  QrCode,
  Smartphone,
  Sparkles,
  Link2,
  User,
  UserPlus,
  Mail,
  Globe,
  Phone,
  Download,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  ArrowUpRight,
  ChevronDown,
  Edit2,
  Clock,
  Copy,
  X,
  Building,
  CreditCard,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaTwitter,
  FaGoogle,
  FaWhatsapp,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import FilePreview from "./FilePreview";
import { downloadFlyer } from "../../utils/flyerDownloader";
import { apiRequest } from "../../services/apiService";

const formatTimings = (timingsStr) => {
  if (!timingsStr || typeof timingsStr !== "string") return timingsStr || "";
  if (!timingsStr.startsWith("{") && !timingsStr.startsWith("[")) {
    return timingsStr; // legacy string
  }
  try {
    const data = JSON.parse(timingsStr);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const groups = [];
    let currentGroup = null;

    for (const day of days) {
      const info = data[day] || { isOpen: false };

      const formatTime12 = (time24) => {
        if (!time24) return "";
        const [h, m] = time24.split(":");
        const hour = parseInt(h, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${m} ${ampm}`;
      };

      const timeStr = info.isOpen
        ? `${formatTime12(info.start)} - ${formatTime12(info.end)}`
        : "Closed";

      if (!currentGroup) {
        currentGroup = { startDay: day, endDay: day, timeStr };
      } else if (currentGroup.timeStr === timeStr) {
        currentGroup.endDay = day;
      } else {
        groups.push(currentGroup);
        currentGroup = { startDay: day, endDay: day, timeStr };
      }
    }
    if (currentGroup) groups.push(currentGroup);

    return groups
      .map((g) => {
        if (g.startDay === g.endDay) return `${g.startDay} : ${g.timeStr}`;
        return `${g.startDay} - ${g.endDay} : ${g.timeStr}`;
      })
      .join("\n");
  } catch (e) {
    return timingsStr;
  }
};

export default function ManageQrTab({
  activeQrId,
  isSaving,
  saveSuccess,

  // Profile Data States
  profileLogo,
  setProfileLogo,
  setProfileLogoFile,
  headerColor,
  setHeaderColor,
  qrUrl,
  setQrUrl,
  qrColor,
  setQrColor,
  profileCompany,
  setProfileCompany,
  profileSlug,
  setProfileSlug,
  profileName,
  setProfileName,
  profileTitle,
  setProfileTitle,
  profileBio,
  setProfileBio,
  profileEmail,
  setProfileEmail,
  profilePhone,
  setProfilePhone,
  profileWebsite,
  setProfileWebsite,
  profileAddress,
  setProfileAddress,
  profileGst,
  setProfileGst,
  profileMapUrl,
  setProfileMapUrl,
  profileTimings,
  setProfileTimings,

  // Social States
  socialFacebook,
  setSocialFacebook,
  socialGoogle,
  setSocialGoogle,
  socialInstagram,
  setSocialInstagram,
  socialYoutube,
  setSocialYoutube,
  socialLinkedin,
  setSocialLinkedin,
  socialX,
  setSocialX,
  socialWhatsapp,
  setSocialWhatsapp,
  socialUPI,
  setSocialUPI,
  socialOrder,
  setSocialOrder,

  // Custom Lists States
  customLinks,
  setCustomLinks,
  profileDocuments,
  setProfileDocuments,

  // Selected Feedbacks States
  selectedFeedbacks,
  setSelectedFeedbacks,
  profilePlan = "free",

  // Bank & UPI Details States
  bankUpiId,
  setBankUpiId,
  bankName,
  setBankName,
  bankAccountNo,
  setBankAccountNo,
  bankIfsc,
  setBankIfsc,
  bankAccountName,
  setBankAccountName,

  // Action Handlers
  handleClearProfileForm,
  handleSaveProfileForm,
}) {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState("branding");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
  const [isCopied, setIsCopied] = useState(false);
  const [qrGeneratedUrl, setQrGeneratedUrl] = useState("");
  const logoInputRef = useRef(null);

  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [showTimingsModal, setShowTimingsModal] = useState(false);
  const [gstError, setGstError] = useState("");
  const [upiModalData, setUpiModalData] = useState({
    upiId: "",
    upiLink: "",
    payeeName: "",
  });
  const [copiedUpi, setCopiedUpi] = useState(false);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const [timingsData, setTimingsData] = useState(() => {
    try {
      if (
        profileTimings &&
        typeof profileTimings === "string" &&
        profileTimings.startsWith("{")
      ) {
        return JSON.parse(profileTimings);
      }
    } catch (e) {}
    return {
      Mon: { isOpen: false, start: "09:00", end: "18:00" },
      Tue: { isOpen: false, start: "09:00", end: "18:00" },
      Wed: { isOpen: false, start: "09:00", end: "18:00" },
      Thu: { isOpen: false, start: "09:00", end: "18:00" },
      Fri: { isOpen: false, start: "09:00", end: "18:00" },
      Sat: { isOpen: false, start: "09:00", end: "18:00" },
      Sun: { isOpen: false, start: "09:00", end: "18:00" },
    };
  });

  useEffect(() => {
    if (
      profileTimings &&
      typeof profileTimings === "string" &&
      profileTimings.startsWith("{")
    ) {
      try {
        setTimingsData(JSON.parse(profileTimings));
      } catch (e) {}
    }
  }, [profileTimings]);

  const handleTimingChange = (day, field, value) => {
    let newData = { ...timingsData };
    newData[day] = { ...newData[day], [field]: value };

    if (day === "Mon") {
      const oldMonValue = timingsData.Mon[field];
      daysOfWeek.forEach((d) => {
        if (d !== "Mon" && timingsData[d][field] === oldMonValue) {
          newData[d] = { ...newData[d], [field]: value };
        }
      });
    }

    setTimingsData(newData);
    setProfileTimings(JSON.stringify(newData));
  };

  const handleUpiClick = (e, upiId) => {
    if (e) e.preventDefault();
    const name = profileCompany || profileName || "";
    const upiLink = upiId.startsWith("upi://")
      ? upiId
      : `upi://pay?pa=${upiId}${name ? `&pn=${encodeURIComponent(name)}` : ""}`;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = upiLink;
    } else {
      setUpiModalData({ upiId, upiLink, payeeName: name });
      setUpiModalOpen(true);
    }
  };

  const formatUrl = (url) => {
    if (!url) return "";
    if (
      url.includes("://") ||
      url.startsWith("mailto:") ||
      url.startsWith("tel:")
    )
      return url;
    return `https://${url}`;
  };

  const formatWhatsappUrl = (val) => {
    if (!val) return "";
    if (val.includes("wa.me") || val.includes("whatsapp.com"))
      return formatUrl(val);
    const clean = val.replace(/[^\d+]/g, "");
    return `https://wa.me/${clean}`;
  };

  // Mobile view resize hook
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update QR Code URL preview
  useEffect(() => {
    const cleanColor = qrColor.replace("#", "");
    const encodedUrl = encodeURIComponent(qrUrl);
    setQrGeneratedUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=${cleanColor}&data=${encodedUrl}`,
    );
  }, [qrUrl, qrColor]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadQr = async () => {
    try {
      await downloadFlyer(qrUrl, activeQrId || "code", profileCompany);
    } catch (err) {
      window.open(qrGeneratedUrl, "_blank");
    }
  };

  const getAlphabeticalLogo = (name) => {
    if (!name) return "";
    const cleanName = name.trim();
    if (!cleanName) return "";
    const words = cleanName.split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return cleanName.slice(0, 2).toUpperCase();
  };

  // Custom Links Actions
  const addCustomLink = () => {
    setCustomLinks([...customLinks, { id: Date.now(), label: "", url: "" }]);
  };

  const removeCustomLink = (id) => {
    setCustomLinks(customLinks.filter((link) => link.id !== id));
  };

  const updateCustomLink = (id, field, value) => {
    setCustomLinks(
      customLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link,
      ),
    );
  };

  // Documents/Images Actions
  const addDocument = () => {
    setProfileDocuments([
      ...profileDocuments,
      { id: Date.now(), label: "", filename: "No file chosen", size: "" },
    ]);
  };

  const removeDocument = async (id) => {
    const doc = profileDocuments.find((d) => d.id === id);
    if (doc && doc.url) {
      try {
        await apiRequest("/profile/delete-file", "POST", { url: doc.url });
      } catch (err) {
        console.error("Failed to delete file from Cloudinary", err);
      }
    }
    setProfileDocuments(profileDocuments.filter((doc) => doc.id !== id));
  };

  const updateDocument = (id, field, value) => {
    setProfileDocuments(
      profileDocuments.map((doc) =>
        doc.id === id ? { ...doc, [field]: value } : doc,
      ),
    );
  };

  const handleFileChange = (id, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setProfileDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id
            ? { ...doc, file, filename: file.name, size: `${sizeMb} MB` }
            : doc,
        ),
      );
    }
  };

  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [feedbackError, setFeedbackError] = useState("");

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const response = await apiRequest("/profile/feedbacks");
        if (response.status === "success" && response.data?.feedbacks) {
          setAllFeedbacks(response.data.feedbacks);
        }
      } catch (err) {
        console.error("Failed to load feedbacks for customizer:", err);
      } finally {
        setLoadingFeedbacks(false);
      }
    };
    loadFeedbacks();
  }, []);

  const handleToggleFeedback = (feedback) => {
    const isSelected = selectedFeedbacks.some(
      (f) => (f._id || f) === feedback._id,
    );
    if (isSelected) {
      setSelectedFeedbacks(
        selectedFeedbacks.filter((f) => (f._id || f) !== feedback._id),
      );
      setFeedbackError("");
    } else {
      if (selectedFeedbacks.length >= 3) {
        setFeedbackError(
          "You can select up to 3 feedbacks to showcase on your profile.",
        );
        setTimeout(() => setFeedbackError(""), 3000);
        return;
      }
      setSelectedFeedbacks([...selectedFeedbacks, feedback]);
      setFeedbackError("");
    }
  };

  // Theme specs for mobile preview
  const activeTheme = {
    bg: "bg-white text-slate-900",
    text: "text-slate-900",
    border: "border-slate-200 shadow-sm",
    avatar: "bg-slate-100 text-slate-800",
    tag: "bg-slate-100 border-slate-200 text-slate-800",
    buttonBg:
      "bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 shadow-sm",
    bodyCard: "bg-white border border-slate-200 shadow-xl text-slate-900",
    headerText: "text-slate-900 font-black",
    subText: "text-slate-500",
    itemBg: "bg-slate-50 border border-slate-200 hover:bg-slate-100",
    labelBg: "bg-slate-100 text-slate-700",
    footerText: "text-slate-500",
    signatureText: "text-slate-900 font-extrabold",
    bioColor: "text-slate-700",
    detailLabel: "text-slate-800",
    detailVal: "text-slate-500",
  };

  const isFormFilled = !!profileCompany?.trim();

  return (
    <div className="animate-fade-in h-auto lg:h-[calc(100vh-140px)] w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-start">
        {/* Left Column: Configuration Forms */}
        <div
          className="lg:col-span-9 w-full h-full lg:overflow-y-auto custom-scrollbar pr-0 lg:pr-4 space-y-8 pb-10"
        >
          {/* 1. Digital Profile Builder Card */}
          <div className="p-6 md:p-8 glass border border-slate-200  rounded-3xl space-y-6">
            {/* Form Header */}
            <div className="pb-6 border-b border-slate-200  space-y-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50  border border-indigo-200  flex items-center justify-center text-indigo-600 ">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900  text-lg">
                        Digital Profile Builder
                      </h3>
                      {activeQrId && (
                        <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-500/10 border border-blue-500/20 text-blue-600  rounded-lg flex items-center gap-1">
                          <QrCode className="w-3.5 h-3.5" />
                          QR: {activeQrId}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 ">
                      Select active themes and enter contact info
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Profile Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {/* Section 1 Trigger - Mobile only */}
              <div
                onClick={() =>
                  isMobileView &&
                  setActiveAccordion(
                    activeAccordion === "branding" ? null : "branding",
                  )
                }
                className={`md:hidden p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm transition-all duration-300 mt-2 ${
                  activeAccordion === "branding"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent shadow-blue-500/30 text-white"
                    : "bg-slate-50  border border-slate-200  hover:bg-slate-100 "
                }`}
              >
                <span
                  className={`text-[13px] font-black uppercase tracking-wider ${activeAccordion === "branding" ? "text-white" : "text-slate-800 "}`}
                >
                  1. Profile & Branding
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${activeAccordion === "branding" ? "rotate-180 text-white" : "text-slate-500"}`}
                />
              </div>

              {/* 1. Business Logo */}
              <div
                className={`space-y-2 md:col-span-2 ${isMobileView && activeAccordion !== "branding" ? "hidden" : "block"}`}
              >
                <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                  Logo
                </label>
                <div className="flex items-center gap-4">
                  {profileLogo ? (
                    <div className="relative w-16 h-16 rounded-xl border border-slate-200  overflow-hidden bg-slate-50 ">
                      <img
                        src={profileLogo}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (profileLogo && profileLogo.includes("cloudinary.com")) {
                            try {
                              await apiRequest("/profile/delete-file", "POST", { url: profileLogo });
                            } catch (err) {
                              console.error("Failed to delete logo from Cloudinary", err);
                            }
                          }
                          setProfileLogo("");
                          if (setProfileLogoFile) setProfileLogoFile(null);
                          if (logoInputRef.current)
                            logoInputRef.current.value = "";
                        }}
                        className="absolute top-1 right-1 bg-red-500 rounded-full p-1 shadow-md hover:bg-red-650 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : profileCompany ? (
                    <div className="relative w-16 h-16 rounded-xl bg-indigo-600 text-white font-bold tracking-wider flex items-center justify-center text-sm select-none border border-slate-200 ">
                      {getAlphabeticalLogo(profileCompany)}
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200  bg-slate-50  flex items-center justify-center">
                      <span className="text-xs text-slate-400  font-bold uppercase tracking-widest">
                        Logo
                      </span>
                    </div>
                  )}
                  <label className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-sm font-bold text-slate-700 cursor-pointer transition-colors relative overflow-hidden">
                    Choose File
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (setProfileLogoFile) setProfileLogoFile(file);
                          const reader = new FileReader();
                          reader.onload = (event) =>
                            setProfileLogo(event.target.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Header Color Picker */}
              <div
                className={`space-y-3 md:col-span-2 p-4 rounded-2xl bg-slate-50  border border-slate-200  ${isMobileView && activeAccordion !== "branding" ? "hidden" : "block"}`}
              >
                <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                  Theme Color
                </label>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 bg-slate-100  px-3 py-1.5 rounded-xl border border-slate-200 ">
                    <input
                      type="color"
                      value={
                        headerColor && headerColor.startsWith("#")
                          ? headerColor
                          : "#2563eb"
                      }
                      onChange={(e) => setHeaderColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-slate-200  bg-transparent cursor-pointer p-0"
                    />
                    <span className="text-[11px] text-slate-700  font-mono uppercase">
                      {headerColor && headerColor.startsWith("#")
                        ? headerColor
                        : "#2563eb"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Business/Company Name */}
              <div
                className={`space-y-2 md:col-span-2 ${isMobileView && activeAccordion !== "branding" ? "hidden" : "block"}`}
              >
                <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                  Business Name
                </label>
                <input
                  type="text"
                  value={profileCompany}
                  onChange={(e) => setProfileCompany(e.target.value)}
                  placeholder="Enter business / company name"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50  border border-slate-200  text-slate-900  placeholder-slate-400  text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white  transition-all"
                />
              </div>

              {/* Profile URL Link */}
              <div
                className={`space-y-2 md:col-span-2 ${isMobileView && activeAccordion !== "branding" ? "hidden" : "block"}`}
              >
                <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block flex justify-between">
                  <span>Custom Link</span>
                  <span className="text-[10px] text-slate-400 normal-case font-normal">
                    (Leave empty to auto-generate)
                  </span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 text-sm">
                    oneqr.co/
                  </span>
                  <input
                    type="text"
                    value={profileSlug}
                    onChange={(e) =>
                      setProfileSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-"),
                      )
                    }
                    placeholder="custom-link-name"
                    className="w-full pl-[85px] pr-4 py-2.5 rounded-xl bg-slate-50  border border-slate-200  text-slate-900  placeholder-slate-400  text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white  transition-all font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div
                className={`space-y-2 md:col-span-2 ${isMobileView && activeAccordion !== "branding" ? "hidden" : "block"}`}
              >
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500  uppercase tracking-wider">
                    Description
                  </label>
                </div>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  rows={3}
                  placeholder="Enter short description..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50  border border-slate-200  text-slate-900  placeholder-slate-400  text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white  resize-y leading-normal transition-all"
                />
              </div>

              {/* Physical Address */}
              <div
                className={`space-y-2 md:col-span-2 ${isMobileView && activeAccordion !== "branding" ? "hidden" : "block"}`}
              >
                <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                  Address
                </label>
                <textarea
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  rows={3}
                  placeholder="Enter physical address"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50  border border-slate-200  text-slate-900  placeholder-slate-400  text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white  resize-y leading-relaxed transition-all"
                />
              </div>

              {/* GST Field */}
              <div
                className={`space-y-2 md:col-span-2 ${isMobileView && activeAccordion !== "branding" ? "hidden" : "block"}`}
              >
                <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                  GSTIN
                </label>
                <input
                  type="text"
                  value={profileGst}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setProfileGst(val);
                    const gstRegex =
                      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
                    if (val && !gstRegex.test(val)) {
                      setGstError(
                        "Invalid GSTIN format. Expected: 22AAAAA0000A1Z5",
                      );
                    } else {
                      setGstError("");
                    }
                  }}
                  placeholder="Enter 15-digit GST Number"
                  maxLength={15}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50  border text-sm transition-all focus:outline-none ${
                    gstError
                      ? "border-red-500/50 focus:border-red-500/80 focus:bg-red-50/50  text-red-600 "
                      : "border-slate-200  text-slate-900  placeholder-slate-400  focus:border-blue-500/40 focus:bg-white "
                  }`}
                />
                {gstError && (
                  <p className="text-[10px] text-red-500 font-bold ml-1">
                    {gstError}
                  </p>
                )}
              </div>

              {/* Google Map Link & Timings */}
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-5 md:col-span-2 ${isMobileView && activeAccordion !== "branding" ? "hidden" : "grid"}`}
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                    Google Map
                  </label>
                  <div className="relative">
                    <img
                      src="/assets/google_maps.png"
                      alt="Google Maps"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 object-contain"
                    />
                    <input
                      type="url"
                      value={profileMapUrl}
                      onChange={(e) => setProfileMapUrl(e.target.value)}
                      placeholder="e.g. https://maps.app.goo.gl/..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50  border border-slate-200  text-slate-900  placeholder-slate-400  text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white  transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                    Timings
                  </label>
                  <div className="w-full pl-9 pr-12 py-3 rounded-xl bg-slate-50  border border-slate-200  text-slate-900  text-sm relative flex items-center justify-between">
                    <Clock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <div className="whitespace-pre-line font-semibold leading-relaxed w-full">
                      {profileTimings
                        ? formatTimings(profileTimings)
                        : "No timings configured"}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTimingsModal(true)}
                      className="absolute right-2 top-2 p-1.5 bg-white  text-blue-600  rounded-lg hover:bg-slate-100  transition-colors flex items-center justify-center cursor-pointer shadow-sm border border-slate-200 "
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showTimingsModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md bg-white  border border-slate-200  rounded-2xl shadow-2xl overflow-hidden"
                      >
                        <div className="p-4 border-b border-slate-200  flex items-center justify-between">
                          <h4 className="font-bold text-slate-900  flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            Edit Office Timings
                          </h4>
                          <button
                            type="button"
                            onClick={() => setShowTimingsModal(false)}
                            className="p-1.5 text-slate-500 hover:bg-slate-100  rounded-lg transition-colors cursor-pointer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                          {daysOfWeek.map((day) => (
                            <div
                              key={day}
                              className="flex items-center justify-between gap-2 text-sm bg-slate-50  p-3 rounded-xl border border-slate-200 "
                            >
                              <div className="flex items-center gap-2 w-20">
                                <input
                                  type="checkbox"
                                  checked={timingsData[day]?.isOpen}
                                  onChange={(e) =>
                                    handleTimingChange(
                                      day,
                                      "isOpen",
                                      e.target.checked,
                                    )
                                  }
                                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span
                                  className={`font-semibold ${!timingsData[day]?.isOpen ? "text-slate-400 line-through" : "text-slate-700 "}`}
                                >
                                  {day}
                                </span>
                              </div>
                              {timingsData[day]?.isOpen ? (
                                <div className="flex items-center gap-1.5 flex-1 max-w-[220px]">
                                  <input
                                    type="time"
                                    value={timingsData[day]?.start || "09:00"}
                                    onChange={(e) =>
                                      handleTimingChange(
                                        day,
                                        "start",
                                        e.target.value,
                                      )
                                    }
                                    className="px-2 py-1.5 rounded-lg bg-white  border border-slate-200  text-xs flex-1 text-center font-medium focus:outline-none focus:border-blue-500/50"
                                  />
                                  <span className="text-slate-400 font-bold">
                                    -
                                  </span>
                                  <input
                                    type="time"
                                    value={timingsData[day]?.end || "18:00"}
                                    onChange={(e) =>
                                      handleTimingChange(
                                        day,
                                        "end",
                                        e.target.value,
                                      )
                                    }
                                    className="px-2 py-1.5 rounded-lg bg-white  border border-slate-200  text-xs flex-1 text-center font-medium focus:outline-none focus:border-blue-500/50"
                                  />
                                </div>
                              ) : (
                                <div className="flex-1 max-w-[220px] text-[11px] font-extrabold text-rose-500 bg-rose-50  px-2 py-1.5 rounded-lg border border-rose-200  text-center uppercase tracking-wider">
                                  Holiday / Closed
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="p-4 border-t border-slate-200 ">
                          <button
                            type="button"
                            onClick={() => setShowTimingsModal(false)}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer transition-colors"
                          >
                            Done
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Section 2 Trigger - Mobile only */}
              <div
                onClick={() =>
                  isMobileView &&
                  setActiveAccordion(
                    activeAccordion === "contact" ? null : "contact",
                  )
                }
                className={`md:hidden p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm transition-all duration-300 mt-4 ${
                  activeAccordion === "contact"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent shadow-blue-500/30 text-white"
                    : "bg-slate-50  border border-slate-200  hover:bg-slate-100 "
                }`}
              >
                <span
                  className={`text-[13px] font-black uppercase tracking-wider ${activeAccordion === "contact" ? "text-white" : "text-slate-800 "}`}
                >
                  2. Contact Channels
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${activeAccordion === "contact" ? "rotate-180 text-white" : "text-slate-500"}`}
                />
              </div>

              {/* Email, Phone, and Website URL */}
              <div
                className={`grid grid-cols-1 md:grid-cols-3 gap-5 md:col-span-2 ${isMobileView && activeAccordion !== "contact" ? "hidden" : "grid"}`}
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50  border border-slate-200  text-slate-900  placeholder-slate-400  text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white  transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50  border border-slate-200  text-slate-900  placeholder-slate-400  text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white  transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="url"
                      value={profileWebsite}
                      onChange={(e) => setProfileWebsite(e.target.value)}
                      placeholder="Enter website URL"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50  border border-slate-200  text-slate-900  placeholder-slate-400  text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white  transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3 Trigger - Mobile only */}
              {/* Section 3 Trigger - Mobile only */}
              <div
                onClick={() =>
                  isMobileView &&
                  setActiveAccordion(
                    activeAccordion === "social" ? null : "social",
                  )
                }
                className={`md:hidden p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm transition-all duration-300 mt-4 ${
                  activeAccordion === "social"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent shadow-blue-500/30 text-white"
                    : "bg-slate-50  border border-slate-200  hover:bg-slate-100 "
                }`}
              >
                <span
                  className={`text-[13px] font-black uppercase tracking-wider ${activeAccordion === "social" ? "text-white" : "text-slate-800 "}`}
                >
                  3. Social & Connect Channels
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${activeAccordion === "social" ? "rotate-180 text-white" : "text-slate-500"}`}
                />
              </div>

              {/* Social Links Reorder Section */}
              <div
                className={`space-y-4 md:col-span-2 pt-4 border-t border-slate-200  ${isMobileView && activeAccordion !== "social" ? "hidden" : "block"}`}
              >
                <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                  Social & Connect Channels
                </label>
                <div className="space-y-3 pt-2">
                  {socialOrder.map((key) => {
                    const platforms = {
                      facebook: {
                        icon: FaFacebook,
                        color: "text-blue-500",
                        label: "Facebook",
                        placeholder: "e.g. https://facebook.com/yourusername",
                        value: socialFacebook,
                        setter: setSocialFacebook,
                      },
                      google: {
                        imgSrc: "/assets/google_review.png",
                        label: "Google Review",
                        placeholder: "e.g. https://g.page/r/yourplace/review",
                        value: socialGoogle,
                        setter: setSocialGoogle,
                      },
                      instagram: {
                        icon: FaInstagram,
                        color: "text-pink-500",
                        label: "Instagram",
                        placeholder: "e.g. https://instagram.com/yourusername",
                        value: socialInstagram,
                        setter: setSocialInstagram,
                      },
                      youtube: {
                        icon: FaYoutube,
                        color: "text-rose-500",
                        label: "YouTube",
                        placeholder: "e.g. https://youtube.com/@yourchannel",
                        value: socialYoutube,
                        setter: setSocialYoutube,
                      },
                      linkedin: {
                        icon: FaLinkedin,
                        color: "text-blue-400",
                        label: "LinkedIn",
                        placeholder:
                          "e.g. https://linkedin.com/in/yourusername",
                        value: socialLinkedin,
                        setter: setSocialLinkedin,
                      },
                      x: {
                        icon: FaTwitter,
                        color: "text-black",
                        label: "X (Twitter)",
                        placeholder: "e.g. https://x.com/yourusername",
                        value: socialX,
                        setter: setSocialX,
                      },
                      whatsapp: {
                        icon: FaWhatsapp,
                        color: "text-green-500",
                        label: "WhatsApp",
                        placeholder:
                          "e.g. WhatsApp Mobile Number (with country code)",
                        value: socialWhatsapp,
                        setter: setSocialWhatsapp,
                      },
                      upi: {
                        imgSrc: "/assets/upi.png",
                        label: "UPI VPA ID",
                        placeholder: "e.g. yourname@okaxis",
                        value: socialUPI,
                        setter: setSocialUPI,
                      },
                    };
                    const platform = platforms[key];
                    if (!platform) return null;

                    const Icon = platform.icon;

                    return (
                      <div
                        key={key}
                        className="flex items-center gap-2.5 p-2 bg-white  border border-slate-200  rounded-2xl hover:border-blue-500/30 transition-all relative group"
                      >

                        {/* 2. Brand Icon Circle Container */}
                        <div className="w-8 h-8 rounded-xl bg-slate-50  flex items-center justify-center shrink-0 border border-slate-200/50 ">
                          {platform.imgSrc ? (
                            <img
                              src={platform.imgSrc}
                              alt={platform.label}
                              className="w-4 h-4 object-contain"
                            />
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
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50  border border-slate-200  text-slate-900  placeholder-slate-400  text-xs focus:outline-none focus:border-blue-500/40 focus:bg-white  transition-all"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Section Bank Trigger - Mobile only */}
              <div
                onClick={() =>
                  isMobileView &&
                  setActiveAccordion(activeAccordion === "bank" ? null : "bank")
                }
                className={`md:hidden p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm transition-all duration-300 mt-4 ${
                  activeAccordion === "bank"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent shadow-blue-500/30 text-white"
                    : "bg-slate-50  border border-slate-200  hover:bg-slate-100 "
                }`}
              >
                <span
                  className={`text-[13px] font-black uppercase tracking-wider ${activeAccordion === "bank" ? "text-white" : "text-slate-800 "}`}
                >
                  4. Bank Details
                </span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${activeAccordion === "bank" ? "rotate-180 text-white" : "text-slate-500"}`}
                />
              </div>

              {/* Bank Details Section */}
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-5 md:col-span-2 pt-4 border-t border-slate-200  ${isMobileView && activeAccordion !== "bank" ? "hidden" : "grid"}`}
              >
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                    Bank Details
                  </label>
                  <p className="text-[10px] text-slate-500  mt-1">
                    Provide your bank account details to receive payments
                    directly. Fill only what is needed.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                    Bank Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. HDFC Bank"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50  border border-slate-200  text-slate-900  placeholder-slate-400  text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white  transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                    Account Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50  border border-slate-200  text-slate-900  placeholder-slate-400  text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white  transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                    Account Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={bankAccountNo}
                      onChange={(e) => setBankAccountNo(e.target.value)}
                      placeholder="e.g. 501001234567"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50  border border-slate-200  text-slate-900  placeholder-slate-400  text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white  transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                    IFSC Code
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value)}
                      placeholder="e.g. HDFC0000240"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50  border border-slate-200  text-slate-900  placeholder-slate-400  text-sm focus:outline-none focus:border-blue-500/40 focus:bg-white  transition-all"
                    />
                  </div>
                </div>
              </div>

              {profilePlan !== "basic" && profilePlan !== "free" && (
                <>
                  {/* Section 5 Trigger - Mobile only */}
                  <div
                    onClick={() =>
                      isMobileView &&
                      setActiveAccordion(
                        activeAccordion === "custom" ? null : "custom",
                      )
                    }
                    className={`md:hidden p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm transition-all duration-300 mt-4 ${
                      activeAccordion === "custom"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent shadow-blue-500/30 text-white"
                        : "bg-slate-50  border border-slate-200  hover:bg-slate-100 "
                    }`}
                  >
                    <span
                      className={`text-[13px] font-black uppercase tracking-wider ${activeAccordion === "custom" ? "text-white" : "text-slate-800 "}`}
                    >
                      5. Custom Panels & Buttons
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${activeAccordion === "custom" ? "rotate-180 text-white" : "text-slate-500"}`}
                    />
                  </div>

                  {/* Dynamic Custom Links Panels */}
                  <div
                    className={`space-y-4 md:col-span-2 pt-4 border-t border-slate-200  ${isMobileView && activeAccordion !== "custom" ? "hidden" : "block"}`}
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                        Custom Links (Dynamic Panels)
                      </label>
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
                        <div
                          key={link.id}
                          className="p-4 bg-slate-50  border border-slate-200  rounded-2xl flex flex-col sm:flex-row items-center gap-3 relative group"
                        >
                          <button
                            type="button"
                            onClick={() => removeCustomLink(link.id)}
                            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:text-rose-300 hover:bg-rose-500/20 flex items-center justify-center text-xs transition-all shadow-lg cursor-pointer z-10"
                            title="Remove custom link"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          <div className="w-full sm:w-[40%] space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Button Label
                            </span>
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) =>
                                updateCustomLink(
                                  link.id,
                                  "label",
                                  e.target.value,
                                )
                              }
                              placeholder="Enter button label"
                              className="w-full px-3 py-2 rounded-xl bg-white  border border-slate-200  text-slate-900  text-sm focus:outline-none focus:border-blue-500/40"
                            />
                          </div>

                          <div className="w-full sm:w-[60%] space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Destination URL
                            </span>
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) =>
                                updateCustomLink(link.id, "url", e.target.value)
                              }
                              placeholder="Enter destination URL"
                              className="w-full px-3 py-2 rounded-xl bg-white  border border-slate-200  text-slate-900  text-sm focus:outline-none focus:border-blue-500/40"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {profilePlan !== "basic" && profilePlan !== "free" && (
                <>
                  {/* Section 6 Trigger - Mobile only */}
                  <div
                    onClick={() =>
                      isMobileView &&
                      setActiveAccordion(
                        activeAccordion === "docs" ? null : "docs",
                      )
                    }
                    className={`md:hidden p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm transition-all duration-300 mt-4 ${
                      activeAccordion === "docs"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent shadow-blue-500/30 text-white"
                        : "bg-slate-50  border border-slate-200  hover:bg-slate-100 "
                    }`}
                  >
                    <span
                      className={`text-[13px] font-black uppercase tracking-wider ${activeAccordion === "docs" ? "text-white" : "text-slate-800 "}`}
                    >
                      6. Catalog Files & PDFs
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${activeAccordion === "docs" ? "rotate-180 text-white" : "text-slate-500"}`}
                    />
                  </div>

                  {/* Documents & PDF Menu Catalog Uploader */}
                  <div
                    className={`space-y-4 md:col-span-2 pt-6 border-t border-slate-200  ${isMobileView && activeAccordion !== "docs" ? "hidden" : "block"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                          Product Catalogs, Menus & Images
                        </label>
                        <span className="text-xs text-slate-500">
                          Upload PDF menus, price lists, brochures, or store
                          images
                        </span>
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
                        <div
                          key={doc.id}
                          className="p-4 bg-slate-50  border border-slate-200  rounded-2xl flex flex-col md:flex-row items-center gap-4 relative group"
                        >
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
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Document Label
                            </span>
                            <input
                              type="text"
                              value={doc.label}
                              onChange={(e) =>
                                updateDocument(doc.id, "label", e.target.value)
                              }
                              placeholder="Enter document label"
                              className="w-full px-3 py-2 rounded-xl bg-white  border border-slate-200  text-slate-900  text-sm focus:outline-none focus:border-blue-500/40"
                            />
                          </div>

                          <div className="w-full md:w-[53%] space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Choose File
                            </span>
                            <div className="flex items-center gap-2">
                              <label className="flex-grow flex items-center justify-between px-3 py-2 rounded-xl bg-white  border border-slate-200  cursor-pointer hover:border-slate-300  transition-all text-xs text-slate-500 truncate max-w-[200px] sm:max-w-none">
                                <span className="text-[10px] text-blue-500 font-bold uppercase shrink-0">
                                  {doc.file || doc.url ? 'File Selected' : 'Choose File'}
                                </span>
                                <input
                                  type="file"
                                  accept=".pdf,image/*"
                                  onChange={(e) => handleFileChange(doc.id, e)}
                                  className="hidden"
                                />
                              </label>
                              {doc.size && (
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-100  border border-slate-200  px-2 py-1 rounded-lg shrink-0">
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

              {profilePlan !== "basic" && profilePlan !== "free" && (
                <>
                  {/* Section 7 Trigger - Mobile only */}
                  <div
                    onClick={() =>
                      isMobileView &&
                      setActiveAccordion(
                        activeAccordion === "feedbacks" ? null : "feedbacks",
                      )
                    }
                    className={`md:hidden p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm transition-all duration-300 mt-4 ${
                      activeAccordion === "feedbacks"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent shadow-blue-500/30 text-white"
                        : "bg-slate-50  border border-slate-200  hover:bg-slate-100 "
                    }`}
                  >
                    <span
                      className={`text-[13px] font-black uppercase tracking-wider ${activeAccordion === "feedbacks" ? "text-white" : "text-slate-800 "}`}
                    >
                      7. Showcase Client Reviews
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${activeAccordion === "feedbacks" ? "rotate-180 text-white" : "text-slate-500"}`}
                    />
                  </div>

                  {/* Showcase Client Reviews Section */}
                  <div
                    className={`space-y-4 md:col-span-2 pt-6 border-t border-slate-200  ${isMobileView && activeAccordion !== "feedbacks" ? "hidden" : "block"}`}
                  >
                    <div>
                      <label className="text-xs font-bold text-slate-500  uppercase tracking-wider block">
                        Showcase Client Reviews & Testimonials
                      </label>
                      <span className="text-xs text-slate-500">
                        Select up to 3 customer reviews/feedbacks to feature at
                        the bottom of your profile page.
                      </span>
                    </div>

                    {feedbackError && (
                      <div className="mb-4 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                          !
                        </span>
                        {feedbackError}
                      </div>
                    )}
                    {loadingFeedbacks ? (
                      <div className="py-4 text-center text-xs text-slate-500 animate-pulse">
                        Loading feedbacks...
                      </div>
                    ) : allFeedbacks.length === 0 ? (
                      <div className="p-6 bg-slate-50  border border-slate-200  rounded-2xl text-center space-y-2">
                        <span className="text-xs font-semibold text-slate-450  block">
                          No Feedbacks / Reviews Found
                        </span>
                        <p className="text-[11px] text-slate-550  max-w-sm mx-auto leading-relaxed">
                          Constructive or positive feedback entered by users
                          when they submit reviews will be stored here, allowing
                          you to select and feature them.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                        {allFeedbacks.map((f) => {
                          const isSelected = selectedFeedbacks.some(
                            (selected) => (selected._id || selected) === f._id,
                          );
                          return (
                            <div
                              key={f._id}
                              onClick={() => handleToggleFeedback(f)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 shadow-sm relative overflow-hidden shrink-0 ${
                                isSelected
                                  ? "bg-blue-50  border-blue-500 "
                                  : "bg-slate-50  border-slate-200  hover:border-slate-300 "
                              }`}
                            >
                              <div className="flex flex-col w-full">
                                <div className="flex justify-between items-center mb-1">
                                  <div className="flex items-center gap-0.5 text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${i < f.rating ? "fill-current" : "opacity-25"}`}
                                      />
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {f.createdAt && (
                                      <span className="text-[9px] text-slate-400 font-medium">
                                        {new Date(
                                          f.createdAt,
                                        ).toLocaleDateString("en-IN", {
                                          day: "numeric",
                                          month: "short",
                                          year: "2-digit",
                                        })}
                                      </span>
                                    )}
                                    {isSelected && (
                                      <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                                        <Check className="w-2.5 h-2.5" />
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <p className="text-xs text-slate-700  italic font-medium leading-snug line-clamp-2 w-full pr-4">
                                  "{f.feedbackText || "No comment provided."}"
                                </p>

                                {(f.customerName || f.customerPhone) && (
                                  <div className="text-[10px] text-slate-500  mt-1 font-bold">
                                    — {f.customerName || "Anonymous Customer"}
                                  </div>
                                )}
                              </div>
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
            <div className="pt-8 border-t border-slate-200  flex flex-wrap gap-4 items-center justify-end">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveProfileForm}
                className={`px-8 py-3 rounded-2xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  saveSuccess
                    ? "bg-emerald-600 text-white shadow-emerald-500/20"
                    : "bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-blue-500/20"
                }`}
                id="manage-qr-save-btn"
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
          <div className="hidden lg:flex lg:col-span-3 lg:sticky lg:top-0 h-full flex-col items-center justify-start pt-6 w-full">
            {/* Phone Frame */}
            {!isFormFilled ? (
              <div className="w-full flex flex-col items-center justify-center py-20 text-center space-y-4 min-h-[480px] border border-dashed border-slate-300  rounded-[32px] p-6 bg-slate-50/30  animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500  animate-pulse">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-800  text-sm">
                    Preview Unavailable
                  </h4>
                  <p className="text-slate-500  text-xs leading-relaxed max-w-[200px] mx-auto">
                    Start entering your business or personal details in the form
                    to see a live mockup of your dynamic page here!
                  </p>
                </div>
              </div>
            ) : (
              <div
                className={`relative w-full max-w-[270px] h-[580px] rounded-[40px] border-[10px] border-slate-900 shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 ${activeTheme.bg}`}
              >
                {/* Camera Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
                  <div className="w-12 h-1 bg-slate-800 rounded-full mb-1" />
                </div>

                {/* Phone Scrollable Body */}
                <div
                  className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar pb-6"
                >
                  {/* Header Banner */}
                  <div
                    className={`relative z-0 w-full pt-10 pb-5 shrink-0 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.3)] border-b border-indigo-400/20 ${
                      !headerColor || headerColor === "gradient"
                        ? "bg-indigo-600"
                        : ""
                    }`}
                    style={
                      headerColor && headerColor !== "gradient"
                        ? { backgroundColor: headerColor }
                        : {}
                    }
                  />

                  {/* Profile Contents */}
                  <div className="px-4 flex flex-col flex-1 relative z-10">
                    {/* Name & Bio block */}
                    <div className="flex flex-col items-center -mt-8 mb-2 relative z-20">
                      {profileLogo ? (
                        <div className="p-1 bg-white rounded-full shadow-md ring-2 ring-white flex items-center justify-center overflow-hidden h-[56px] w-[56px] mb-2">
                          <img
                            src={profileLogo}
                            alt="Logo"
                            className="w-full h-full object-cover scale-[1.18]"
                          />
                        </div>
                      ) : profileCompany ? (
                        <div className="bg-indigo-600 text-white font-extrabold tracking-wider rounded-full shadow-md ring-2 ring-white flex items-center justify-center h-[56px] w-[56px] mb-2 text-sm select-none">
                          {getAlphabeticalLogo(profileCompany)}
                        </div>
                      ) : null}
                      {profileCompany && (
                        <h1 className="text-[12px] font-extrabold tracking-tight text-slate-900 leading-tight text-center px-2">
                          {profileCompany}
                        </h1>
                      )}
                      {profileBio && (
                        <p className="text-[9px] font-bold text-indigo-500 text-center mt-1 px-3 whitespace-pre-wrap break-words max-h-[60px] overflow-hidden text-ellipsis">
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
                          <div
                            className={`w-full py-2 px-3 rounded-xl flex flex-col gap-2 text-[9px] leading-normal ${activeTheme.itemBg} ${activeTheme.text}`}
                          >
                            <div className="flex items-start gap-1.5">
                              <img
                                src="/assets/google_maps.png"
                                alt="Google Maps"
                                className="w-3.5 h-3.5 shrink-0 mt-0.5 object-contain"
                              />
                              <span className="text-left whitespace-pre-line truncate max-w-[200px]">
                                {profileAddress}
                              </span>
                            </div>
                            {profileMapUrl && profileMapUrl.trim() !== "" && (
                              <a
                                href={profileMapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 text-[8px] font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
                              >
                                <img
                                  src="/assets/google_maps.png"
                                  alt="Google Maps"
                                  className="w-2.5 h-2.5 object-contain"
                                />
                                <span>View on Google Map</span>
                              </a>
                            )}
                          </div>
                        )}

                        {/* GST Details Card */}
                        {profileGst && (
                          <div
                            className={`w-full py-2 px-3 rounded-xl flex items-start gap-1.5 text-[9px] leading-normal ${activeTheme.itemBg} ${activeTheme.text}`}
                          >
                            <Building className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                            <span className="text-left font-medium whitespace-pre-line truncate max-w-[200px]">
                              GSTIN:{" "}
                              <span className="font-bold uppercase tracking-wider">
                                {profileGst}
                              </span>
                            </span>
                          </div>
                        )}

                        {/* Timings Card */}
                        {profileTimings && (
                          <div
                            className={`w-full py-2 px-3 rounded-xl flex items-start gap-1.5 text-[9px] leading-normal ${activeTheme.itemBg} ${activeTheme.text}`}
                          >
                            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span className="text-left font-semibold whitespace-pre-line break-words max-w-full">
                              {formatTimings(profileTimings)}
                            </span>
                          </div>
                        )}

                        {/* Quick Action buttons Grid */}
                        {(() => {
                          const actionCards = [];
                          if (profilePhone) {
                            actionCards.push({
                              id: "call",
                              icon: Phone,
                              color: "text-green-500",
                              label: "Call",
                              href: `tel:${profilePhone}`,
                              target: undefined,
                            });
                            actionCards.push({
                              id: "save",
                              icon: UserPlus,
                              color: "text-indigo-500",
                              label: "Save Contact",
                              href: "#",
                              target: undefined,
                            });
                          }
                          if (profileEmail) {
                            actionCards.push({
                              id: "email",
                              icon: Mail,
                              color: "text-yellow-500",
                              label: "Email",
                              href: `mailto:${profileEmail}`,
                              target: undefined,
                            });
                          }
                          if (profileWebsite) {
                            const targetUrl = /^https?:\/\//i.test(
                              profileWebsite,
                            )
                              ? profileWebsite
                              : `https://${profileWebsite}`;
                            actionCards.push({
                              id: "web",
                              icon: Globe,
                              color: "text-blue-500",
                              label: "Website",
                              href: targetUrl,
                              target: "_blank",
                            });
                          }

                          if (actionCards.length === 0) return null;

                          return (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {actionCards.map((card, idx) => {
                                const isLastOdd =
                                  idx === actionCards.length - 1 &&
                                  actionCards.length % 2 !== 0;
                                const IconComponent = card.icon;
                                const RightIcon =
                                  card.id === "save" ? Download : ArrowUpRight;

                                return (
                                  <a
                                    key={card.id}
                                    href={card.href || "#"}
                                    target={card.target}
                                    rel={
                                      card.target
                                        ? "noopener noreferrer"
                                        : undefined
                                    }
                                    className={`w-full py-2 px-2.5 rounded-xl flex items-center justify-between text-[9px] font-bold ${activeTheme.itemBg} ${isLastOdd ? "col-span-2" : ""} hover:scale-[1.01] transition-transform ${activeTheme.text}`}
                                  >
                                    <span
                                      className={`flex items-center gap-1.5 truncate pr-1`}
                                    >
                                      <IconComponent
                                        className={`w-3 h-3 ${card.color} shrink-0`}
                                      />
                                      <span className="truncate">
                                        {card.label}
                                      </span>
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
                      {(socialFacebook ||
                        socialGoogle ||
                        socialInstagram ||
                        socialYoutube ||
                        socialLinkedin ||
                        socialX ||
                        socialWhatsapp ||
                        socialUPI) && (
                        <div className="space-y-2 mt-2">
                          <span className="text-[8px] font-black uppercase tracking-widest block text-left text-slate-500">
                            Connect
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {socialOrder.map((key) => {
                              const platforms = {
                                facebook: {
                                  icon: FaFacebook,
                                  color: "text-blue-500",
                                  label: "Facebook",
                                  value: socialFacebook,
                                },
                                google: {
                                  icon: FcGoogle,
                                  color: "",
                                  label: "Google Review",
                                  value: socialGoogle,
                                },
                                instagram: {
                                  icon: FaInstagram,
                                  color: "text-pink-500",
                                  label: "Instagram",
                                  value: socialInstagram,
                                },
                                youtube: {
                                  icon: FaYoutube,
                                  color: "text-rose-500",
                                  label: "YouTube",
                                  value: socialYoutube,
                                },
                                linkedin: {
                                  icon: FaLinkedin,
                                  color: "text-blue-400",
                                  label: "LinkedIn",
                                  value: socialLinkedin,
                                },
                                x: {
                                  icon: FaTwitter,
                                  color: "text-black",
                                  label: "X (Twitter)",
                                  value: socialX,
                                },
                                whatsapp: {
                                  icon: FaWhatsapp,
                                  color: "text-green-500",
                                  label: "WhatsApp",
                                  value: socialWhatsapp,
                                },
                                upi: {
                                  imgSrc: "/assets/upi.png",
                                  label: "UPI",
                                  value: socialUPI,
                                },
                              };
                              const p = platforms[key];
                              if (!p || !p.value) return null;
                              const Icon = p.icon;
                              return (
                                <a
                                  key={key}
                                  href={
                                    key === "upi"
                                      ? "#"
                                      : key === "whatsapp"
                                        ? formatWhatsappUrl(p.value)
                                        : formatUrl(p.value)
                                  }
                                  onClick={
                                    key === "upi"
                                      ? (e) => handleUpiClick(e, p.value)
                                      : undefined
                                  }
                                  target={key === "upi" ? undefined : "_blank"}
                                  rel={
                                    key === "upi"
                                      ? undefined
                                      : "noopener noreferrer"
                                  }
                                  className={`py-1.5 px-2 rounded-xl flex items-center gap-1.5 text-[8px] font-bold ${activeTheme.buttonBg} hover:scale-[1.02] transition-all ${activeTheme.text}`}
                                >
                                  {p.imgSrc ? (
                                    <img
                                      src={p.imgSrc}
                                      alt={p.label}
                                      className="w-3 h-3 shrink-0 object-contain"
                                    />
                                  ) : (
                                    <Icon
                                      className={`w-3 h-3 shrink-0 ${p.color}`}
                                    />
                                  )}{" "}
                                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                    {p.label}
                                  </span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Bank Details Card */}
                      {(bankName ||
                        bankAccountNo ||
                        bankIfsc ||
                        bankAccountName) && (
                        <div className="space-y-2 mt-2">
                          <span className="text-[8px] font-black uppercase tracking-widest block text-left text-slate-500">
                            Bank Details
                          </span>
                          <div
                            className={`p-3 rounded-xl flex flex-col gap-2 text-[8px] font-bold shadow-sm ${activeTheme.buttonBg} ${activeTheme.text}`}
                          >
                            {bankName && (
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="opacity-60 flex items-center gap-1">
                                  <Building className="w-3 h-3 text-slate-500 shrink-0" />{" "}
                                  Bank
                                </span>
                                <span className="opacity-95 truncate">
                                  {bankName}
                                </span>
                              </div>
                            )}
                            {bankAccountName && (
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="opacity-60 flex items-center gap-1">
                                  <User className="w-3 h-3 text-slate-500 shrink-0" />{" "}
                                  Holder
                                </span>
                                <span className="opacity-95 truncate">
                                  {bankAccountName}
                                </span>
                              </div>
                            )}
                            {bankAccountNo && (
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="opacity-60 flex items-center gap-1">
                                  <CreditCard className="w-3 h-3 text-slate-500 shrink-0" />{" "}
                                  A/C No
                                </span>
                                <span className="opacity-95 truncate">
                                  {bankAccountNo}
                                </span>
                              </div>
                            )}
                            {bankIfsc && (
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="opacity-60 flex items-center gap-1">
                                  <Globe className="w-3 h-3 text-slate-500 shrink-0" />{" "}
                                  IFSC
                                </span>
                                <span className="opacity-95 truncate">
                                  {bankIfsc}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Custom Links list */}
                      {customLinks.filter((link) => link.label && link.url)
                        .length > 0 && (
                        <div className="space-y-2 mt-2 pt-2 border-t border-slate-200">
                          <span className="text-[8px] font-black uppercase tracking-widest block text-left text-slate-500">
                            Additional Links
                          </span>
                          <div className="space-y-1.5">
                            {customLinks
                              .filter((link) => link.label && link.url)
                              .map((link) => (
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
                      {profileDocuments.filter(
                        (doc) => doc.filename && (doc.file || doc.url),
                      ).length > 0 && (
                        <div className="space-y-2 mt-2 pt-2 border-t border-slate-200">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block text-left">
                            Documents & Catalogs
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {profileDocuments
                              .filter(
                                (doc) => doc.filename && (doc.file || doc.url),
                              )
                              .map((doc) => {
                                const fileUrl = doc.file
                                  ? URL.createObjectURL(doc.file)
                                  : doc.url;
                                const isImg = doc.file
                                  ? doc.file.type?.startsWith("image/")
                                  : /\.(jpe?g|png|gif|webp|svg)$/i.test(
                                      doc.url,
                                    ) ||
                                    /\.(jpe?g|png|gif|webp|svg)/i.test(
                                      doc.filename,
                                    );

                                const isPdf = doc.file
                                  ? doc.file.type === "application/pdf"
                                  : /\.(pdf)$/i.test(doc.url) ||
                                    /\.(pdf)/i.test(doc.filename);

                                const isCloudinary =
                                  doc.url?.includes("cloudinary.com");
                                const thumbnailUrl =
                                  isPdf && isCloudinary
                                    ? doc.url.replace(/\.pdf$/i, ".jpg")
                                    : fileUrl;

                                const showAsThumbnail =
                                  isImg || (isPdf && isCloudinary);

                                if (showAsThumbnail) {
                                  return (
                                    <a
                                      key={doc.id}
                                      href={fileUrl || "#"}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group block relative rounded-xl overflow-hidden border border-slate-200/10 transition-all hover:scale-[1.02] active:scale-95 bg-white/5"
                                    >
                                      <div className="aspect-[4/3] w-full bg-slate-100  relative overflow-hidden">
                                        <img
                                          src={thumbnailUrl}
                                          alt={doc.label || doc.filename}
                                          onError={(e) => {
                                            if (isPdf) {
                                              e.target.style.display = "none";
                                              const iframeWrapper =
                                                e.target.parentElement.querySelector(
                                                  ".pdf-iframe-wrapper",
                                                );
                                              if (iframeWrapper)
                                                iframeWrapper.style.display =
                                                  "block";
                                            }
                                          }}
                                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 relative z-0"
                                        />
                                        {isPdf && (
                                          <div className="pdf-iframe-wrapper hidden absolute inset-0 pointer-events-none overflow-hidden bg-white z-0">
                                            <iframe
                                              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                              className="w-full h-[150%] border-0 transform origin-top"
                                              title="PDF Preview"
                                            />
                                          </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2 z-10 pointer-events-none">
                                          <span className="text-white text-[8px] font-extrabold truncate">
                                            {doc.label || doc.filename}
                                          </span>
                                          <span className="text-white/60 text-[6px] font-medium mt-0.5 flex items-center gap-1">
                                            {isPdf && (
                                              <span className="bg-red-500 text-white px-0.5 py-0.5 rounded-[2px] text-[5px] leading-none uppercase tracking-wider mr-0.5">
                                                PDF
                                              </span>
                                            )}
                                            Click to view
                                          </span>
                                        </div>
                                      </div>
                                    </a>
                                  );
                                }

                                return (
                                  <a
                                    key={doc.id}
                                    href={fileUrl || "#"}
                                    target={fileUrl ? "_blank" : undefined}
                                    rel={
                                      fileUrl
                                        ? "noopener noreferrer"
                                        : undefined
                                    }
                                    className={`col-span-2 w-full py-2 px-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-[9px] font-bold text-slate-350 transition-all ${fileUrl ? "hover:bg-white/10" : ""} ${activeTheme.buttonBg} ${activeTheme.text}`}
                                  >
                                    <span className="flex items-center gap-1.5 truncate pr-2">
                                      <Smartphone className="w-3 h-3 text-cyan-400 shrink-0" />
                                      <span className="truncate">
                                        {doc.label || doc.filename}
                                      </span>
                                    </span>
                                    <ArrowUpRight className="w-3 h-3 text-slate-500 shrink-0" />
                                  </a>
                                );
                              })}
                          </div>
                        </div>
                      )}
                      {/* Client Reviews Section in Emulator */}
                      {(() => {
                        const displayFeedbacks = selectedFeedbacks
                          .map((f) =>
                            typeof f === "string"
                              ? allFeedbacks.find((af) => af._id === f)
                              : f,
                          )
                          .filter(Boolean);

                        if (displayFeedbacks.length === 0) return null;

                        return (
                          <div className="space-y-2 mt-2 pt-2 border-t border-slate-200">
                            <span className="text-[8px] font-black uppercase tracking-widest block text-left text-slate-500">
                              Client Reviews
                            </span>
                            <EmulatorReviewCarousel
                              feedbacks={displayFeedbacks}
                              activeTheme={activeTheme}
                            />
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Branded footer in simulator */}
                  <div
                    className={`text-center py-2 mt-auto shrink-0 ${
                      !headerColor || headerColor === "gradient"
                        ? "bg-indigo-600"
                        : ""
                    }`}
                    style={
                      headerColor && headerColor !== "gradient"
                        ? { backgroundColor: headerColor }
                        : {}
                    }
                  >
                    <span className="text-[8px] font-bold text-white/90 uppercase tracking-widest">
                      Developed By{" "}
                      <strong className="text-white font-extrabold">
                        One<span className="text-blue-300">QR</span>
                      </strong>
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
              className="w-full max-w-sm bg-white  border border-slate-200  rounded-3xl p-6 shadow-2xl relative space-y-6 text-center text-slate-900 "
            >
              <button
                onClick={() => {
                  setUpiModalOpen(false);
                  setCopiedUpi(false);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100  text-slate-400 hover:text-slate-600  transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5 pt-2">
                <h3 className="font-extrabold text-lg tracking-tight">
                  Scan to Pay with UPI
                </h3>
                <p className="text-xs text-slate-500 ">
                  {upiModalData.payeeName
                    ? `Paying: ${upiModalData.payeeName}`
                    : "Scan the QR code with any UPI app on your phone."}
                </p>
              </div>

              <div className="flex justify-center p-4 bg-slate-50  border border-slate-100  rounded-2xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiModalData.upiLink)}`}
                  alt="UPI Payment QR Code"
                  className="w-44 h-44 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-left">
                  UPI ID / VPA
                </span>
                <div className="flex items-center justify-between gap-3 p-3 bg-slate-50  border border-slate-200  rounded-xl">
                  <span className="font-mono text-sm truncate font-medium">
                    {upiModalData.upiId}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(upiModalData.upiId);
                      setCopiedUpi(true);
                      setTimeout(() => setCopiedUpi(false), 2000);
                    }}
                    className="p-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500  rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
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

function EmulatorReviewCarousel({ feedbacks, activeTheme }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!feedbacks || feedbacks.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [feedbacks]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % feedbacks.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);

  if (!feedbacks || feedbacks.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden group rounded-xl">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {feedbacks.map((f, i) => (
          <div key={f._id || i} className="w-full flex-shrink-0">
            <div
              className={`p-2.5 rounded-xl border border-slate-200/40  bg-slate-50/50  flex flex-col gap-1 text-[8px] ${activeTheme.text}`}
            >
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className={`w-2.5 h-2.5 ${starIndex < f.rating ? "fill-current text-amber-500" : "opacity-25"}`}
                  />
                ))}
              </div>
              <p className="italic text-slate-650  leading-relaxed text-left text-[8px]">
                "{f.feedbackText || "No comment."}"
              </p>
              {f.customerName && (
                <span className="font-extrabold text-right block text-slate-550  text-[7px] mt-0.5">
                  — {f.customerName}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {feedbacks.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-0.5 bg-white/80  border border-slate-200  rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft className="w-3 h-3 text-slate-600 " />
          </button>
          <button
            onClick={next}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 bg-white/80  border border-slate-200  rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight className="w-3 h-3 text-slate-600 " />
          </button>
        </>
      )}
    </div>
  );
}
