const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =====================================
// Generate HR Questions
// =====================================

exports.generateHRQuestions = async (company) => {
  try {
    const prompt = `
You are an HR interviewer at ${company}.

Generate exactly 5 HR interview questions for a fresher.

Rules:
- Return ONLY valid JSON.
- Do not add markdown.
- Do not add explanation.

Format:

[
  {
    "question":"Tell me about yourself."
  }
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let text = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Generate HR Questions Error:", error);
    throw error;
  }
};

// =====================================
// Evaluate HR Answers
// =====================================

exports.evaluateHRAnswers = async (questions, answers) => {
  try {
    const prompt = `
You are an expert HR interviewer.

Evaluate the candidate answers.

Questions:

${JSON.stringify(questions)}

Answers:

${JSON.stringify(answers)}

Return ONLY valid JSON.

{
  "overallScore":85,
  "strengths":[
    "Confidence"
  ],
  "weaknesses":[
    "Need better communication"
  ],
  "suggestions":[
    "Speak with examples"
  ],
  "questions":[
    {
      "score":8,
      "feedback":"Good answer."
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let text = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Evaluate HR Error:", error);
    throw error;
  }
};

module.exports = {
  generateHRQuestions: exports.generateHRQuestions,
  evaluateHRAnswers: exports.evaluateHRAnswers,
};