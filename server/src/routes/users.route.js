const express = require("express");
const User = require("../models/User");
const PainReport = require("../models/PainReport");
const Medication = require("../models/Medication");
const DoctorNote = require("../models/DoctorNote");

const router = express.Router();
async function isAdmin(adminUsername) {
  if (!adminUsername) {
    return false;
  }

  const admin = await User.findOne({
    username: adminUsername,
    role: "admin",
  });

  return Boolean(admin);
}

function removePassword(user) {
  return {
    username: user.username,
    role: user.role,
    name: user.name,
    age: user.age,
    diagnosis: user.diagnosis,
    physician: user.physician,
  };
}

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, password, role, name, age, diagnosis, physician } = req.body;

    if (!username || !password || !role || !name) {
      return res.status(400).json({
        success: false,
        message: "Username, password, role and name are required",
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const newUser = new User({
      username,
      password,
      role,
      name,
      age,
      diagnosis,
      physician,
    });

    await newUser.save();

    const userWithoutPassword = {
      username: newUser.username,
      role: newUser.role,
      name: newUser.name,
      age: newUser.age,
      diagnosis: newUser.diagnosis,
      physician: newUser.physician,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while registering user",
      error: error.message,
    });
  }
});


// Register new doctor by admin
router.post("/register-doctor", async (req, res) => {
  try {
    const { username, password, name, specialization, phone, email } = req.body;

    if (!username || !password || !name || !specialization) {
      return res.status(400).json({
        success: false,
        message: "Username, password, name and specialization are required",
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const newDoctor = new User({
      username,
      password,
      role: "doctor",
      name,
      specialization,
      phone,
      email,
    });

    await newDoctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully",
      doctor: {
        username: newDoctor.username,
        role: newDoctor.role,
        name: newDoctor.name,
        specialization: newDoctor.specialization,
        phone: newDoctor.phone,
        email: newDoctor.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while registering doctor",
      error: error.message,
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }
   

    const userWithoutPassword = {
      username: user.username,
      role: user.role,
      name: user.name,
      age: user.age,
      diagnosis: user.diagnosis,
      physician: user.physician,
    };

    res.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while logging in",
      error: error.message,
    });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
      error: error.message,
    });
  }
});

// Update user profile
router.put("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { name, age, diagnosis, physician, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    user.name = name.trim();

    if (age !== undefined) {
      user.age = age === "" ? undefined : Number(age);
    }

    if (diagnosis !== undefined) {
      user.diagnosis = diagnosis;
    }

    if (physician !== undefined) {
      user.physician = physician;
    }

    if (password && password.trim()) {
      user.password = password;
    }

    await user.save();

    const userWithoutPassword = {
      username: user.username,
      role: user.role,
      name: user.name,
      age: user.age,
      diagnosis: user.diagnosis,
      physician: user.physician,
    };

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: error.message,
    });
  }
});

// Get users by role
router.get("/by-role/:role", async (req, res) => {
  try {
    const { role } = req.params;

    if (!["patient", "doctor", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const users = await User.find({ role }, { password: 0 }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching users by role",
      error: error.message,
    });
  }
});

// Admin creates doctor or patient
router.post("/admin/create", async (req, res) => {
  try {
    const {
      adminUsername,
      username,
      password,
      role,
      name,
      age,
      diagnosis,
      physician,
    } = req.body;

    const allowed = await isAdmin(adminUsername);

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Only admin can perform this action",
      });
    }

    if (!["patient", "doctor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Admin can create only patient or doctor users",
      });
    }

    if (!username || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Username, password and name are required",
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const newUser = new User({
      username,
      password,
      role,
      name,
      age,
      diagnosis: role === "patient" ? diagnosis : "",
      physician: physician || "",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: `${role} created successfully`,
      user: removePassword(newUser),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating user",
      error: error.message,
    });
  }
});

// Admin deletes doctor or patient
router.delete("/admin/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { adminUsername } = req.body;

    const allowed = await isAdmin(adminUsername);

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Only admin can perform this action",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin users cannot be deleted from this panel",
      });
    }

    if (user.role === "patient") {
      await PainReport.deleteMany({ patientUsername: username });
      await Medication.deleteMany({ patientUsername: username });
      await DoctorNote.deleteMany({ patientUsername: username });
    }

    if (user.role === "doctor") {
      await DoctorNote.deleteMany({ doctorUsername: username });

      await User.updateMany(
        { role: "patient", physician: user.name },
        { $set: { physician: "" } }
      );
    }

    await User.deleteOne({ username });

    res.json({
      success: true,
      message: `${user.role} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting user",
      error: error.message,
    });
  }
});

// Admin assigns patient to another doctor
router.put("/admin/assign-doctor", async (req, res) => {
  try {
    const { adminUsername, patientUsername, doctorUsername } = req.body;

    const allowed = await isAdmin(adminUsername);

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Only admin can perform this action",
      });
    }

    const patient = await User.findOne({
      username: patientUsername,
      role: "patient",
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const doctor = await User.findOne({
      username: doctorUsername,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    patient.physician = doctor.name;
    await patient.save();

    res.json({
      success: true,
      message: "Patient doctor updated successfully",
      patient: removePassword(patient),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while assigning doctor",
      error: error.message,
    });
  }
});


module.exports = router;