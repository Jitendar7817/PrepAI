const Interview = require("../models/Interview");
const CodingRound = require("../models/CodingRound");
const HRInterview = require("../models/HRInterview");

// =====================================
// Final Placement Report
// =====================================

exports.getFinalReport = async (req, res) => {
  try {

    const { userId } = req.params;

    // Latest Technical Interview
    const interview = await Interview.findOne({
      user: userId,
      status: "Completed",
    }).sort({ createdAt: -1 });

    // Latest Coding Round
    const coding = await CodingRound.findOne({
      user: userId,
      status: "Completed",
    }).sort({ createdAt: -1 });

    // Latest HR Interview
    const hr = await HRInterview.findOne({
      user: userId,
      status: "Completed",
    }).sort({ createdAt: -1 });

    const technicalScore = interview?.totalScore || 0;
    const codingScore = coding?.score || 0;
    const hrScore = hr?.overallScore || 0;

    const overallScore = Math.round(
      (technicalScore + codingScore + hrScore) / 3
    );

    let placementStatus = "";

    if (overallScore >= 90) {
      placementStatus = "🏆 Placement Ready";
    } else if (overallScore >= 75) {
      placementStatus = "🟢 Almost Ready";
    } else if (overallScore >= 60) {
      placementStatus = "🟡 Needs More Practice";
    } else {
      placementStatus = "🔴 Needs Improvement";
    }

    return res.status(200).json({
      success: true,

      technicalScore,
      codingScore,
      hrScore,
      overallScore,

      placementStatus,

      strengths: [
        ...(interview?.strengths || []),
        ...(hr?.strengths || []),
      ],

      weaknesses: [
        ...(interview?.weaknesses || []),
        ...(hr?.weaknesses || []),
      ],

      suggestions: [
        ...(interview?.suggestions || []),
        ...(hr?.suggestions || []),
      ],
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};