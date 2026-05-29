const express = require("express");
const multer = require("multer");
const profileController = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Initialize Multer with memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});

// Protect all endpoints in this router
router.use(protect);

router.get("/", profileController.getProfile);
router.put("/", profileController.updateProfile);
router.post("/upload", upload.single("file"), profileController.uploadFile);
router.get("/qrs", profileController.getUserQrCodes);
router.post("/qrs/claim", profileController.claimQrCode);

module.exports = router;
