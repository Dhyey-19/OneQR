const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      minlength: [8, "Phone number must be at least 8 digits"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
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
    orderHistory: [
      {
        orderId: { type: String },
        paymentId: { type: String },
        planId: { type: String },
        planName: { type: String },
        amount: { type: Number },
        status: { type: String },
        paidAt: { type: Date, default: Date.now },
      }
    ]
  },
  {
    timestamps: true,
    collection: "USERS", // Storing in the USERS collection as requested
  }
);

// Hash the password before saving a new/modified user
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare candidate password with hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
