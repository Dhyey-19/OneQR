const mongoose = require("mongoose");

const OneQrSchema = new mongoose.Schema(
  {
    qrId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
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
    qrScanCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "ONEQRS",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

OneQrSchema.virtual("qrUrl").get(function() {
  const config = require("../config/config");
  return `${config.QR_URL_PREFIX}/${this.qrId}`;
});

module.exports = mongoose.model("OneQr", OneQrSchema);
