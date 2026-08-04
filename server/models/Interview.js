const mongoose = require("mongoose");

// =====================================
// Question Schema
// =====================================

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },

    feedback: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

// =====================================
// Interview Schema
// =====================================

const interviewSchema = new mongoose.Schema(
  {
    // User

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Interview Title

    title: {
      type: String,
      required: true,
    },

    // Role / Category

    category: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "Software Engineer",
    },

    // Company

    company: {
      type: String,
      default: "General",
    },

    // Difficulty

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    // Language

    language: {
      type: String,
      default: "English",
    },

    // Number of Questions

    questionCount: {
      type: Number,
      default: 10,
    },

    // Selected Topics

    topics: {
      type: [String],
      default: [],
    },

    // Interview Duration

    interviewTime: {
      type: Number,
      default: 15,
    },

    // Questions

    questions: {
      type: [questionSchema],
      default: [],
    },

    // Overall Score

    totalScore: {
      type: Number,
      default: 0,
    },

    // AI Feedback

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    // Status

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Completed",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Interview",
  interviewSchema
);