const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    patientUsername: {
      type: String,
      required: true,
      trim: true,
    },
    medicationName: {
      type: String,
      required: true,
      trim: true,
    },
    dose: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      default: "",
    },
    taken: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Medication", medicationSchema);