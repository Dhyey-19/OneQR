const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const authController = require("../controllers/authController");

// Middlewares
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validationMiddleware");

// DTOs
const { UserSignupDto, UserLoginDto } = require("../dtos/userDto");

router.get("/health", (req, res) => {
  res.json({ message: "API is healthy", status: "ok" });
});

router.post("/contact", contactController.sendContactEmail);

// Authentication Routes

router.post("/auth/signup", validate(UserSignupDto), authController.signup);
router.post("/auth/login", validate(UserLoginDto), authController.login);
router.post("/auth/google-login", authController.googleLogin);
router.get("/auth/me", protect, authController.getProfile);

// Profile & QR management routes
const profileRoutes = require("./profileRoutes");
router.use("/profile", profileRoutes);
router.get("/public/profile/:slug", require("../controllers/profileController").getPublicProfile);

// Payment & Subscription routes
const paymentRoutes = require("./paymentRoutes");
router.use("/payment", paymentRoutes);

// Admin routes
const adminRoutes = require("./adminRoutes");
router.use("/admin", adminRoutes);

module.exports = router;

