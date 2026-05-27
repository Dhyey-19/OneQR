const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Admin = require("../models/Admin");

/**
 * Middleware to protect routes that require Admin authentication.
 * Verifies JWT token and attaches admin details to `req.admin`.
 */
const adminProtect = async (req, res, next) => {
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

      // 3. Fetch admin and attach to request object
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return res.status(401).json({
          status: "error",
          message: "Not authorized as an admin. Admin not found.",
        });
      }

      req.admin = admin;
      return next();
    } catch (error) {
      console.error("Admin Authentication middleware error:", error);
      
      const message = error.name === "TokenExpiredError" 
        ? "Session expired. Please log in again." 
        : "Not authorized, admin token validation failed.";

      return res.status(401).json({
        status: "error",
        message,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Not authorized, admin token is missing.",
    });
  }
};

module.exports = {
  adminProtect,
};
