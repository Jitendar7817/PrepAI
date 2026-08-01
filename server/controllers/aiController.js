const Interview = require("../models/Interview");

const {
  generateInterviewQuestions,
  evaluateInterviewAnswers,
} = require("../services/geminiService");

// =====================================
// Generate Interview Questions
// =====================================
exports.generateQuestions = async (req, res) => {
  try {
    const {
      userId,
      title,
      category,
      difficulty,
      numberOfQuestions,
    } = req.body;

    if (
      !userId ||
      !title ||
      !category ||
      !difficulty ||
      !numberOfQuestions
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const questions = await generateInterviewQuestions(
      category,
      difficulty,
      numberOfQuestions
    );

    const interview = await Interview.create({
      user: userId,
      title,
      category,
      difficulty,
      questions,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Interview Created Successfully",
      interview,
    });
  } catch (error) {
    console.error("Generate Interview Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Test Gemini
// =====================================
exports.testAI = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Gemini Connected Successfully",
  });
};

// =====================================
// Submit Interview
// =====================================
exports.submitInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const evaluation = await evaluateInterviewAnswers(
      interview.questions,
      answers
    );

    const updatedQuestions = interview.questions.map((question, index) => ({
      question: question.question,
      answer: answers[index] || "",
      feedback: evaluation.questions?.[index]?.feedback || "",
      score: evaluation.questions?.[index]?.score || 0,
    }));

    const updatedInterview = await Interview.findByIdAndUpdate(
      id,
      {
        $set: {
          questions: updatedQuestions,
          totalScore: evaluation.overallScore || 0,
          strengths: evaluation.strengths || [],
          weaknesses: evaluation.weaknesses || [],
          suggestions: evaluation.suggestions || [],
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
      message: "Interview Submitted Successfully",
      evaluation,
      interview: updatedInterview,
    });
  } catch (error) {
    console.error("Submit Interview Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Get Interview History
// =====================================
exports.getInterviewHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const interviews = await Interview.find({
      user: userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error("History Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};