const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/config");

/**
 * Generates a signed JWT for a given user ID
 * @param {string} userId 
 * @returns {string} jwt token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

/**
 * Handles signup logic
 * @param {Object} userData 
 * @param {string} userData.phone
 * @param {string} userData.password
 * @returns {Promise<Object>} Object containing user document and signed JWT
 */
const signup = async ({ phone, password }) => {
  // 1. Check if user already exists
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    const error = new Error("An account with this mobile number already exists.");
    error.status = 400;
    throw error;
  }

  // 2. Create new user
  const newUser = new User({
    phone,
    password,
  });

  await newUser.save();

  // 3. Generate token
  const token = generateToken(newUser._id);

  return {
    user: newUser,
    token,
  };
};

/**
 * Handles login logic
 * @param {Object} credentials
 * @param {string} credentials.phone
 * @param {string} credentials.password
 * @returns {Promise<Object>} Object containing user document and signed JWT
 */
const login = async ({ phone, password }) => {
  // 1. Find the user
  const user = await User.findOne({ phone });
  if (!user) {
    const error = new Error("No account found with this mobile number. Please sign up first.");
    error.status = 404;
    throw error;
  }

  // 2. Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error("Incorrect password. Please try again.");
    error.status = 400;
    throw error;
  }

  // 3. Generate token
  const token = generateToken(user._id);

  return {
    user,
    token,
  };
};

/**
 * Finds user details by ID
 * @param {string} userId 
 * @returns {Promise<Object>}
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    throw error;
  }
  return user;
};
module.exports = {
  generateToken,
  signup,
  login,
  getUserById,
};
