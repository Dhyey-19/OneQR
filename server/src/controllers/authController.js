const authService = require("../services/authService");
const { UserResponseDto } = require("../dtos/userDto");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
  try {
    // Input is already parsed and validated by validationMiddleware (attached to req.validatedBody)
    const { phone, password } = req.validatedBody;

    const { user, token } = await authService.signup({ phone, password });

    return res.status(201).json({
      status: "success",
      message: "Account created successfully! You can now log in.",
      data: {
        user: UserResponseDto.transform(user),
        token,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(error.status || 500).json({
      status: "error",
      message: error.message || "Server error occurred during signup. Please try again.",
    });
  }
};

/**
 * @desc    Authenticate user and return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    // Input is already parsed and validated by validationMiddleware (attached to req.validatedBody)
    const { phone, password } = req.validatedBody;

    const { user, token } = await authService.login({ phone, password });

    return res.status(200).json({
      status: "success",
      message: "Login successful! Welcome back to OneQR.",
      data: {
        user: UserResponseDto.transform(user),
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(error.status || 500).json({
      status: "error",
      message: error.message || "Server error occurred during login. Please try again.",
    });
  }
};

/**
 * @desc    Get currently logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getProfile = async (req, res) => {
  try {
    // User is retrieved from DB and attached to req.user by authMiddleware
    return res.status(200).json({
      status: "success",
      data: {
        user: UserResponseDto.transform(req.user),
      },
    });
  } catch (error) {
    console.error("Get Profile error:", error);
    return res.status(error.status || 500).json({
      status: "error",
      message: error.message || "Server error occurred while fetching user profile.",
    });
  }
};
