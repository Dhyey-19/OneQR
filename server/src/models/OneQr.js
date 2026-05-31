const mongoose = require("mongoose");

const OneQrSchema = new mongoose.Schema(
  {
    qrId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    qrUrl: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    plan: {
      type: String,
      enum: ['free', 'basic_yearly', 'basic_3yearly', 'premium_yearly', 'premium_3yearly', 'enterprise_yearly', 'enterprise_3yearly'],
      default: 'free',
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    subscriptionExpiresAt: {
      type: Date,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    planAssignedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "ONEQRS",
  }
);

module.exports = mongoose.model("OneQr", OneQrSchema);
