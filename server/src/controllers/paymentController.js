const config = require("../config/config");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");
const OneQr = require("../models/OneQr");
const Profile = require("../models/Profile");
const { UserResponseDto } = require("../dtos/userDto");

const generateUniqueProfileSlug = async () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let attempt = 0;
  while (attempt < 100) {
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const existsProfile = await Profile.findOne({ slug: result });
    const existsQr = await OneQr.findOne({ qrId: result });
    if (!existsProfile && !existsQr) {
      return result;
    }
    attempt++;
  }
  return `profile_${Date.now()}`;
};

// Initialize Razorpay instance if keys are configured
let razorpayInstance = null;
if (config.RAZORPAY_KEY_ID && config.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: config.RAZORPAY_KEY_ID,
    key_secret: config.RAZORPAY_KEY_SECRET,
  });
}

// Pricing plans configuration (All priced at 1 Rupee = 100 Paise)
const plansConfig = {
  basic: { amount: 99900, name: "Basic Plan" },
  premium: { amount: 199900, name: "Premium Plan" },
  enterprise: { amount: 499900, name: "Enterprise Plan" },
};

/**
 * Creates a Razorpay Order
 * @route POST /api/payment/create-order
 * @access Private
 */
exports.createOrder = async (req, res) => {
  try {
    const { planId, qrId } = req.body;
    const plan = plansConfig[planId];
    if (!plan) {
      return res.status(400).json({
        status: "error",
        message: "Invalid plan selection.",
      });
    }

    const orderOptions = {
      amount: plan.amount, // amount in paisa (100 paise = 1 INR)
      currency: "INR",
      receipt: `rcpt_${req.user._id.toString().slice(-8)}_${Date.now().toString().slice(-8)}`,
    };

    if (razorpayInstance) {
      // Create actual order with Razorpay API
      const order = await razorpayInstance.orders.create(orderOptions);
      
      // Save pending order ID to QR Code record if provided, otherwise create inactive Profile slot
      if (qrId) {
        await OneQr.findOneAndUpdate({ qrId: qrId.trim(), assignedTo: req.user._id }, { razorpayOrderId: order.id });
      } else {
        const profileSlug = await generateUniqueProfileSlug();
        await Profile.create({
          user: req.user._id,
          plan: planId,
          subscriptionStatus: 'inactive',
          razorpayOrderId: order.id,
          slug: profileSlug,
          isStandyConnected: false,
          profilePhone: req.user.phone || "",
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: config.RAZORPAY_KEY_ID,
          planName: plan.name,
          isMock: false,
        },
      });
    } else {
      // Simulation/Sandbox mode if keys are not ready
      const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 15)}`;

      if (qrId) {
        await OneQr.findOneAndUpdate({ qrId: qrId.trim(), assignedTo: req.user._id }, { razorpayOrderId: mockOrderId });
      } else {
        const profileSlug = await generateUniqueProfileSlug();
        await Profile.create({
          user: req.user._id,
          plan: planId,
          subscriptionStatus: 'inactive',
          razorpayOrderId: mockOrderId,
          slug: profileSlug,
          isStandyConnected: false,
          profilePhone: req.user.phone || "",
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          orderId: mockOrderId,
          amount: plan.amount,
          currency: "INR",
          keyId: "rzp_test_mock_keys",
          planName: plan.name,
          isMock: true,
        },
      });
    }
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to initiate payment. Please try again.",
    });
  }
};

/**
 * Verifies Razorpay payment signature and updates user subscription plan
 * @route POST /api/payment/verify-payment
 * @access Private
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, planId, qrId } = req.body;
    const plan = plansConfig[planId];
    if (!plan) {
      return res.status(400).json({
        status: "error",
        message: "Invalid plan selection.",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    // Allow verification if matching razorpayOrderId is found on one of the user's QR codes or profiles
    const profileMatch = await Profile.findOne({ razorpayOrderId, user: req.user._id });
    const qrMatch = await OneQr.findOne({ razorpayOrderId, assignedTo: req.user._id });
    if (!profileMatch && !qrMatch) {
      return res.status(400).json({
        status: "error",
        message: "Session or order verification mismatch.",
      });
    }

    let verified = false;

    if (razorpayInstance) {
      // Verify signature using crypto HMAC SHA256
      const hmac = crypto.createHmac("sha256", config.RAZORPAY_KEY_SECRET);
      hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const generatedSignature = hmac.digest("hex");

      if (generatedSignature === razorpaySignature) {
        verified = true;
      }
    } else {
      // Sandbox verify
      if (razorpayOrderId.startsWith("order_mock_")) {
        verified = true;
      }
    }

    if (verified) {
      let profile = null;
      if (profileMatch) {
        profileMatch.plan = planId;
        profileMatch.subscriptionStatus = "active";
        profileMatch.subscriptionExpiresAt = null;
        profileMatch.razorpayPaymentId = razorpayPaymentId || `mock_pay_${Date.now()}`;
        await profileMatch.save();
        profile = profileMatch;
      }

      // Find the QR Code document
      let qr = null;
      if (qrId) {
        qr = await OneQr.findOne({ qrId: qrId.trim(), assignedTo: req.user._id });
      } else if (qrMatch) {
        qr = qrMatch;
      }

      if (qr) {
        qr.plan = planId;
        qr.subscriptionStatus = "active";
        qr.subscriptionExpiresAt = null;
        qr.razorpayPaymentId = razorpayPaymentId || `mock_pay_${Date.now()}`;
        qr.planAssignedByAdmin = false;
        await qr.save();

        // Also sync the associated profile
        let profileForQr = await Profile.findOne({ user: req.user._id, qrId: qr.qrId });
        if (!profileForQr) {
          profileForQr = await Profile.findOne({ user: req.user._id, slug: qr.qrId });
        }

        if (profileForQr) {
          profileForQr.plan = planId;
          profileForQr.subscriptionStatus = "active";
          profileForQr.razorpayPaymentId = razorpayPaymentId || `mock_pay_${Date.now()}`;
          profileForQr.qrId = qr.qrId;
          profileForQr.isStandyConnected = true;
          await profileForQr.save();
          profile = profileForQr;
        } else {
          const profileSlug = await generateUniqueProfileSlug();
          profile = await Profile.create({
            user: req.user._id,
            plan: planId,
            subscriptionStatus: "active",
            razorpayOrderId,
            razorpayPaymentId: razorpayPaymentId || `mock_pay_${Date.now()}`,
            slug: profileSlug,
            qrId: qr.qrId,
            isStandyConnected: true,
            profilePhone: req.user.phone || "",
          });
        }
      }

      // Record transaction history
      if (!user.orderHistory) {
        user.orderHistory = [];
      }
      user.orderHistory.push({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId || `mock_pay_${Date.now()}`,
        planId: planId,
        planName: qr ? `${plan.name} (QR: ${qr.qrId})` : `${plan.name} (Direct Purchase)`,
        amount: plan.amount / 100,
        status: "success",
        paidAt: new Date(),
      });

      await user.save();

      return res.status(200).json({
        status: "success",
        message: `Payment successful! Activated ${plan.name}.`,
        data: {
          user: UserResponseDto.transform(user),
          qr: qr,
          profile: profile,
        },
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Signature verification failed. Invalid payment signature.",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      status: "error",
      message: "Error verifying payment signature. Please try again.",
    });
  }
};
