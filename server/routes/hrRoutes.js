const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  generateInterview,
  submitInterview,
  getHistory,
} = require("../controllers/hrController");

// =====================================
// Generate HR Interview
// =====================================

router.post("/generate", protect, generateInterview);

// =====================================
// Submit HR Interview
// =====================================

router.post("/:id/submit", protect, submitInterview);

// =====================================
// HR Interview History
// =====================================

router.get("/history/:userId", protect, getHistory);

module.exports = router;