const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.get("/health", (req, res) => {
  res.json({ message: "API is healthy", status: "ok" });
});

router.post("/contact", contactController.sendContactEmail);

// Authentication Routes
const authRoutes = require("./authRoutes");
router.use("/auth", authRoutes);

// Profile & QR management routes
const profileRoutes = require("./profileRoutes");
router.use("/profile", profileRoutes);

// Public routes
const publicRoutes = require("./publicRoutes");
router.use("/public", publicRoutes);

// Payment & Subscription routes
const paymentRoutes = require("./paymentRoutes");
router.use("/payment", paymentRoutes);

// Admin routes
const adminRoutes = require("./adminRoutes");
router.use("/admin", adminRoutes);

module.exports = router;

