const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    feedbackText: {
      type: String,
      default: "",
    },
    customerName: {
      type: String,
      default: "",
    },
    customerPhone: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "FEEDBACKS",
  }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
