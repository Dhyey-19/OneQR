const User = require("../models/User");

// @desc    Register a new user
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
  const { phone, password } = req.body;

  // 1. Validation
  if (!phone || !password) {
    return res.status(400).json({
      status: "error",
      message: "Please provide both mobile number and password.",
    });
  }

  if (phone.length < 8) {
    return res.status(400).json({
      status: "error",
      message: "Mobile number must be at least 8 digits.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      status: "error",
      message: "Password must be at least 6 characters.",
    });
  }

  try {
    // 2. Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "An account with this mobile number already exists.",
      });
    }

    // 3. Create new user
    const newUser = new User({
      phone,
      password,
    });

    await newUser.save();

    res.status(201).json({
      status: "success",
      message: "Account created successfully! You can now log in.",
      user: {
        id: newUser._id,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.log("Signup error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Server error occurred during signup. Please try again.",
    });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { phone, password } = req.body;

  // 1. Validation
  if (!phone || !password) {
    return res.status(400).json({
      status: "error",
      message: "Please provide both mobile number and password.",
    });
  }

  try {
    // 2. Check if user exists
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "No account found with this mobile number. Please sign up first.",
      });
    }

    // 3. Match password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Incorrect password. Please try again.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Login successful! Welcome back to OneQR.",
      user: {
        id: user._id,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Server error occurred during login. Please try again.",
    });
  }
};
