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
  },
  {
    timestamps: true,
    collection: "ONEQRS",
  }
);

module.exports = mongoose.model("OneQr", OneQrSchema);
