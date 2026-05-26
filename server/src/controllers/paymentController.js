const config = require("../config/config");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");

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
  starter_monthly: { amount: 100, name: "Starter Plan - Monthly", durationDays: 30 },
  starter_yearly: { amount: 100, name: "Starter Plan - Yearly", durationDays: 365 },
  pro_monthly: { amount: 100, name: "Pro Plan - Monthly", durationDays: 30 },
  pro_yearly: { amount: 100, name: "Pro Plan - Yearly", durationDays: 365 },
};

/**
 * Creates a Razorpay Order
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

    if (razorpayInstance) {
      // Create actual order with Razorpay API
      const order = await razorpayInstance.orders.create(orderOptions);
      
      // Save pending order ID to user record
      await User.findByIdAndUpdate(req.user._id, { razorpayOrderId: order.id });

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
      await User.findByIdAndUpdate(req.user._id, { razorpayOrderId: mockOrderId });

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
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, planId } = req.body;
    const plan = plansConfig[planId];
    if (!plan) {
      return res.status(400).json({
        status: "error",
        message: "Invalid plan selection.",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.razorpayOrderId !== razorpayOrderId) {
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
      // Calculate subscription expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + plan.durationDays);

      // Save user details
      user.plan = planId;
      user.subscriptionStatus = "active";
      user.subscriptionExpiresAt = expiresAt;
      user.razorpayPaymentId = razorpayPaymentId || `mock_pay_${Date.now()}`;
      await user.save();

      return res.status(200).json({
        status: "success",
        message: `Payment successful! Upgraded to ${plan.name}.`,
        data: {
          user: {
            id: user._id,
            phone: user.phone,
            plan: user.plan,
            subscriptionStatus: user.subscriptionStatus,
            subscriptionExpiresAt: user.subscriptionExpiresAt,
          },
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
