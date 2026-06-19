const mongoose = require("mongoose");

const painReportSchema = new mongoose.Schema(
  {
    patientUsername: {
      type: String,
      required: true,
      trim: true,
    },
    painLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    painType: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    medicationTaken: {
      type: String,
      default: "No",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PainReport", painReportSchema);