const CodingRound = require("../models/CodingRound");

const {
  generateCodingQuestion,
  reviewCode,
} = require("../services/geminiCodingService");

// =====================================
// Generate Coding Question
// =====================================

exports.generateQuestion = async (req, res) => {
  try {

    const {
      userId,
      company,
      language,
      topic,
      difficulty,
    } = req.body;

    if (
      !userId ||
      !language ||
      !topic ||
      !difficulty
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const question = await generateCodingQuestion(
      language,
      topic,
      difficulty,
      company || "General"
    );

    const codingRound = await CodingRound.create({
      user: userId,
      company,
      language,
      topic,
      difficulty,
      question,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      codingRound,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// =====================================
// Submit Code
// =====================================

exports.submitCode = async (req, res) => {
  try {

    const { id } = req.params;
    const { code, language } = req.body;

    const codingRound = await CodingRound.findById(id);

    if (!codingRound) {
      return res.status(404).json({
        success: false,
        message: "Coding Round not found",
      });
    }

    const aiReview = await reviewCode(
      codingRound.question,
      language,
      code
    );

    const updatedCodingRound =
      await CodingRound.findByIdAndUpdate(
        id,
        {
          $set: {
            code,
            aiReview,
            score: aiReview.score || 0,
            status: "Completed",
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message: "Code Submitted Successfully",
      codingRound: updatedCodingRound,
      aiReview,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// =====================================
// Get Coding History
// =====================================

exports.getCodingHistory = async (req, res) => {
  try {

    const { userId } = req.params;

    const codingRounds = await CodingRound.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      codingRounds,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// Exports
// =====================================

module.exports = {
  generateQuestion: exports.generateQuestion,
  submitCode: exports.submitCode,
  getCodingHistory: exports.getCodingHistory,
};