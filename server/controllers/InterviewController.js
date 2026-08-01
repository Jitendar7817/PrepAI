const Interview = require("../models/Interview");

// ===============================
// Create Interview
// ===============================
exports.createInterview = async (req, res) => {
  try {
    const { title, category, difficulty } = req.body;

    if (!title || !category || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const interview = await Interview.create({
      user: req.user._id,
      title,
      category,
      difficulty,
    });

    res.status(201).json({
      success: true,
      message: "Interview Created Successfully",
      interview,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===============================
// Get All Interviews
// ===============================
exports.getAllInterviews = async (req, res) => {

  try {

    const interviews = await Interview.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      interviews,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===============================
// Get Single Interview
// ===============================
exports.getInterviewById = async (req, res) => {

  try {

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview Not Found",
      });
    }

    res.status(200).json({
      success: true,
      interview,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===============================
// Delete Interview
// ===============================
exports.deleteInterview = async (req, res) => {

  try {

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview Not Found",
      });
    }

    await interview.deleteOne();

    res.status(200).json({
      success: true,
      message: "Interview Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};