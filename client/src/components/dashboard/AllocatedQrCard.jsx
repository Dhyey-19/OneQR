import { useState } from "react";
import {
  Check,
  Link2,
  Download,
  Sparkles,
  Smartphone,
  ShieldAlert,
  ExternalLink,
  X,
} from "lucide-react";
import {
  downloadFlyer,
  downloadDynamicFlyer,
} from "../../utils/flyerDownloader";
import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaYoutube,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function AllocatedQrCard({ profile, onManage, onConnect }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const isStandyConnected = !!profile.isStandyConnected;
  const isConnected = !!profile.slug;
  const isSetupComplete = !!(profile.profileCompany || profile.profileName);

  // Custom Plan Badges Configuration
  const planInfo = {
    free: {
      name: "Free",
      badgeStyle: "bg-slate-500/10 border-slate-500/25 text-slate-500 ",
    },
    basic: {
      name: "Basic",
      badgeStyle: "bg-blue-500/10 border-blue-500/25 text-blue-600 ",
    },
    premium: {
      name: "Premium",
      badgeStyle: "bg-indigo-500/10 border-indigo-500/25 text-indigo-600 ",
    },
    enterprise: {
      name: "Enterprise",
      badgeStyle: "bg-amber-500/10 border-amber-500/25 text-amber-600 ",
    },
  };
  const currentPlan = planInfo[profile.plan || "free"] || planInfo.free;

  const cleanColor = "000000"; // Default black color
  const qrUrlPrefix =
    import.meta.env.VITE_QR_URL_PREFIX || window.location.origin;
  const cleanPrefix = qrUrlPrefix.endsWith("/")
    ? qrUrlPrefix
    : `${qrUrlPrefix}/`;
  const qrId = profile.qrId || profile.slug || "";
  const finalQrUrl = qrId ? `${cleanPrefix}qr/${qrId}` : "";

  const qrGeneratedUrl =
    isStandyConnected && finalQrUrl
      ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=${cleanColor}&data=${encodeURIComponent(finalQrUrl)}`
      : "";

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!isConnected || !finalQrUrl) return;
    navigator.clipboard.writeText(finalQrUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatSocialUrl = (platform, value) => {
    if (!value) return null;
    if (value.startsWith("http")) return value;
    switch (platform) {
      case "instagram":
        return `https://instagram.com/${value.replace("@", "")}`;
      case "facebook":
        return `https://facebook.com/${value}`;
      case "x":
        return `https://twitter.com/${value.replace("@", "")}`;
      case "linkedin":
        return `https://linkedin.com/in/${value}`;
      case "youtube":
        return `https://youtube.com/${value.startsWith("@") ? "" : "@"}${value.replace("@", "")}`;
      case "whatsapp":
        return `https://wa.me/${value.replace(/\D/g, "")}`;
      default:
        return `https://${value}`;
    }
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    if (!isStandyConnected || !finalQrUrl) return;
    setIsDownloadModalOpen(true);
  };

  const instagramLogoSvg = `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20448%20512%22%20fill%3D%22%23FFFFFF%22%3E%3Cpath%20d%3D%22M224.1%20141c-63.6%200-114.9%2051.3-114.9%20114.9s51.3%20114.9%20114.9%20114.9S339%20319.5%20339%20255.9%20287.7%20141%20224.1%20141zm0%20189.6c-41.1%200-74.7-33.5-74.7-74.7s33.5-74.7%2074.7-74.7%2074.7%2033.5%2074.7%2074.7-33.6%2074.7-74.7%2074.7zm146.4-194.3c0%2014.9-12%2026.8-26.8%2026.8-14.9%200-26.8-12-26.8-26.8s12-26.8%2026.8-26.8%2026.8%2012%2026.8%2026.8zm76.1%2027.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9%200-35.8%201.7-67.6%209.9-93.9%2036.1s-34.4%2058-36.2%2093.9c-2.1%2037-2.1%20147.9%200%20184.9%201.7%2035.9%209.9%2067.7%2036.2%2093.9s58%2034.4%2093.9%2036.2c37%202.1%20147.9%202.1%20184.9%200%2035.9-1.7%2067.7-9.9%2093.9-36.2%2026.2-26.2%2034.4-58%2036.2-93.9%202.1-37%202.1-147.8%200-184.8zM398.8%20388c-7.8%2019.6-22.9%2034.7-42.6%2042.6-29.5%2011.7-99.5%209-132.1%209s-102.7%202.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7%209-132.1c7.8-19.6%2022.9-34.7%2042.6-42.6%2029.5-11.7%2099.5-9%20132.1-9s102.7-2.6%20132.1%209c19.6%207.8%2034.7%2022.9%2042.6%2042.6%2011.7%2029.5%209%2099.5%209%20132.1s2.7%20102.7-9%20132.1z%0A%3C%2Fpath%3E%3C%2Fsvg%3E`;
  const facebookLogoSvg = `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20fill%3D%22%23FFFFFF%22%3E%3Cpath%20d%3D%22M504%20256C504%20119%20393%208%20256%208S8%20119%208%20256c0%20123.78%2090.69%20226.38%20209.25%20245V327.69h-63V256h63v-54.64c0-62.15%2037-96.48%2093.67-96.48%2027.14%200%2055.52%204.84%2055.52%204.84v61h-31.28c-30.8%200-40.41%2019.12-40.41%2038.73V256h68.78l-11%2071.69h-57.78V501C413.31%20482.38%20504%20379.78%20504%20256z%22%2F%3E%3C%2Fsvg%3E`;
  const whatsappLogoSvg = `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20448%20512%22%20fill%3D%22%23FFFFFF%22%3E%3Cpath%20d%3D%22M380.9%2097.1C339%2055.1%20283.2%2032%20223.9%2032c-122.4%200-222%2099.6-222%20222%200%2039.1%2010.2%2077.3%2029.6%20111L0%20480l117.7-30.9c32.4%2017.7%2068.9%2027%20106.1%2027h.1c122.3%200%20224.1-99.6%20224.1-222%200-59.3-25.2-115-67.1-157zM223.9%20414.4c-33.2%200-65.7-8.9-94-25.7l-6.7-4-69.8%2018.3L72%20334.3l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2%200-101.7%2082.8-184.5%20184.6-184.5%2049.3%200%2095.6%2019.2%20130.4%2054.1%2034.8%2034.9%2056.2%2081.2%2056.1%20130.5%200%20101.8-84.9%20184.6-186.6%20184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5%202.8-3.7%205.6-14.3%2018-17.6%2021.8-3.2%203.7-6.5%204.2-12%201.4-32.6-16.3-54-29.1-75.5-66-2.1-3.6-.2-5.5%201.6-7.3%201.6-1.6%203.7-4.2%205.5-6.3%201.9-2.1%202.5-3.7%203.7-6.3%201.2-2.6.6-4.9-.3-6.3-1.9-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7%200-9.7%201.4-14.8%206.9-5.1%205.6-19.4%2019-19.4%2046.3s19.9%2053.7%2022.7%2057.4c2.8%203.7%2039.1%2059.7%2094.8%2083.8%2035.2%2015.2%2049%2016.5%2066.6%2013.9%2010.7-1.6%2032.8-13.4%2037.4-26.4%204.6-13%204.6-24.1%203.2-26.4-1.3-2.5-5-3.9-10.5-6.6z%22%2F%3E%3C%2Fsvg%3E`;
  const youtubeLogoSvg = `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20576%20512%22%20fill%3D%22%23FFFFFF%22%3E%3Cpath%20d%3D%22M549.655%20124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781%2064%20288%2064%20288%2064S117.22%2064%2074.629%2075.486c-23.497%206.322-42.003%2024.947-48.284%2048.597-11.412%2042.867-11.412%20132.305-11.412%20132.305s0%2089.438%2011.412%20132.305c6.281%2023.65%2024.787%2041.5%2048.284%2047.821C117.22%20448%20288%20448%20288%20448s170.78%200%20213.371-11.486c23.497-6.321%2042.003-24.171%2048.284-47.821%2011.412-42.867%2011.412-132.305%2011.412-132.305s0-89.438-11.412-132.305zm-317.51%20213.508V175.185l142.739%2081.205-142.739%2081.205z%22%2F%3E%3C%2Fsvg%3E`;
  const linkedinLogoSvg = `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20448%20512%22%20fill%3D%22%23FFFFFF%22%3E%3Cpath%20d%3D%22M100.28%20148.14L100.28%20148.14c-28.71%200-47.45-19.1-47.45-42.87%200-24.16%2019.16-42.86%2048.33-42.86%2029.17%200%2047.44%2018.7%2047.88%2042.86.01%2023.77-18.71%2042.87-48.76%2042.87zM52.33%20448h96V192h-96zM224%20192v37.49c13.2-20.48%2037.05-49.69%2089.87-49.69%2065.59%200%20114.8%2042.87%20114.8%20134.82V448h-96V323.27c0-29.74-10.63-50-37.19-50-20.3%200-32.41%2013.68-37.72%2026.9-1.94%204.86-2.43%2011.66-2.43%2018.45V448h-96c0%200%201.28-232%200-256h96z%22%2F%3E%3C%2Fsvg%3E`;
  const xLogoSvg = `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20fill%3D%22%23FFFFFF%22%3E%3Cpath%20d%3D%22M389.2%2048h70.6L305.6%20224.2%20487%20464H345L233.6%20318.1%20106.5%20464H35.8L200.7%20275.5%2026.8%2048H172.4L272.9%20180.9%20389.2%2048zM364.4%20421.8h39.1L151.1%2088h-42L364.4%20421.8z%22%2F%3E%3C%2Fsvg%3E`;

  const availableQRs = [
    {
      id: "all",
      name: "All In One QR",
      url: finalQrUrl,
      icon: Sparkles,
      color: "text-blue-600",
      bg: "bg-blue-50 ",
      theme: null,
    },
  ];
  if (profile.socialGoogle)
    availableQRs.push({
      id: "google",
      name: "Google Review QR",
      url: formatSocialUrl("google", profile.socialGoogle),
      icon: FcGoogle,
      color: "text-black",
      bg: "bg-slate-100 ",
      isTemplate: true,
      templateUrl: "/assets/google_review.png",
    });
  if (profile.socialInstagram)
    availableQRs.push({
      id: "instagram",
      name: "Instagram QR",
      url: formatSocialUrl("instagram", profile.socialInstagram),
      icon: FaInstagram,
      color: "text-pink-600",
      bg: "bg-pink-50 ",
      theme: {
        name: "Instagram",
        logoSvgUrl: instagramLogoSvg,
        gradientColors: ["#833AB4", "#FD1D1D", "#F56040"],
        actionText: "Follow us on",
      },
    });
  if (profile.socialFacebook)
    availableQRs.push({
      id: "facebook",
      name: "Facebook QR",
      url: formatSocialUrl("facebook", profile.socialFacebook),
      icon: FaFacebook,
      color: "text-blue-600",
      bg: "bg-blue-50 ",
      theme: {
        name: "Facebook",
        logoSvgUrl: facebookLogoSvg,
        bgColor: "#1877F2",
        actionText: "Connect on",
      },
    });
  if (profile.socialWhatsapp)
    availableQRs.push({
      id: "whatsapp",
      name: "WhatsApp QR",
      url: formatSocialUrl("whatsapp", profile.socialWhatsapp),
      icon: FaWhatsapp,
      color: "text-green-500",
      bg: "bg-green-50 ",
      theme: {
        name: "WhatsApp",
        logoSvgUrl: whatsappLogoSvg,
        bgColor: "#25D366",
        actionText: "Message us on",
      },
    });
  if (profile.socialYoutube)
    availableQRs.push({
      id: "youtube",
      name: "YouTube QR",
      url: formatSocialUrl("youtube", profile.socialYoutube),
      icon: FaYoutube,
      color: "text-red-600",
      bg: "bg-red-50 ",
      theme: {
        name: "YouTube",
        logoSvgUrl: youtubeLogoSvg,
        bgColor: "#FF0000",
        actionText: "Subscribe on",
      },
    });
  if (profile.socialLinkedin)
    availableQRs.push({
      id: "linkedin",
      name: "LinkedIn QR",
      url: formatSocialUrl("linkedin", profile.socialLinkedin),
      icon: FaLinkedin,
      color: "text-blue-700",
      bg: "bg-blue-50 ",
      theme: {
        name: "LinkedIn",
        logoSvgUrl: linkedinLogoSvg,
        bgColor: "#0A66C2",
        actionText: "Connect on",
      },
    });
  if (profile.socialX)
    availableQRs.push({
      id: "x",
      name: "X (Twitter) QR",
      url: formatSocialUrl("x", profile.socialX),
      icon: FaTwitter,
      color: "text-slate-900 ",
      bg: "bg-slate-200 ",
      theme: {
        name: "X (Twitter)",
        logoSvgUrl: xLogoSvg,
        bgColor: "#000000",
        actionText: "Follow us on",
      },
    });

  const handleDownloadItem = async (e, item) => {
    e.stopPropagation();
    setIsDownloadModalOpen(false);
    try {
      if (item.id === "all" || item.isTemplate) {
        await downloadFlyer(
          item.url,
          profile.slug || qrId,
          profile.profileCompany,
          item.templateUrl,
        );
      } else {
        await downloadDynamicFlyer(
          item.url,
          profile.profileCompany || profile.profileName,
          item.theme,
        );
      }
    } catch (err) {
      console.error(err);
      window.open(qrGeneratedUrl, "_blank");
    }
  };

  return (
    <>
      {/* Mobile-only full card view */}
      <div
        onClick={() => onManage(profile._id)}
        className="flex md:hidden p-5 bg-white  border border-slate-200  hover:border-indigo-500/50 rounded-2xl flex-col items-center justify-between gap-4 transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md active:scale-[0.99] text-slate-900  text-center w-full"
      >
        {/* Card Header Info */}
        <div className="w-full flex items-center justify-between gap-2">
          <span
            className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${currentPlan.badgeStyle}`}
          >
            {currentPlan.name} Plan
          </span>
          <span
            className={`px-2.5 py-1 rounded-full border text-[9px] font-bold ${
              isStandyConnected
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 "
                : "border-amber-500/20 bg-amber-500/10 text-amber-600 "
            }`}
          >
            {isStandyConnected ? `ID: ${profile.slug}` : "Standy Pending"}
          </span>
        </div>

        {/* QR or Placeholder Image */}
        {isStandyConnected ? (
          <div className="relative p-2.5 bg-white rounded-xl shadow-md transition-transform duration-300">
            <img
              src={qrGeneratedUrl}
              alt={`QR Code ${profile.slug}`}
              className="w-28 h-28 select-none"
            />
            <div className="absolute inset-0 bg-blue-500/5 rounded-xl border border-blue-500/10 pointer-events-none" />
          </div>
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onConnect(profile._id);
            }}
            className="w-32 h-32 border-2 border-dashed border-slate-300  rounded-xl bg-white  flex flex-col items-center justify-center p-3 hover:border-amber-500 hover:bg-amber-500/5 transition-all group/placeholder shadow-inner cursor-pointer"
          >
            <ShieldAlert className="w-7 h-7 text-amber-500/80 mb-1.5" />
            <span className="text-[9px] font-black text-amber-600  uppercase tracking-wider text-center">
              Standy Disconnected
            </span>
            <span className="text-[8px] text-slate-500  text-center mt-0.5 font-medium leading-tight">
              Click to connect QR
            </span>
          </div>
        )}

        {/* Card Details & Actions */}
        <div className="w-full space-y-3">
          <div className="space-y-0.5 text-center">
            <span className="text-[9px] font-bold text-slate-400  uppercase tracking-wider block">
              Business / Profile Name
            </span>
            {isConnected ? (
              <span className="text-xs font-bold text-indigo-650  truncate block">
                {profile.profileCompany ||
                  profile.profileName ||
                  "Digital Profile Connected"}
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-500  italic block">
                Setup profile & connect standy
              </span>
            )}
            <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[10px] font-bold text-slate-550 ">
              <span>QR Scans:</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600  border border-indigo-500/20 font-extrabold">
                {profile.qrScanCount || 0}
              </span>
            </div>
          </div>

          <div
            className="space-y-2.5 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Primary Action Row */}
            {isStandyConnected ? (
              <button
                onClick={() => onManage(profile._id)}
                className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Customize Profile</span>
              </button>
            ) : (
              <button
                onClick={() => onConnect(profile._id)}
                className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Smartphone className="w-4 h-4" />
                <span>Connect Standy QR</span>
              </button>
            )}

            {/* Utility Grid Row */}
            <div className="flex gap-2 w-full">
              {isStandyConnected ? (
                <>
                  <button
                    onClick={handleCopy}
                    className={`flex-1 py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-[0.95] ${
                      isCopied
                        ? "border-emerald-500/30 bg-emerald-50  text-emerald-600"
                        : "border-slate-200  bg-slate-50  hover:bg-slate-100  text-slate-700 hover:text-brand-600  "
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-600 ">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 text-slate-500 " />
                        <span className="text-[9px] font-bold">Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadClick}
                    className="flex-1 py-2 px-1 rounded-xl border border-slate-200  bg-slate-50  hover:bg-slate-100  text-slate-700 hover:text-brand-600   flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-[0.95]"
                  >
                    <Download className="w-4 h-4 text-slate-500 " />
                    <span className="text-[9px] font-bold">Download QR</span>
                  </button>

                  <button
                    onClick={() => {
                      window.open(
                        `${window.location.origin}/${profile.slug || profile.qrId || ""}`,
                        "_blank",
                      );
                    }}
                    disabled={!profile.slug && !profile.qrId}
                    className="flex-1 py-2 px-1 rounded-xl border border-slate-200  bg-slate-50  hover:bg-slate-100  text-slate-700 hover:text-brand-600   flex flex-col items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.95]"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500 " />
                    <span className="text-[9px] font-bold">View Page</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onManage(profile._id)}
                    className="flex-1 py-2 px-1 rounded-xl border border-slate-200  bg-slate-50  hover:bg-slate-100  text-slate-700 hover:text-brand-600   flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-[0.95]"
                  >
                    <Sparkles className="w-4 h-4 text-slate-500 " />
                    <span className="text-[9px] font-bold">Customize</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    disabled={!isConnected}
                    className={`flex-1 py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.95] ${
                      isCopied
                        ? "border-emerald-500/30 bg-emerald-50  text-emerald-600"
                        : "border-slate-200  bg-slate-50  hover:bg-slate-100  text-slate-700 hover:text-brand-600  "
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-600 ">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 text-slate-500 " />
                        <span className="text-[9px] font-bold">Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      window.open(
                        `${window.location.origin}/${profile.slug || profile.qrId || ""}`,
                        "_blank",
                      );
                    }}
                    disabled={!profile.slug && !profile.qrId}
                    className="flex-1 py-2 px-1 rounded-xl border border-slate-200  bg-slate-50  hover:bg-slate-100  text-slate-700 hover:text-brand-600   flex flex-col items-center justify-center gap-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.95]"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500 " />
                    <span className="text-[9px] font-bold">View Page</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop-only full card view */}
      <div
        onClick={() => onManage(profile._id)}
        className="hidden md:flex p-6 bg-slate-50  border border-slate-200  hover:border-indigo-500/50  rounded-2xl flex-col items-center justify-between gap-5 transition-all duration-300 group shadow-sm cursor-pointer hover:shadow-md text-slate-900 "
      >
        {/* Card Header Info */}
        <div className="w-full flex items-center justify-between gap-2">
          <span
            className={`px-2.5 py-1 rounded-lg border text-xs font-black uppercase tracking-wider ${currentPlan.badgeStyle}`}
          >
            {currentPlan.name}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${
              isSetupComplete
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 "
                : "border-yellow-500/20 bg-yellow-505/10 text-yellow-600 "
            }`}
          >
            {isSetupComplete ? "Setup Complete" : "Setup Pending"}
          </span>
        </div>

        {/* QR or Placeholder Image */}
        {isStandyConnected ? (
          <div className="relative p-3 bg-white rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-102">
            <img
              src={qrGeneratedUrl}
              alt={`QR Code ${profile.slug}`}
              className="w-32 h-32 select-none"
            />
            <div className="absolute inset-0 bg-blue-500/5 rounded-2xl border border-blue-500/10 pointer-events-none" />
          </div>
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onConnect(profile._id);
            }}
            className="w-36 h-36 border-2 border-dashed border-slate-300  rounded-2xl bg-white  flex flex-col items-center justify-center p-4 hover:border-amber-500 hover:bg-amber-500/5 transition-all group/placeholder shadow-inner cursor-pointer"
          >
            <ShieldAlert className="w-8 h-8 text-amber-500/80 group-hover/placeholder:scale-110 transition-transform mb-2" />
            <span className="text-[10px] font-extrabold text-amber-600  uppercase tracking-wider text-center">
              Standy Disconnected
            </span>
            <span className="text-[9px] text-slate-500  text-center mt-1 font-medium leading-tight">
              Click to connect QR
            </span>
          </div>
        )}

        {/* Card Details & Actions */}
        <div className="w-full space-y-3.5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">
              Business Name
            </span>
            {isConnected ? (
              <span className="text-xs font-semibold text-indigo-600  truncate block">
                {profile.profileCompany ||
                  profile.profileName ||
                  "Digital Profile Connected"}
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-500  italic block">
                No active Standy connected.
              </span>
            )}
            <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-bold text-slate-550 ">
              <span>QR Scans:</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600  border border-indigo-500/20 font-extrabold">
                {profile.qrScanCount || 0}
              </span>
            </div>
          </div>

          <div
            className="flex items-center gap-2 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {isStandyConnected ? (
              <>
                <button
                  onClick={() => onManage(profile._id)}
                  className="flex-grow py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </button>

                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={handleCopy}
                    title="Copy Link"
                    className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center cursor-pointer active:scale-[0.95] ${
                      isCopied
                        ? "border-emerald-500/30 bg-emerald-50  text-emerald-600"
                        : "border-slate-200  bg-slate-100  hover:bg-slate-200  text-slate-700 hover:text-brand-600  "
                    }`}
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Link2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={handleDownloadClick}
                    title="Download QR Flyer"
                    className="w-10 h-10 rounded-xl border border-slate-200  bg-slate-100  hover:bg-slate-200  text-slate-700 hover:text-brand-600   transition-all flex items-center justify-center cursor-pointer active:scale-[0.95]"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      window.open(
                        `${window.location.origin}/${profile.slug || profile.qrId || ""}`,
                        "_blank",
                      );
                    }}
                    disabled={!profile.slug && !profile.qrId}
                    title="View Live Page"
                    className="w-10 h-10 rounded-xl border border-slate-200  bg-slate-100  hover:bg-slate-200  text-slate-700 hover:text-brand-600   transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.95]"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => onConnect(profile._id)}
                  className="flex-grow py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Connect Standy</span>
                </button>

                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => onManage(profile._id)}
                    title="Customize Profile"
                    className="w-10 h-10 rounded-xl border border-slate-200  bg-slate-100  hover:bg-slate-200  text-slate-700 hover:text-brand-600   transition-all flex items-center justify-center cursor-pointer active:scale-[0.95]"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleCopy}
                    disabled={!isConnected}
                    title="Copy Link"
                    className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed active:scale-[0.95] ${
                      isCopied
                        ? "border-emerald-500/30 bg-emerald-50  text-emerald-600"
                        : "border-slate-200  bg-slate-100  hover:bg-slate-200  text-slate-700 hover:text-brand-600  "
                    }`}
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Link2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      window.open(
                        `${window.location.origin}/${profile.slug || profile.qrId || ""}`,
                        "_blank",
                      );
                    }}
                    disabled={!profile.slug && !profile.qrId}
                    title="View Live Page"
                    className="w-10 h-10 rounded-xl border border-slate-200  bg-slate-100  hover:bg-slate-200  text-slate-700 hover:text-brand-600   transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.95]"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Download Options Modal */}
      {isDownloadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsDownloadModalOpen(false);
          }}
        >
          <div
            className="bg-white  border border-slate-200  w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100  flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 ">
                  Download QR Code
                </h3>
                <p className="text-xs text-slate-500  mt-0.5">
                  Select a layout to download as a 9:16 poster
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDownloadModalOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100  flex items-center justify-center text-slate-500 hover:text-slate-900  transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              className="p-3 max-h-[60vh] overflow-y-auto overscroll-contain"
              data-lenis-prevent="true"
            >
              <div className="flex flex-col gap-2">
                {availableQRs.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={(e) => handleDownloadItem(e, item)}
                      className="flex items-center gap-4 w-full p-3 rounded-2xl hover:bg-slate-50  border border-transparent hover:border-slate-200  transition-all group cursor-pointer text-left"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}
                      >
                        <Icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <div className="flex-1">
                        <span className="block text-sm font-bold text-slate-900  group-hover:text-brand-600  transition-colors">
                          {item.name}
                        </span>
                        <span className="block text-[10px] text-slate-500  mt-0.5 line-clamp-1 break-all pr-2">
                          {item.url}
                        </span>
                      </div>
                      <Download className="w-4 h-4 text-slate-300  group-hover:text-brand-600  shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
