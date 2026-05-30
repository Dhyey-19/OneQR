const config = require("../config/config");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");
const { UserResponseDto } = require("../dtos/userDto");

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
  basic_yearly: { amount: 49900, name: "Basic Plan - 1 Year", durationDays: 365 },
  basic_3yearly: { amount: 99900, name: "Basic Plan - 3 Years", durationDays: 1095 },
  premium_yearly: { amount: 99900, name: "Premium Plan - 1 Year", durationDays: 365 },
  premium_3yearly: { amount: 199900, name: "Premium Plan - 3 Years", durationDays: 1095 },
  enterprise_yearly: { amount: 249900, name: "Enterprise Plan - 1 Year", durationDays: 365 },
  enterprise_3yearly: { amount: 499900, name: "Enterprise Plan - 3 Years", durationDays: 1095 },
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

      // Record transaction history
      if (!user.orderHistory) {
        user.orderHistory = [];
      }
      user.orderHistory.push({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId || `mock_pay_${Date.now()}`,
        planId: planId,
        planName: plan.name,
        amount: plan.amount / 100,
        status: "success",
        paidAt: new Date(),
      });

      await user.save();

      return res.status(200).json({
        status: "success",
        message: `Payment successful! Upgraded to ${plan.name}.`,
        data: {
          user: UserResponseDto.transform(user),
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
