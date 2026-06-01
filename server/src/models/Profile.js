const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    isStandyConnected: {
      type: Boolean,
      default: false,
    },
    qrId: {
      type: String,
      default: null,
    },

    profileLogo: {
      type: String,
      default: "",
    },
    qrColor: {
      type: String,
      default: "000000",
    },
    headerColor: {
      type: String,
      default: "gradient",
    },
    profileCompany: {
      type: String,
      default: "",
    },
    profileName: {
      type: String,
      default: "",
    },
    profileTitle: {
      type: String,
      default: "",
    },

    profileAddress: {
      type: String,
      default: "",
    },
    profileMapUrl: {
      type: String,
      default: "",
    },
    profileTimings: {
      type: String,
      default: "",
    },
    profileBio: {
      type: String,
      default: "",
    },
    profileEmail: {
      type: String,
      default: "",
    },
    profilePhone: {
      type: String,
      default: "",
    },
    profileWebsite: {
      type: String,
      default: "",
    },
    socialFacebook: {
      type: String,
      default: "",
    },
    socialGoogle: {
      type: String,
      default: "",
    },
    socialInstagram: {
      type: String,
      default: "",
    },
    socialYoutube: {
      type: String,
      default: "",
    },
    socialLinkedin: {
      type: String,
      default: "",
    },
    socialX: {
      type: String,
      default: "",
    },
    socialWhatsapp: {
      type: String,
      default: "",
    },
    socialUPI: {
      type: String,
      default: "",
    },
    socialOrder: {
      type: [String],
      default: ['facebook', 'google', 'instagram', 'youtube', 'linkedin', 'x', 'whatsapp', 'upi'],
    },
    bankUpiId: {
      type: String,
      default: "",
    },
    bankName: {
      type: String,
      default: "",
    },
    bankAccountNo: {
      type: String,
      default: "",
    },
    bankIfsc: {
      type: String,
      default: "",
    },
    bankAccountName: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
    },
    customLinks: [
      {
        id: Number,
        label: String,
        url: String,
      },
    ],
    profileDocuments: [
      {
        id: Number,
        label: String,
        filename: String,
        size: String,
        url: String,
        publicId: String,
      },
    ],
    selectedFeedbacks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feedback",
      },
    ],
  },
  {
    timestamps: true,
    collection: "PROFILES",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProfileSchema.virtual("qrUrl").get(function() {
  const config = require("../config/config");
  if (this.isStandyConnected && this.qrId) {
    return `${config.QR_URL_PREFIX}/${this.qrId}`;
  }
  if (this.slug) {
    return `${config.QR_URL_PREFIX}/${this.slug}`;
  }
  return "https://oneqr.co/user/profile";
});

ProfileSchema.index(
  { user: 1, slug: 1 },
  { 
    unique: true, 
    partialFilterExpression: { 
      slug: { $type: "string", $gt: "" } 
    } 
  }
);

module.exports = mongoose.model("Profile", ProfileSchema);
