const Profile = require("../models/Profile");
const Feedback = require("../models/Feedback");

/**
 * Public handler to submit private customer feedback for a profile.
 */
exports.submitFeedback = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { rating, feedbackText, customerName, customerPhone } = req.body;

    if (!rating) {
      return res.status(400).json({
        status: "error",
        message: "Rating is required.",
      });
    }

    // 1. Locate profile by slug
    let profile = await Profile.findOne({ slug: slug.trim().toLowerCase() });

    // 2. Fallback direct match for older profiles that don't have slugs stored
    if (!profile) {
      const allProfiles = await Profile.find({});
      profile = allProfiles.find(p => {
        const companyName = p.profileCompany || p.profileName || "demo-profile";
        const generatedSlug = companyName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        return generatedSlug === slug.trim().toLowerCase();
      });
    }

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Business profile not found.",
      });
    }

    // 3. Create the feedback record
    const newFeedback = await Feedback.create({
      profile: profile._id,
      rating,
      feedbackText: feedbackText || "",
      customerName: customerName || "",
      customerPhone: customerPhone || "",
    });

    res.status(201).json({
      status: "success",
      message: "Feedback submitted successfully.",
      data: { feedback: newFeedback },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Protected handler to retrieve all feedbacks for the user's business profiles.
 */
exports.getFeedbacks = async (req, res, next) => {
  try {
    // 1. Find all profiles belonging to the logged-in merchant
    const profiles = await Profile.find({ user: req.user.id });
    const profileIds = profiles.map(p => p._id);

    // 2. Retrieve all feedback entries for those profiles
    const feedbacks = await Feedback.find({ profile: { $in: profileIds } })
      .populate("profile", "profileCompany profileName slug")
      .sort({ createdAt: -1 });

    res.json({
      status: "success",
      data: { feedbacks },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public handler to generate a single positive review suggestion for a profile.
 */
exports.getReviewSuggestions = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // 1. Locate profile by slug
    let profile = await Profile.findOne({ slug: slug.trim().toLowerCase() });

    // 2. Fallback direct match
    if (!profile) {
      const allProfiles = await Profile.find({});
      profile = allProfiles.find(p => {
        const companyName = p.profileCompany || p.profileName || "demo-profile";
        const generatedSlug = companyName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        return generatedSlug === slug.trim().toLowerCase();
      });
    }

    const companyName = (profile && (profile.profileCompany || profile.profileName)) || "this business";

    // 3. Define positive review templates with placeholders
    const templates = [
      `Outstanding experience at ${companyName}! The service was top-notch and the staff was extremely friendly and helpful. Highly recommend!`,
      `Very impressed with the quality and professionalism of ${companyName}. Super fast service and wonderful customer care!`,
      `Excellent service at ${companyName}. The team went above and beyond to make sure everything was perfect. 10/10 experience!`,
      `Highly recommend ${companyName}! They are extremely reliable, professional, and provide top-tier services.`,
      `Such a pleasant experience with ${companyName}. Everything was smooth, efficient, and of great quality. Will definitely visit again!`
    ];

    // Pick a random template
    const randomIndex = Math.floor(Math.random() * templates.length);
    const suggestion = templates[randomIndex];

    res.json({
      status: "success",
      data: { suggestion },
    });
  } catch (error) {
    next(error);
  }
};
