const Interview = require("../models/Interview");

const {
  generateInterviewQuestions,
  evaluateInterviewAnswers,
} = require("../services/geminiService");

// =====================================
// =====================================
// Generate Interview Questions
// =====================================
exports.generateQuestions = async (req, res) => {
  try {
    const {
      userId,
      title,
      category,
      company,
      role,
      difficulty,
      language,
      questionCount,
      interviewTime,
      topics,
    } = req.body;

    // =====================================
    // Validation
    // =====================================

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!company || !role || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (!topics || !Array.isArray(topics) || topics.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please select at least 2 topics",
      });
    }

    // =====================================
    // Previous Interviews
    // =====================================

    const previousInterviews = await Interview.find({
      user: userId,
    });

    const previousQuestions = previousInterviews.flatMap((item) =>
      item.questions.map((q) => q.question)
    );

    console.log("================================");
    console.log("Previous Questions");
    console.log(previousQuestions);
    console.log("================================");

    // =====================================
    // Generate AI Questions
    // =====================================

    const generatedQuestions = await generateInterviewQuestions({
      company,
      role,
      difficulty,
      language,
      topics,
      questionCount,
      previousQuestions,
    });

    console.log("================================");
    console.log("Generated Questions");
    console.log(generatedQuestions);
    console.log("================================");

    // =====================================
    // Save Interview
    // =====================================

    const interview = await Interview.create({
      user: userId,

      title: title || `${company} ${role} Interview`,

      category: category || role,

      company,

      role,

      difficulty,

      language,

      questionCount,

      topics,

      interviewTime: interviewTime || 15,

      questions: generatedQuestions,

      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Interview Generated Successfully",
      interview,
    });
  } catch (error) {
    console.error("Generate Interview Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to Generate Interview",
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
    }).sort({
      createdAt: -1,
    });

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

// =====================================
// Dashboard Statistics
// =====================================

exports.getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const interviews = await Interview.find({
      user: userId,
    }).sort({
      createdAt: 1,
    });

    const totalInterviews = interviews.length;

    const completedInterviews = interviews.filter(
      (item) => item.status === "Completed"
    ).length;

    const scores = interviews
      .filter((item) => item.status === "Completed")
      .map((item) => item.totalScore || 0);

    const averageScore =
      scores.length > 0
        ? Math.round(
            scores.reduce((sum, score) => sum + score, 0) / scores.length
          )
        : 0;

    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;

    console.log("Dashboard Stats:", {
      totalInterviews,
      completedInterviews,
      averageScore,
      highestScore,
      recentScores: scores,
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalInterviews,
        completedInterviews,
        averageScore,
        highestScore,
        recentScores: scores,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateQuestions: exports.generateQuestions,
  submitInterview: exports.submitInterview,
  testAI: exports.testAI,
  getInterviewHistory: exports.getInterviewHistory,
  getDashboardStats: exports.getDashboardStats,
};