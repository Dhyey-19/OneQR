const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const feedbackController = require("../controllers/feedbackController");

// Public Profile routes
router.get("/profile/:slug", profileController.getPublicProfile);
router.post("/profile/:slug/feedback", feedbackController.submitFeedback);
router.get("/profile/:slug/review-suggestions", feedbackController.getReviewSuggestions);

module.exports = router;
