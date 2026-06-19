const express = require("express");
const DoctorNote = require("../models/DoctorNote");

const router = express.Router();

// Add doctor note
router.post("/", async (req, res) => {
  try {
    const { patientUsername, doctorUsername, note } = req.body;

    if (!patientUsername || !doctorUsername || !note) {
      return res.status(400).json({
        success: false,
        message: "Patient username, doctor username and note are required",
      });
    }

    const newNote = new DoctorNote({
      patientUsername,
      doctorUsername,
      note,
    });

    await newNote.save();

    res.status(201).json({
      success: true,
      message: "Doctor note saved successfully",
      note: newNote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while saving doctor note",
      error: error.message,
    });
  }
});

// Get notes by patient username
router.get("/:username", async (req, res) => {
  try {
    const notes = await DoctorNote.find({
      patientUsername: req.params.username,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching doctor notes",
      error: error.message,
    });
  }
});

module.exports = router;