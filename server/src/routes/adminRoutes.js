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

// QR Batches routes
router.get("/batches", adminProtect, adminController.getAllBatches);
router.patch("/batches/:id/status", adminProtect, adminController.updateBatchStatus);
router.get("/batches/:id/qrs", adminProtect, adminController.getBatchQrs);

// New profile slot management routes
router.get("/users/:userId/profiles", adminProtect, adminController.getUserProfiles);
router.post("/users/assign-plan", adminProtect, adminController.assignPlanToUser);
router.post("/profiles/connect-qr", adminProtect, adminController.connectQrToProfile);
router.post("/profiles/:profileId/plan", adminProtect, adminController.updateProfilePlan);
router.post("/profiles/:profileId/unlink", adminProtect, adminController.unlinkQrFromProfile);
router.delete("/profiles/:profileId", adminProtect, adminController.deleteProfileSlot);

module.exports = router;
