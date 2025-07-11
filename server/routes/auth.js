const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Allowed Domains for Email Validation
const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];

// Register Route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Email format and domain validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address" });
  }

  const domain = email.split("@")[1];
  if (!allowedDomains.includes(domain)) {
    return res.status(400).json({ error: "Please enter a valid email address" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "Registration successful. Please login.",
      token,
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Required fields check
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Email format and domain validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address" });
  }

  const domain = email.split("@")[1];
  if (!allowedDomains.includes(domain)) {
    return res.status(400).json({ error: "Please enter a valid email address" });
  }

  try {
    const user = await User.findOne({ email });

    // Email not registered
    if (!user) {
      return res.status(404).json({ error: "Please register first" });
    }

    // Password wrong
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Email and password correct
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;