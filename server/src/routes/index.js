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
router.get("/auth/me", protect, authController.getProfile);


module.exports = router;

