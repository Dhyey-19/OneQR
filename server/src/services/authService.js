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

const https = require('https');

/**
 * Helper to verify Google ID Token with Google's API
 */
const verifyGoogleToken = (idToken) => {
  return new Promise((resolve, reject) => {
    https.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error_description || 'Invalid Google credential token.'));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

/**
 * Handles Google authentication sign in / registration logic using ID token
 * @param {Object} data
 * @param {string} data.token
 * @returns {Promise<Object>} Object containing user document and signed JWT
 */
const googleLogin = async ({ token: googleToken }) => {
  if (!googleToken) {
    const error = new Error("Google credential token is required.");
    error.status = 400;
    throw error;
  }

  // 1. Verify token with Google's API
  let payload;
  try {
    payload = await verifyGoogleToken(googleToken);
  } catch (err) {
    const error = new Error(err.message || "Failed to verify Google account credentials.");
    error.status = 401;
    throw error;
  }

  const { email } = payload;
  if (!email) {
    const error = new Error("No email address returned from Google account.");
    error.status = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();

  // 2. Check if email already exists in records
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error("This Gmail account is already in use. Please use another Gmail account.");
    error.status = 400;
    throw error;
  }

  // 3. Since not used in any records, save new record
  let phone = "";
  let isPhoneUnique = false;
  while (!isPhoneUnique) {
    phone = "9" + Math.floor(100000000 + Math.random() * 900000000); // 10 digit number
    const duplicate = await User.findOne({ phone });
    if (!duplicate) {
      isPhoneUnique = true;
    }
  }

  const tempPassword = Math.random().toString(36).substring(2, 15);

  const newUser = new User({
    email: normalizedEmail,
    phone,
    password: tempPassword,
    plan: "free",
    subscriptionStatus: "inactive",
  });

  await newUser.save();

  // 4. Generate token
  const token = generateToken(newUser._id);

  return {
    user: newUser,
    token,
  };
};

module.exports = {
  generateToken,
  signup,
  login,
  googleLogin,
  getUserById,
};
