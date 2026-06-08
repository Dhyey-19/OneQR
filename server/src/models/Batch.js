const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema(
  {
    batchId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      default: function() {
        return `Batch ${this.batchId}`;
      }
    },
    qrCount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["ordered", "printed", "shipped", "delivered"],
      default: "ordered",
    },
    qrType: {
      type: String,
      enum: ["4x4", "4x6"],
      default: "4x6",
    },
  },
  {
    timestamps: true,
    collection: "BATCHES",
  }
);

module.exports = mongoose.model("Batch", BatchSchema);
