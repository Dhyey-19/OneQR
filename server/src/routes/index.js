const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.get("/health", (req, res) => {
  res.json({ message: "API is healthy", status: "ok" });
});

router.post("/contact", contactController.sendContactEmail);

module.exports = router;
