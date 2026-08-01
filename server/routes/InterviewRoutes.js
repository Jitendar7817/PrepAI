const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createInterview,
  getAllInterviews,
  getInterviewById,
  deleteInterview,
} = require("../controllers/interviewController");

// Protected Routes
router.post("/create", protect, createInterview);

router.get("/all", protect, getAllInterviews);

router.get("/:id", protect, getInterviewById);

router.delete("/:id", protect, deleteInterview);

module.exports = router;