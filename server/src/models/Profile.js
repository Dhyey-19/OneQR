const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    profileLogo: {
      type: String,
      default: "",
    },
    qrUrl: {
      type: String,
      default: "https://oneqr.co/user/profile",
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
  },
  {
    timestamps: true,
    collection: "PROFILES",
  }
);

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
