import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/apiService';
import { authService } from '../services/authService';

const qrUrlPrefix = import.meta.env.VITE_QR_URL_PREFIX || 'https://oneqr.dtechcode.in';

// Dashboard Sub-components & Tabs
import OverviewTab from '../components/dashboard/OverviewTab';
// BillingTab removed
import QrScanTab from '../components/dashboard/QrScanTab';
import ManageQrTab from '../components/dashboard/ManageQrTab';
import FeedbacksTab from '../components/dashboard/FeedbacksTab';
import MockPaymentModal from '../components/dashboard/MockPaymentModal';
import SuccessModal from '../components/dashboard/SuccessModal';
import ClaimQrModal from '../components/dashboard/ClaimQrModal';

export default function DashboardPage({ subViewProp }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [subView, setSubView] = useState(subViewProp || 'overview');
  const [allocatedQrs, setAllocatedQrs] = useState([]);
  const [isLoadingQrs, setIsLoadingQrs] = useState(false);
  const [activeQrId, setActiveQrId] = useState(null);

  // Modal display toggles
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showMockModal, setShowMockModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Billing & Payment States
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [mockPaymentData, setMockPaymentData] = useState(null);
  const [successPlanName, setSuccessPlanName] = useState('');
  const [showTestModeHelper, setShowTestModeHelper] = useState(false);
  const [pendingTestData, setPendingTestData] = useState(null);

  // Digital Profile Form States
  const [profileLogo, setProfileLogo] = useState('');
  const [headerColor, setHeaderColor] = useState('gradient');
  const [qrUrl, setQrUrl] = useState('https://oneqr.co/user/profile');
  const [qrColor, setQrColor] = useState('000000'); 
  const [profileName, setProfileName] = useState('');
  const [profileTitle, setProfileTitle] = useState('');
  const [profileCompany, setProfileCompany] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileWebsite, setProfileWebsite] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileMapUrl, setProfileMapUrl] = useState('');
  const [profileTimings, setProfileTimings] = useState('');

  // Social Links States
  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialGoogle, setSocialGoogle] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialYoutube, setSocialYoutube] = useState('');
  const [socialLinkedin, setSocialLinkedin] = useState('');
  const [socialX, setSocialX] = useState('');
  const [socialWhatsapp, setSocialWhatsapp] = useState('');
  const [socialUPI, setSocialUPI] = useState('');
  const [socialOrder, setSocialOrder] = useState(['whatsapp', 'upi', 'facebook', 'instagram', 'youtube', 'linkedin', 'google', 'x']);

  // Custom lists & upload states
  const [customLinks, setCustomLinks] = useState([]);
  const [profileDocuments, setProfileDocuments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch specific profile settings for selected QR
  const fetchProfile = async (targetQrId) => {
    try {
      const url = targetQrId ? `/profile?qrId=${targetQrId}` : '/profile';
      const response = await apiRequest(url, { method: 'GET' });
      if (response.status === 'success' && response.data?.profile) {
        const profile = response.data.profile;
        setProfileLogo(profile.profileLogo || '');
        setHeaderColor(profile.headerColor || 'gradient');
        setQrUrl(profile.qrUrl || (targetQrId ? `${qrUrlPrefix}/${targetQrId}` : 'https://oneqr.co/user/profile'));
        setQrColor(profile.qrColor || '000000');
        setProfileCompany(profile.profileCompany || '');
        setProfileName(profile.profileName || '');
        setProfileTitle(profile.profileTitle || '');
        setProfileAddress(profile.profileAddress || '');
        setProfileMapUrl(profile.profileMapUrl || '');
        setProfileTimings(profile.profileTimings || '');
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
        } else {
          setSocialOrder(['whatsapp', 'upi', 'facebook', 'instagram', 'youtube', 'linkedin', 'google', 'x']);
        }
        setCustomLinks(profile.customLinks || []);
        setProfileDocuments(profile.profileDocuments || []);
      }
    } catch (err) {
      console.error('Error fetching profile settings:', err);
    }
  };

  // Main load allocated QR codes on mount
  const fetchQrsAndProfile = async () => {
    setIsLoadingQrs(true);
    try {
      const response = await apiRequest('/profile/qrs', { method: 'GET' });
      if (response.status === 'success' && response.data?.qrs) {
        const qrs = response.data.qrs;
        setAllocatedQrs(qrs);
        if (qrs.length > 0) {
          setActiveQrId(qrs[0].qrId);
          fetchProfile(qrs[0].qrId);
        } else {
          fetchProfile();
        }
      } else {
        fetchProfile();
      }
    } catch (err) {
      console.error('Error fetching assigned QRs:', err);
      fetchProfile();
    } finally {
      setIsLoadingQrs(false);
    }
  };

  // Initialize profile load on user change
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      fetchQrsAndProfile();

      // Fetch fresh user profile from server to keep session in-sync
      authService.getProfile()
        .then(freshUser => {
          setCurrentUser(freshUser);
        })
        .catch(err => {
          console.error('Failed to sync profile on mount:', err);
        });
    }
  }, []);

  // Sync route param changes
  useEffect(() => {
    if (isLoadingQrs) return; // Prevent redirecting on initial render before QRs load

    const activeQr = allocatedQrs.find(q => q.qrId === activeQrId) || allocatedQrs[0];
    const isSubscribed = !!activeQr;

    if (subViewProp === 'manage-qr') {
      if (!isSubscribed) {
        navigate('/dashboard', { replace: true });
        setSubView('overview');
      } else {
        setSubView('manage-qr');
      }
    } else if (subViewProp === 'billing') {
      navigate('/dashboard', { replace: true });
      setSubView('overview');
    } else if (subViewProp === 'overview') {
      setSubView('overview');
    } else if (subViewProp === 'qr-scan') {
      setSubView('qr-scan');
    } else if (subViewProp === 'feedbacks') {
      setSubView('feedbacks');
    } else {
      setSubView('overview');
    }
  }, [subViewProp, currentUser, navigate, allocatedQrs, activeQrId, isLoadingQrs]);

  // Handle pending plan upgrades on overview/dashboard load
  useEffect(() => {
    if (currentUser) {
      const pendingPlan = localStorage.getItem('pending_plan_checkout');
      if (pendingPlan) {
        localStorage.removeItem('pending_plan_checkout');
        handleUpgrade(pendingPlan);
      }
    }
  }, [currentUser]);

  // Reset scroll position on view transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [subView]);

  // Transition view to target QR settings
  const handleSelectAndManageQr = async (qrId) => {
    setActiveQrId(qrId);
    await fetchProfile(qrId);
    setSubView('manage-qr');
    navigate('/manage-qr');
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
          const verifyRes = await apiRequest('/payment/verify-payment', {
            method: 'POST',
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              planId,
              qrId: activeQrId,
            }),
          });

          if (verifyRes.status === 'success') {
            const updatedUser = await authService.getProfile();
            setCurrentUser(updatedUser);
            await fetchQrsAndProfile(); // Re-fetch updated QR code plans
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
  };

  const handleUpgrade = async (planId) => {
    setIsPaymentLoading(true);
    try {
      const res = await apiRequest('/payment/create-order', {
        method: 'POST',
        body: JSON.stringify({ planId, qrId: activeQrId }),
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
          // If using a Razorpay test key, show the helper instructions modal first
          if (orderData.keyId && orderData.keyId.startsWith('rzp_test_')) {
            setPendingTestData({ orderData, planId });
            setShowTestModeHelper(true);
          } else {
            openRazorpayCheckout(orderData, planId);
          }
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
          qrId: activeQrId,
        }),
      });

      if (verifyRes.status === 'success') {
        const updatedUser = await authService.getProfile();
        setCurrentUser(updatedUser);
        await fetchQrsAndProfile(); // Re-fetch updated QR code plans
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

  // Clear builder form details
  const handleClearProfileForm = () => {
    setProfileName('');
    setProfileTitle('');
    setProfileCompany('');
    setProfileBio('');
    setProfileEmail('');
    setProfilePhone('');
    setProfileWebsite('');
    setProfileAddress('');
    setProfileMapUrl('');
    setProfileTimings('');
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

  // Save builder form details to Cloudinary & MongoDB
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

          const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/profile/upload`, {
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
        profileDocuments: updatedDocs.map((d) => ({
          id: d.id,
          label: d.label,
          filename: d.filename,
          size: d.size,
          url: d.url || '',
          publicId: d.publicId || '',
        })),
        customLinks: customLinks,
        slug: activeQrId,
      };

      // 3. Save to MongoDB
      await apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      // Refresh QR codes list
      try {
        const response = await apiRequest('/profile/qrs', { method: 'GET' });
        if (response.status === 'success' && response.data?.qrs) {
          setAllocatedQrs(response.data.qrs);
        }
      } catch (qrRefreshErr) {
        console.error('Error refreshing QRs after profile save:', qrRefreshErr);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Error saving profile settings:', err);
      alert(err.message || 'Error occurred while saving profile settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Launch standalone browser demo session
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

  const handleRefreshQrs = async () => {
    const response = await apiRequest('/profile/qrs', { method: 'GET' });
    if (response.status === 'success' && response.data?.qrs) {
      setAllocatedQrs(response.data.qrs);
    }
  };

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-28 md:pb-16 px-4 md:px-8 relative overflow-hidden text-slate-900 dark:text-white transition-colors duration-300">
      {/* Background Glows */}
      <div className="absolute top-[10%] left-[-10vw] w-[40vw] h-[40vw] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10vw] w-[35vw] h-[35vw] rounded-full bg-indigo-600/5 blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {subView === 'overview' && (
          <OverviewTab 
            isLoadingQrs={isLoadingQrs}
            allocatedQrs={allocatedQrs}
            onManage={handleSelectAndManageQr}
            currentUser={currentUser}
          />
        )}

        {subView === 'qr-scan' && (
          <QrScanTab 
            onSelectAndManageQr={handleSelectAndManageQr}
            onRefreshQrs={handleRefreshQrs}
          />
        )}

        {subView === 'feedbacks' && (
          <FeedbacksTab />
        )}

        {subView === 'manage-qr' && (
          <ManageQrTab 
            activeQrId={activeQrId}
            isSaving={isSaving}
            saveSuccess={saveSuccess}
            profileLogo={profileLogo} setProfileLogo={setProfileLogo}
            headerColor={headerColor} setHeaderColor={setHeaderColor}
            qrUrl={qrUrl} setQrUrl={setQrUrl}
            qrColor={qrColor} setQrColor={setQrColor}
            profileCompany={profileCompany} setProfileCompany={setProfileCompany}
            profileName={profileName} setProfileName={setProfileName}
            profileTitle={profileTitle} setProfileTitle={setProfileTitle}
            profileBio={profileBio} setProfileBio={setProfileBio}
            profileEmail={profileEmail} setProfileEmail={setProfileEmail}
            profilePhone={profilePhone} setProfilePhone={setProfilePhone}
            profileWebsite={profileWebsite} setProfileWebsite={setProfileWebsite}
            profileAddress={profileAddress} setProfileAddress={setProfileAddress}
            profileMapUrl={profileMapUrl} setProfileMapUrl={setProfileMapUrl}
            profileTimings={profileTimings} setProfileTimings={setProfileTimings}
            socialFacebook={socialFacebook} setSocialFacebook={setSocialFacebook}
            socialGoogle={socialGoogle} setSocialGoogle={setSocialGoogle}
            socialInstagram={socialInstagram} setSocialInstagram={setSocialInstagram}
            socialYoutube={socialYoutube} setSocialYoutube={setSocialYoutube}
            socialLinkedin={socialLinkedin} setSocialLinkedin={setSocialLinkedin}
            socialX={socialX} setSocialX={setSocialX}
            socialWhatsapp={socialWhatsapp} setSocialWhatsapp={setSocialWhatsapp}
            socialUPI={socialUPI} setSocialUPI={setSocialUPI}
            socialOrder={socialOrder} setSocialOrder={setSocialOrder}
            customLinks={customLinks} setCustomLinks={setCustomLinks}
            profileDocuments={profileDocuments} setProfileDocuments={setProfileDocuments}
            handleClearProfileForm={handleClearProfileForm}
            handleSaveProfileForm={handleSaveProfileForm}
            handleLaunchMobileDemo={handleLaunchMobileDemo}
          />
        )}
      </div>

      {/* Payment Modals & Overlays */}
      <MockPaymentModal 
        isOpen={showMockModal}
        onClose={() => { setShowMockModal(false); setMockPaymentData(null); }}
        mockPaymentData={mockPaymentData}
        isPaymentLoading={isPaymentLoading}
        onCompleteMockPayment={handleCompleteMockPayment}
      />

      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          handleSelectAndManageQr(activeQrId);
        }}
        successPlanName={successPlanName}
      />

      <ClaimQrModal 
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onSuccess={handleRefreshQrs}
      />

      {/* Razorpay Test Mode Helper Warning Modal */}
      {showTestModeHelper && pendingTestData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 text-slate-900 dark:text-white">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/5">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div className="space-y-2 text-center">
              <h3 className="font-extrabold text-xl tracking-tight">Razorpay Test Mode Info</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You are paying in **Razorpay Test Mode**. Real UPI apps (GPay/PhonePe) will report <span className="text-red-500 font-bold">"Cannot pay / UPI ID is invalid"</span> if you try to scan the Test QR code.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl text-xs space-y-3 leading-relaxed text-left font-semibold">
              <strong className="text-slate-700 dark:text-slate-200 font-extrabold block uppercase tracking-wider text-[10px] mb-1.5">How to complete mock payment:</strong>
              <div className="space-y-2.5 text-slate-600 dark:text-slate-350">
                <p className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 text-[10px] font-black mt-0.5">1</span>
                  <span>Select **UPI / QR** &rarr; **UPI ID/VPA** (instead of QR) and enter <code className="bg-blue-500/15 text-blue-600 dark:text-blue-300 px-1 py-0.5 rounded font-mono">success@razorpay</code>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 text-[10px] font-black mt-0.5">2</span>
                  <span>Or choose **Card** and type card number <code className="bg-blue-500/15 text-blue-600 dark:text-blue-300 px-1 py-0.5 rounded font-mono">4111 1111 1111 1111</code> (use any future expiry and CVV).</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 text-[10px] font-black mt-0.5">3</span>
                  <span>Or choose **Netbanking** & select **Success** on the mock bank page.</span>
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
                className="flex-1 py-3 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-350 font-bold text-xs rounded-2xl transition-all cursor-pointer text-center"
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
