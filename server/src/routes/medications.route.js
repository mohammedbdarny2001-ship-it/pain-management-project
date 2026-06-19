const express = require("express");
const Medication = require("../models/Medication");

const router = express.Router();

// Add medication reminder
router.post("/", async (req, res) => {
  try {
    const { patientUsername, medicationName, dose, time, notes } = req.body;

    if (!patientUsername || !medicationName || !dose || !time) {
      return res.status(400).json({
        success: false,
        message: "Patient username, medication name, dose and time are required",
      });
    }

    const newMedication = new Medication({
      patientUsername,
      medicationName,
      dose,
      time,
      notes,
      taken: false,
    });

    await newMedication.save();

    res.status(201).json({
      success: true,
      message: "Medication reminder saved successfully",
      medication: newMedication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while saving medication reminder",
      error: error.message,
    });
  }
});

// Get medications by patient username
router.get("/:username", async (req, res) => {
  try {
    const medications = await Medication.find({
      patientUsername: req.params.username,
    }).sort({ time: 1 });

    res.json({
      success: true,
      medications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching medications",
      error: error.message,
    });
  }
});

// Mark medication as taken
router.put("/:id/taken", async (req, res) => {
  try {
    const medication = await Medication.findByIdAndUpdate(
      req.params.id,
      { taken: true },
      { new: true }
    );

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: "Medication reminder not found",
      });
    }

    res.json({
      success: true,
      message: "Medication marked as taken",
      medication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating medication",
      error: error.message,
    });
  }
});

// Delete medication reminder
router.delete("/:id", async (req, res) => {
  try {
    const medication = await Medication.findByIdAndDelete(req.params.id);

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: "Medication reminder not found",
      });
    }

    res.json({
      success: true,
      message: "Medication reminder deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting medication",
      error: error.message,
    });
  }
});

module.exports = router;