const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  generateQuestions,
  submitInterview,
  testAI,
  getInterviewHistory,
  getDashboardStats,
} = require("../controllers/aiController");

// =====================================
// Test Gemini
// =====================================
router.get("/test", testAI);

// =====================================
// Generate Interview
// =====================================
router.post("/generate", protect, generateQuestions);

// =====================================
// Submit Interview
// =====================================
router.post("/:id/submit", protect, submitInterview);

// =====================================
// Interview History
// =====================================
router.get("/history/:userId", protect, getInterviewHistory);

// =====================================
// Dashboard Statistics
// =====================================
router.get("/dashboard/:userId", protect, getDashboardStats);

module.exports = router;