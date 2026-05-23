const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    selectedTheme: {
      type: String,
      default: "midnight",
    },
    qrUrl: {
      type: String,
      default: "https://oneqr.co/user/profile",
    },
    qrColor: {
      type: String,
      default: "000000",
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
    profileLocation: {
      type: String,
      default: "",
    },
    profileAddress: {
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

module.exports = mongoose.model("Profile", ProfileSchema);
