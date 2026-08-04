const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  generateQuestion,
  submitCode,
  getCodingHistory,
} = require("../controllers/CodingController");

// =====================================
// Generate Coding Question
// =====================================

router.post("/generate", protect, generateQuestion);

// =====================================
// Submit Code
// =====================================

router.post("/:id/submit", protect, submitCode);

// =====================================
// Coding History
// =====================================

router.get("/history/:userId", protect, getCodingHistory);

module.exports = router;