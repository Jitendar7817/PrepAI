const HRInterview = require("../models/HRInterview");

const {
  generateHRQuestions,
  evaluateHRAnswers,
} = require("../services/geminiHRService");

// =====================================
// Generate HR Interview
// =====================================

exports.generateInterview = async (req, res) => {
  try {
    const { userId, company } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const questions = await generateHRQuestions(
      company || "General"
    );

    const interview = await HRInterview.create({
      user: userId,
      company: company || "General",
      questions,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      interview,
    });

  } catch (error) {
    console.error("Generate HR Interview Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Submit HR Interview
// =====================================

exports.submitInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const interview = await HRInterview.findById(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "HR Interview not found",
      });
    }

    const evaluation = await evaluateHRAnswers(
      interview.questions,
      answers
    );

    const updatedQuestions = interview.questions.map((q, index) => ({
      question: q.question,
      answer: answers[index] || "",
      feedback:
        evaluation.questions?.[index]?.feedback || "",
      score:
        evaluation.questions?.[index]?.score || 0,
    }));

    const updatedInterview =
      await HRInterview.findByIdAndUpdate(
        id,
        {
          $set: {
            questions: updatedQuestions,
            overallScore:
              evaluation.overallScore || 0,
            strengths:
              evaluation.strengths || [],
            weaknesses:
              evaluation.weaknesses || [],
            suggestions:
              evaluation.suggestions || [],
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
      interview: updatedInterview,
      evaluation,
    });

  } catch (error) {
    console.error("Submit HR Interview Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// HR Interview History
// =====================================

exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const interviews = await HRInterview.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      interviews,
    });

  } catch (error) {
    console.error("HR History Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateInterview: exports.generateInterview,
  submitInterview: exports.submitInterview,
  getHistory: exports.getHistory,
};