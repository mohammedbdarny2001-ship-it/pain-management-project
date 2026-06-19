const mongoose = require("mongoose");

const doctorNoteSchema = new mongoose.Schema(
  {
    patientUsername: {
      type: String,
      required: true,
      trim: true,
    },
    doctorUsername: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DoctorNote", doctorNoteSchema);