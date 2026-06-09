const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Middlewares
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validationMiddleware");

// DTOs
const { UserSignupDto, UserLoginDto } = require("../dtos/userDto");

router.post("/signup", validate(UserSignupDto), authController.signup);
router.post("/login", validate(UserLoginDto), authController.login);
router.get("/me", protect, authController.getProfile);
router.put("/profile", protect, authController.updateUserProfile);

module.exports = router;
