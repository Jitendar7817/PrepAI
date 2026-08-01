const pdf = require("pdf-parse");
const { analyzeResume } = require("../services/geminiResumeServices");

// =====================================
// Resume Analyzer
// =====================================
exports.analyzeResume = async (req, res) => {
  try {
    // Check PDF
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume.",
      });
    }

    // Read PDF
    const data = await pdf(req.file.buffer);

    const resumeText = data.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Unable to read resume content.",
      });
    }

    // Analyze using Gemini
    const analysis = await analyzeResume(resumeText);

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully.",
      analysis,
    });
  } catch (error) {
    console.error("Resume Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Resume analysis failed.",
    });
  }
};