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

// Pricing plans configuration
const plansConfig = {
  basic: { amount: 99900, name: "Basic Plan" },
  premium: { amount: 199900, name: "Premium Plan" },
  enterprise: { amount: 499900, name: "Enterprise Plan" },
};

/**
 * Creates a Razorpay Order and initializes a new inactive Profile slot.
 * @route POST /api/payment/create-order
 * @access Private
 */
exports.createOrder = async (req, res) => {
  try {
    const { planId } = req.body;
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

    const profileSlug = await generateUniqueProfileSlug();

    if (razorpayInstance) {
      // Create actual order with Razorpay API
      const order = await razorpayInstance.orders.create(orderOptions);
      
      // Always create a new inactive Profile slot for this plan purchase
      await Profile.create({
        user: req.user._id,
        plan: planId,
        subscriptionStatus: 'inactive',
        razorpayOrderId: order.id,
        slug: profileSlug,
        isStandyConnected: false,
        profilePhone: req.user.phone || "",
      });

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

      // Always create a new inactive Profile slot for this plan purchase
      await Profile.create({
        user: req.user._id,
        plan: planId,
        subscriptionStatus: 'inactive',
        razorpayOrderId: mockOrderId,
        slug: profileSlug,
        isStandyConnected: false,
        profilePhone: req.user.phone || "",
      });

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
 * Verifies Razorpay payment signature and activates the purchased Profile slot
 * @route POST /api/payment/verify-payment
 * @access Private
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, planId } = req.body;
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

    // Verify order matches user
    const profile = await Profile.findOne({ razorpayOrderId, user: req.user._id });
    if (!profile) {
      return res.status(400).json({
        status: "error",
        message: "Session or order verification mismatch.",
      });
    }

    let verified = false;

    if (razorpayInstance) {
      // Verify signature using crypto HMAC SHA255
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
      // Activate the profile slot
      profile.plan = planId;
      profile.subscriptionStatus = "active";
      profile.subscriptionExpiresAt = null;
      profile.razorpayPaymentId = razorpayPaymentId || `mock_pay_${Date.now()}`;
      await profile.save();

      // Record transaction history
      if (!user.orderHistory) {
        user.orderHistory = [];
      }
      user.orderHistory.push({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId || `mock_pay_${Date.now()}`,
        planId: planId,
        planName: `${plan.name} (Profile Purchase)`,
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
