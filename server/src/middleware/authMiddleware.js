const jwt = require("jsonwebtoken");
const config = require("../config/config");
const authService = require("../services/authService");

/**
 * Middleware to protect routes that require authentication.
 * Verifies JWT token and attaches user details to `req.user`.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header: "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);

      // 3. Fetch user and attach to request object
      req.user = await authService.getUserById(decoded.id);

      return next();
    } catch (error) {
      console.error("Authentication middleware error:", error);
      
      const message = error.name === "TokenExpiredError" 
        ? "Session expired. Please log in again." 
        : "Not authorized, token validation failed.";

      return res.status(401).json({
        status: "error",
        message,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Not authorized, token is missing.",
    });
  }
};

module.exports = {
  protect,
};
