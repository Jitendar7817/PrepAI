const mongoose = require("mongoose");

const codingRoundSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      default: "General",
    },

    language: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    question: {
      type: Object,
      required: true,
    },

    code: {
      type: String,
      default: "",
    },

    aiReview: {
      type: Object,
      default: {},
    },

    score: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CodingRound",
  codingRoundSchema
);