const express = require("express");
const PainReport = require("../models/PainReport");

const router = express.Router();

// Add new pain report
router.post("/", async (req, res) => {
  try {
    const {
      patientUsername,
      painLevel,
      location,
      painType,
      duration,
      medicationTaken,
      notes,
    } = req.body;

    if (
      !patientUsername ||
      painLevel === undefined ||
      !location ||
      !painType ||
      !duration
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required pain report fields",
      });
    }

    const newReport = new PainReport({
      patientUsername,
      painLevel,
      location,
      painType,
      duration,
      medicationTaken,
      notes,
    });

    await newReport.save();

    res.status(201).json({
      success: true,
      message: "Pain report saved successfully",
      report: newReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while saving pain report",
      error: error.message,
    });
  }
});

// Get all pain reports
router.get("/", async (req, res) => {
  try {
    const reports = await PainReport.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching pain reports",
      error: error.message,
    });
  }
});

// Get reports by patient username
router.get("/:username", async (req, res) => {
  try {
    const reports = await PainReport.find({
      patientUsername: req.params.username,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching patient reports",
      error: error.message,
    });
  }
});

module.exports = router;