const express = require("express");
const User = require("../models/User");

const router = express.Router();

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

module.exports = router;