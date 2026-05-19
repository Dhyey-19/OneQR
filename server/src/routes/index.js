const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const authController = require("../controllers/authController");

router.get("/health", (req, res) => {
  res.json({ message: "API is healthy", status: "ok" });
});

router.post("/contact", contactController.sendContactEmail);

// Authentication Routes
router.post("/auth/signup", authController.signup);
router.post("/auth/login", authController.login);

module.exports = router;
