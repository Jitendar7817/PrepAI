const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "gemini-3.6-flash";

// ==============================
// Extract JSON safely
// ==============================
function extractJson(text) {
  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    text = text.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(text);
}

// ==============================
// Analyze Resume
// ==============================
async function analyzeResume(resumeText) {
  const prompt = `
You are an ATS Resume Analyzer.

Analyze the following resume.

Return ONLY JSON.

Format:

{
  "atsScore":85,
  "skills":[
    "React",
    "Node.js"
  ],
  "strengths":[
    "Strong MERN Projects"
  ],
  "weaknesses":[
    "No Cloud Experience"
  ],
  "missingSkills":[
    "Docker",
    "AWS"
  ],
  "suggestions":[
    "Improve DSA",
    "Add deployment projects"
  ]
}

Resume:

${resumeText}
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return extractJson(response.text);
  } catch (error) {
    console.error("Resume Analyzer Error:", error);
    throw error;
  }
}

module.exports = {
  analyzeResume,
};