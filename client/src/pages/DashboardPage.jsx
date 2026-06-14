import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/apiService";
import { authService } from "../services/authService";

const qrUrlPrefix =
  import.meta.env.VITE_QR_URL_PREFIX || "https://oneqr.dtechcode.in";

// Dashboard Sub-components & Tabs
import OverviewTab from "../components/dashboard/OverviewTab";
// BillingTab removed
import QrScanTab from "../components/dashboard/QrScanTab";
import ManageQrTab from "../components/dashboard/ManageQrTab";
import FeedbacksTab from "../components/dashboard/FeedbacksTab";
import ProfileTab from "../components/dashboard/ProfileTab";
import PlansTab from "../components/dashboard/PlansTab";
import MockPaymentModal from "../components/dashboard/MockPaymentModal";
import SuccessModal from "../components/dashboard/SuccessModal";
import ClaimQrModal from "../components/dashboard/ClaimQrModal";
import ConnectStandyModal from "../components/dashboard/ConnectStandyModal";

export default function DashboardPage({ subViewProp }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [subView, setSubView] = useState(subViewProp || "overview");
  const [activeQrId, setActiveQrId] = useState(null);

  // Profile-based slot states
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);

  // Modal display toggles
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectModalProfileId, setConnectModalProfileId] = useState(null);
  const [showMockModal, setShowMockModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Billing & Payment States
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [mockPaymentData, setMockPaymentData] = useState(null);
  const [successPlanName, setSuccessPlanName] = useState("");
  const [showTestModeHelper, setShowTestModeHelper] = useState(false);
  const [pendingTestData, setPendingTestData] = useState(null);

  // Digital Profile Form States
  const [profileLogo, setProfileLogo] = useState("");
  const [profileLogoFile, setProfileLogoFile] = useState(null);
  const [headerColor, setHeaderColor] = useState("#2563eb");
  const [qrUrl, setQrUrl] = useState("https://oneqr.co/user/profile");
  const [qrColor, setQrColor] = useState("000000");
  const [profileName, setProfileName] = useState("");
  const [profileTitle, setProfileTitle] = useState("");
  const [profileCompany, setProfileCompany] = useState("");
  const [profileSlug, setProfileSlug] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileWebsite, setProfileWebsite] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileGst, setProfileGst] = useState("");
  const [profileMapUrl, setProfileMapUrl] = useState("");
  const [profileTimings, setProfileTimings] = useState("");

  // Social Links States
  const [socialFacebook, setSocialFacebook] = useState("");
  const [socialGoogle, setSocialGoogle] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [socialYoutube, setSocialYoutube] = useState("");
  const [socialLinkedin, setSocialLinkedin] = useState("");
  const [socialX, setSocialX] = useState("");
  const [socialWhatsapp, setSocialWhatsapp] = useState("");
  const [socialUPI, setSocialUPI] = useState("");
  const [socialOrder, setSocialOrder] = useState([
    "whatsapp",
    "facebook",
    "instagram",
    "youtube",
    "linkedin",
    "google",
    "x",
    "upi",
  ]);

  // Bank & UPI Details States
  const [bankUpiId, setBankUpiId] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");

  // Custom lists & upload states
  const [customLinks, setCustomLinks] = useState([]);
  const [profileDocuments, setProfileDocuments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedFeedbacks, setSelectedFeedbacks] = useState([]);
  const [profilePlan, setProfilePlan] = useState("free");

  // Fetch specific profile settings for selected QR or profile ID
  const fetchProfile = async (targetQrId, targetProfileId) => {
    try {
      let url = "/profile";
      if (targetProfileId) {
        url = `/profile?profileId=${targetProfileId}`;
      } else if (targetQrId) {
        url = `/profile?qrId=${targetQrId}`;
      }
      const response = await apiRequest(url, { method: "GET" });
      if (response.status === "success" && response.data?.profile) {
        const profile = response.data.profile;
        setActiveProfileId(profile._id);
        setActiveQrId(profile.slug || null);
        setProfileSlug(profile.slug || "");
        setProfilePlan(profile.plan || "free");
        setProfileLogo(profile.profileLogo || "");
        setProfileLogoFile(null);
        setHeaderColor(profile.headerColor || "#2563eb");
        const cleanPrefix = qrUrlPrefix.endsWith("/")
          ? qrUrlPrefix
          : `${qrUrlPrefix}/`;
        const connectedQrId = profile.qrId || profile.slug || "";
        setQrUrl(
          connectedQrId
            ? `${cleanPrefix}qr/${connectedQrId}`
            : "https://oneqr.co/user/profile",
        );
        setQrColor(profile.qrColor || "000000");
        setProfileCompany(profile.profileCompany || "");
        setProfileName(profile.profileName || "");
        setProfileTitle(profile.profileTitle || "");
        setProfileAddress(profile.profileAddress || "");
        setProfileGst(profile.profileGst || "");
        setProfileMapUrl(profile.profileMapUrl || "");
        setProfileTimings(profile.profileTimings || "");
        setProfileBio(profile.profileBio || "");
        setProfileEmail(profile.profileEmail || "");
        setProfilePhone(profile.profilePhone || profile.phone || "");
        setProfileWebsite(profile.profileWebsite || "");
        setSocialFacebook(profile.socialFacebook || "");
        setSocialGoogle(profile.socialGoogle || "");
        setSocialInstagram(profile.socialInstagram || "");
        setSocialYoutube(profile.socialYoutube || "");
        setSocialLinkedin(profile.socialLinkedin || "");
        setSocialX(profile.socialX || "");
        setSocialWhatsapp(profile.socialWhatsapp || "");
        setSocialUPI(profile.socialUPI || "");
        setBankUpiId(profile.bankUpiId || profile.socialUPI || "");
        setBankName(profile.bankName || "");
        setBankAccountNo(profile.bankAccountNo || "");
        setBankIfsc(profile.bankIfsc || "");
        setBankAccountName(profile.bankAccountName || "");

        let incomingOrder = profile.socialOrder || [];
        if (incomingOrder.length > 0) {
          if (!incomingOrder.includes("upi")) incomingOrder.push("upi");
          setSocialOrder(incomingOrder);
        } else {
          setSocialOrder([
            "whatsapp",
            "facebook",
            "instagram",
            "youtube",
            "linkedin",
            "google",
            "x",
            "upi",
          ]);
        }
        setCustomLinks(profile.customLinks || []);
        setProfileDocuments(profile.profileDocuments || []);
        setSelectedFeedbacks(profile.selectedFeedbacks || []);
      }
    } catch (err) {
      console.error("Error fetching profile settings:", err);
    }
  };

  // Main load profiles on mount
  const fetchProfilesAndQrs = async () => {
    setIsLoadingProfiles(true);
    try {
      // Fetch all active/free profiles
      const profileResponse = await apiRequest("/profile/all", {
        method: "GET",
      });
      if (
        profileResponse.status === "success" &&
        profileResponse.data?.profiles
      ) {
        const userProfiles = profileResponse.data.profiles;
        setProfiles(userProfiles);

        if (userProfiles.length > 0) {
          const firstProfile = userProfiles[0];
          setActiveProfileId(firstProfile._id);
          setActiveQrId(firstProfile.slug || null);
          await fetchProfile(null, firstProfile._id);
        } else {
          await fetchProfile();
        }
      } else {
        await fetchProfile();
      }
    } catch (err) {
      console.error("Error fetching assigned profiles:", err);
      await fetchProfile();
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  // Initialize profile load on user change
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setTimeout(() => {
        setCurrentUser(user);
        fetchProfilesAndQrs();
      }, 0);

      // Fetch fresh user profile from server to keep session in-sync
      authService
        .getProfile()
        .then((freshUser) => {
          setTimeout(() => setCurrentUser(freshUser), 0);
        })
        .catch((err) => {
          console.error("Failed to sync profile on mount:", err);
        });
    }
  }, []);

  // Transition view to target profile settings
  const handleSelectAndManageProfile = async (profileId) => {
    setActiveProfileId(profileId);
    await fetchProfile(null, profileId);
    setSubView("manage-qr");
    navigate("/manage-qr");
  };

  // Transition view to target QR settings (legacy/QR scan flow)
  const handleSelectAndManageQr = async (qrId) => {
    setActiveQrId(qrId);
    const matchingProfile = profiles.find((p) => p.slug === qrId);
    if (matchingProfile) {
      setActiveProfileId(matchingProfile._id);
      await fetchProfile(null, matchingProfile._id);
    } else {
      await fetchProfile(qrId);
    }
    setSubView("manage-qr");
    navigate("/manage-qr");
  };

  // Payment triggers
  const openRazorpayCheckout = (orderData, planId) => {
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "OneQR Platforms",
      description: orderData.planName,
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          const verifyRes = await apiRequest("/payment/verify-payment", {
            method: "POST",
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              planId,
            }),
          });

          if (verifyRes.status === "success") {
            const updatedUser = await authService.getProfile();
            setCurrentUser(updatedUser);
            await fetchProfilesAndQrs(); // Re-fetch updated profiles
            setSuccessPlanName(orderData.planName);
            setShowSuccessModal(true);
          } else {
            alert(verifyRes.message || "Payment verification failed.");
          }
        } catch (err) {
          console.error("Payment verification error:", err);
          alert(err.message || "Error verifying payment signature.");
        }
      },
      prefill: {
        contact: currentUser?.phone || "",
      },
      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleUpgrade = async (planId) => {
    setIsPaymentLoading(true);
    try {
      const res = await apiRequest("/payment/create-order", {
        method: "POST",
        body: JSON.stringify({ planId }),
      });

      if (res.status === "success" && res.data) {
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
          // If using a Razorpay test key, show the helper instructions modal first
          if (orderData.keyId && orderData.keyId.startsWith("rzp_test_")) {
            setPendingTestData({ orderData, planId });
            setShowTestModeHelper(true);
          } else {
            openRazorpayCheckout(orderData, planId);
          }
        }
      }
    } catch (err) {
      console.error("Error initiating subscription:", err);
      alert(err.message || "Failed to initiate checkout. Please try again.");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleCompleteMockPayment = async () => {
    if (!mockPaymentData) return;
    setIsPaymentLoading(true);
    try {
      const verifyRes = await apiRequest("/payment/verify-payment", {
        method: "POST",
        body: JSON.stringify({
          razorpayPaymentId: `mock_pay_${Date.now()}`,
          razorpayOrderId: mockPaymentData.orderId,
          razorpaySignature: "mock_signature",
          planId: mockPaymentData.planId,
        }),
      });

      if (verifyRes.status === "success") {
        const updatedUser = await authService.getProfile();
        setCurrentUser(updatedUser);
        await fetchProfilesAndQrs(); // Re-fetch updated profiles
        setShowMockModal(false);
        setMockPaymentData(null);
        setSuccessPlanName(mockPaymentData.planName);
        setShowSuccessModal(true);
      } else {
        alert(verifyRes.message || "Mock verification failed.");
      }
    } catch (err) {
      console.error("Mock verification error:", err);
      alert(err.message || "Error during simulated payment verification.");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  // Sync route param changes
  useEffect(() => {
    if (isLoadingProfiles) return; // Prevent redirecting on initial render before profiles load

    const isSubscribed = profiles.length > 0;

    if (subViewProp === "manage-qr") {
      if (!isSubscribed) {
        navigate("/dashboard", { replace: true });
        setTimeout(() => setSubView("overview"), 0);
      } else {
        setTimeout(() => setSubView("manage-qr"), 0);
      }
    } else if (subViewProp === "billing") {
      navigate("/dashboard", { replace: true });
      setTimeout(() => setSubView("overview"), 0);
    } else if (subViewProp === "overview") {
      setTimeout(() => setSubView("overview"), 0);
    } else if (subViewProp === "qr-scan") {
      setTimeout(() => setSubView("qr-scan"), 0);
    } else if (subViewProp === "feedbacks") {
      setTimeout(() => setSubView("feedbacks"), 0);
    } else if (subViewProp === "profile") {
      setTimeout(() => setSubView("profile"), 0);
    } else if (subViewProp === "plans") {
      setTimeout(() => setSubView("plans"), 0);
    } else {
      setTimeout(() => setSubView("overview"), 0);
    }
  }, [subViewProp, currentUser, navigate, profiles, isLoadingProfiles]);

  // Handle pending plan upgrades on overview/dashboard load
  useEffect(() => {
    if (currentUser) {
      const pendingPlan = localStorage.getItem("pending_plan_checkout");
      if (pendingPlan) {
        localStorage.removeItem("pending_plan_checkout");
        setTimeout(() => handleUpgrade(pendingPlan), 0);
      }
    }
  }, [currentUser]);

  // Reset scroll position on view transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [subView]);

  // Clear builder form details
  const handleClearProfileForm = () => {
    setProfileName("");
    setProfileTitle("");
    setProfileCompany("");
    setProfileSlug("");
    setProfileBio("");
    setProfileEmail("");
    setProfilePhone("");
    setProfileWebsite("");
    setProfileAddress("");
    setProfileGst("");
    setProfileMapUrl("");
    setProfileTimings("");
    setSocialFacebook("");
    setSocialGoogle("");
    setSocialInstagram("");
    setSocialYoutube("");
    setSocialLinkedin("");
    setSocialX("");
    setSocialWhatsapp("");
    setSocialUPI("");
    setSocialOrder([
      "whatsapp",
      "facebook",
      "instagram",
      "youtube",
      "linkedin",
      "google",
      "x",
      "upi",
    ]);
    setBankUpiId("");
    setBankName("");
    setBankAccountNo("");
    setBankIfsc("");
    setBankAccountName("");
    setCustomLinks([]);
    setProfileDocuments([]);
    setSelectedFeedbacks([]);
    setHeaderColor("#2563eb");
    setProfileLogoFile(null);
  };

  // Save builder form details to Cloudinary & MongoDB
  const handleSaveProfileForm = async () => {
    // Basic validation for GST if provided
    if (profileGst) {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstRegex.test(profileGst.toUpperCase())) {
        alert("Invalid GST Number. Please check the 15-character GSTIN.");
        return;
      }
    }

    setIsSaving(true);
    setSaveSuccess(false);
    window.dispatchEvent(new CustomEvent("profileSaveStart"));

    try {
      const token = localStorage.getItem("oneqr_token");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 1. Upload new document files to Cloudinary
      let updatedDocs = [...profileDocuments];
      for (let i = 0; i < updatedDocs.length; i++) {
        const doc = updatedDocs[i];
        if (doc.file) {
          const formData = new FormData();
          formData.append("file", doc.file);

          if (doc.publicId) {
            formData.append("oldPublicId", doc.publicId);
          }

          const uploadRes = await fetch(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/profile/upload`,
            {
              method: "POST",
              headers,
              body: formData,
            },
          );

          if (!uploadRes.ok) {
            console.error("Upload failed with status:", uploadRes.status);
            throw new Error(
              `Failed to upload file "${doc.filename}". Please try again.`,
            );
          }

          const uploadData = await uploadRes.json();
          if (uploadData.status === "success") {
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

      setProfileDocuments(updatedDocs);

      let finalProfileLogo = profileLogo;
      if (profileLogoFile) {
        const logoFormData = new FormData();
        logoFormData.append("file", profileLogoFile);

        const logoUploadRes = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/profile/upload`,
          {
            method: "POST",
            headers,
            body: logoFormData,
          },
        );

        if (!logoUploadRes.ok) {
          throw new Error("Failed to upload business logo.");
        }

        const logoUploadData = await logoUploadRes.json();
        if (logoUploadData.status === "success") {
          finalProfileLogo = logoUploadData.data.url;
        }
      } else if (!profileLogo) {
        finalProfileLogo = "";
      }

      // 2. Build payload to save in MongoDB
      const payload = {
        profileId: activeProfileId,
        profileLogo: finalProfileLogo,
        qrUrl,
        qrColor,
        headerColor,
        profileCompany,
        slug: profileSlug,
        profileName,
        profileTitle,
        profileAddress,
        profileGst,
        profileMapUrl,
        profileTimings,
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
        bankUpiId,
        bankName,
        bankAccountNo,
        bankIfsc,
        bankAccountName,
        profileDocuments: updatedDocs.map((d) => ({
          id: d.id,
          label: d.label,
          filename: d.filename,
          size: d.size,
          url: d.url || "",
          publicId: d.publicId || "",
        })),
        customLinks: customLinks,
        selectedFeedbacks: selectedFeedbacks.map((f) => f._id || f),
      };

      // 3. Save to MongoDB
      await apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      // Refresh profiles list
      try {
        const response = await apiRequest("/profile/all", { method: "GET" });
        if (response.status === "success" && response.data?.profiles) {
          setProfiles(response.data.profiles);
        }
      } catch (profileRefreshErr) {
        console.error(
          "Error refreshing profiles after save:",
          profileRefreshErr,
        );
      }

      setSaveSuccess(true);
      window.dispatchEvent(new CustomEvent("profileSaveSuccess"));
      setTimeout(() => {
        setSaveSuccess(false);
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      window.dispatchEvent(new CustomEvent("profileSaveError"));
      console.error("Error saving profile settings:", err);
      alert(err.message || "Error occurred while saving profile settings.");
    } finally {
      setIsSaving(false);
    }
  };

  // Launch standalone browser demo session
  const handleLaunchMobileDemo = () => {
    const companyName = profileCompany || profileName || "demo-profile";
    const companySlug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const demoData = {
      profileCompany,
      profileName,
      profileTitle,
      profileAddress,
      profileMapUrl,
      profileTimings,
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
      plan: profilePlan,
      selectedFeedbacks,
      customLinks: customLinks.filter((link) => link.label && link.url),
      profileDocuments: profileDocuments
        .filter((doc) => doc.filename && (doc.file || doc.url))
        .map((d) => ({
          id: d.id,
          label: d.label,
          filename: d.filename,
          size: d.size,
          url: d.url || (d.file ? URL.createObjectURL(d.file) : ""),
        })),
    };

    sessionStorage.setItem("oneqr_demo_profile_data", JSON.stringify(demoData));
    sessionStorage.setItem("oneqr_demo_authorized", "true");

    // Launch beautiful standalone demo page in new tab
    window.open("/" + companySlug, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-28 md:pb-16 px-4 md:px-8 relative overflow-hidden text-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8 relative">
        {subView === "overview" && (
          <OverviewTab
            isLoadingProfiles={isLoadingProfiles}
            profiles={profiles}
            onManageProfile={handleSelectAndManageProfile}
            onConnectStandy={(profileId) => {
              setConnectModalProfileId(profileId);
              setShowConnectModal(true);
            }}
            currentUser={currentUser}
          />
        )}

        {subView === "qr-scan" && (
          <QrScanTab
            onSelectAndManageQr={handleSelectAndManageQr}
            onRefreshQrs={fetchProfilesAndQrs}
          />
        )}

        {subView === "feedbacks" && <FeedbacksTab />}

        {subView === "profile" && <ProfileTab profiles={profiles} />}

        {subView === "plans" && (
          <PlansTab
            onUpgrade={handleUpgrade}
            isPaymentLoading={isPaymentLoading}
            currentUser={currentUser}
          />
        )}

        {subView === "manage-qr" && (
          <ManageQrTab
            activeQrId={activeQrId}
            isSaving={isSaving}
            saveSuccess={saveSuccess}
            profileLogo={profileLogo}
            setProfileLogo={setProfileLogo}
            setProfileLogoFile={setProfileLogoFile}
            headerColor={headerColor}
            setHeaderColor={setHeaderColor}
            qrUrl={qrUrl}
            setQrUrl={setQrUrl}
            qrColor={qrColor}
            setQrColor={setQrColor}
            profileCompany={profileCompany}
            setProfileCompany={setProfileCompany}
            profileSlug={profileSlug}
            setProfileSlug={setProfileSlug}
            profileName={profileName}
            setProfileName={setProfileName}
            profileTitle={profileTitle}
            setProfileTitle={setProfileTitle}
            profileBio={profileBio}
            setProfileBio={setProfileBio}
            profileEmail={profileEmail}
            setProfileEmail={setProfileEmail}
            profilePhone={profilePhone}
            setProfilePhone={setProfilePhone}
            profileWebsite={profileWebsite}
            setProfileWebsite={setProfileWebsite}
            profileAddress={profileAddress}
            setProfileAddress={setProfileAddress}
            profileGst={profileGst}
            setProfileGst={setProfileGst}
            profileMapUrl={profileMapUrl}
            setProfileMapUrl={setProfileMapUrl}
            profileTimings={profileTimings}
            setProfileTimings={setProfileTimings}
            socialFacebook={socialFacebook}
            setSocialFacebook={setSocialFacebook}
            socialGoogle={socialGoogle}
            setSocialGoogle={setSocialGoogle}
            socialInstagram={socialInstagram}
            setSocialInstagram={setSocialInstagram}
            socialYoutube={socialYoutube}
            setSocialYoutube={setSocialYoutube}
            socialLinkedin={socialLinkedin}
            setSocialLinkedin={setSocialLinkedin}
            socialX={socialX}
            setSocialX={setSocialX}
            socialWhatsapp={socialWhatsapp}
            setSocialWhatsapp={setSocialWhatsapp}
            socialUPI={socialUPI}
            setSocialUPI={setSocialUPI}
            socialOrder={socialOrder}
            setSocialOrder={setSocialOrder}
            bankUpiId={bankUpiId}
            setBankUpiId={setBankUpiId}
            bankName={bankName}
            setBankName={setBankName}
            bankAccountNo={bankAccountNo}
            setBankAccountNo={setBankAccountNo}
            bankIfsc={bankIfsc}
            setBankIfsc={setBankIfsc}
            bankAccountName={bankAccountName}
            setBankAccountName={setBankAccountName}
            customLinks={customLinks}
            setCustomLinks={setCustomLinks}
            profileDocuments={profileDocuments}
            setProfileDocuments={setProfileDocuments}
            selectedFeedbacks={selectedFeedbacks}
            setSelectedFeedbacks={setSelectedFeedbacks}
            profilePlan={profilePlan}
            handleClearProfileForm={handleClearProfileForm}
            handleSaveProfileForm={handleSaveProfileForm}
          />
        )}
      </div>

      {/* Payment Modals & Overlays */}
      <MockPaymentModal
        isOpen={showMockModal}
        onClose={() => {
          setShowMockModal(false);
          setMockPaymentData(null);
        }}
        mockPaymentData={mockPaymentData}
        isPaymentLoading={isPaymentLoading}
        onCompleteMockPayment={handleCompleteMockPayment}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setSubView("overview");
          navigate("/dashboard");
        }}
        successPlanName={successPlanName}
      />

      <ConnectStandyModal
        isOpen={showConnectModal}
        onClose={() => {
          setShowConnectModal(false);
          setConnectModalProfileId(null);
        }}
        profileId={connectModalProfileId}
        onSuccess={fetchProfilesAndQrs}
      />

      <ClaimQrModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onSuccess={fetchProfilesAndQrs}
      />

      {/* Razorpay Test Mode Helper Warning Modal */}
      {showTestModeHelper && pendingTestData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white  border border-slate-200  rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 text-slate-900 ">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/5">
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div className="space-y-2 text-center">
              <h3 className="font-extrabold text-xl tracking-tight">
                Razorpay Test Mode Info
              </h3>
              <p className="text-xs text-slate-500  leading-relaxed">
                You are paying in **Razorpay Test Mode**. Real UPI apps
                (GPay/PhonePe) will report{" "}
                <span className="text-red-500 font-bold">
                  "Cannot pay / UPI ID is invalid"
                </span>{" "}
                if you try to scan the Test QR code.
              </p>
            </div>

            <div className="p-4 bg-slate-50  border border-slate-200  rounded-2xl text-xs space-y-3 leading-relaxed text-left font-semibold">
              <strong className="text-slate-700  font-extrabold block uppercase tracking-wider text-[10px] mb-1.5">
                How to complete mock payment:
              </strong>
              <div className="space-y-2.5 text-slate-600 ">
                <p className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 text-[10px] font-black mt-0.5">
                    1
                  </span>
                  <span>
                    Select **UPI / QR** &rarr; **UPI ID/VPA** (instead of QR)
                    and enter{" "}
                    <code className="bg-blue-500/15 text-blue-600  px-1 py-0.5 rounded font-mono">
                      success@razorpay
                    </code>
                    .
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 text-[10px] font-black mt-0.5">
                    2
                  </span>
                  <span>
                    Or choose **Card** and type card number{" "}
                    <code className="bg-blue-500/15 text-blue-600  px-1 py-0.5 rounded font-mono">
                      4111 1111 1111 1111
                    </code>{" "}
                    (use any future expiry and CVV).
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 text-[10px] font-black mt-0.5">
                    3
                  </span>
                  <span>
                    Or choose **Netbanking** & select **Success** on the mock
                    bank page.
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowTestModeHelper(false);
                  setPendingTestData(null);
                }}
                className="flex-1 py-3 border border-slate-200  bg-slate-50  hover:bg-slate-100  text-slate-700  font-bold text-xs rounded-2xl transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const { orderData, planId } = pendingTestData;
                  setShowTestModeHelper(false);
                  setPendingTestData(null);
                  openRazorpayCheckout(orderData, planId);
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer text-center shadow-lg shadow-blue-500/25 border border-transparent"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
