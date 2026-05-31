const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { adminProtect } = require("../middleware/adminAuthMiddleware");

// Public routes
router.post("/auth/login", adminController.login);

// Protected routes (Admin only)
router.get("/auth/me", adminProtect, adminController.getProfile);
router.get("/stats", adminProtect, adminController.getDashboardStats);
router.get("/users", adminProtect, adminController.getAllUsers);
router.post("/users", adminProtect, adminController.createUser);
router.post("/qrs/assign-plan", adminProtect, adminController.assignPlan);
router.get("/qrs", adminProtect, adminController.getQrCodes);
router.post("/qrs/generate", adminProtect, adminController.generateQrCode);
router.post("/qrs/assign", adminProtect, adminController.assignQrCode);
router.delete("/qrs/:id", adminProtect, adminController.deleteQrCode);
router.delete("/qrs", adminProtect, adminController.deleteAllQrCodes);

module.exports = router;
