const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "gemini-3.6-flash";

// ==========================================
// Helper: Safely extract JSON from model output
// ==========================================
function extractJson(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty or invalid response text from Gemini");
  }

  let text = rawText.trim();

  // Remove markdown code blocks
  text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

  const firstBrace = text.indexOf("{");
  const firstBracket = text.indexOf("[");

  let start = -1;

  if (firstBrace === -1) start = firstBracket;
  else if (firstBracket === -1) start = firstBrace;
  else start = Math.min(firstBrace, firstBracket);

  const lastBrace = text.lastIndexOf("}");
  const lastBracket = text.lastIndexOf("]");

  const end = Math.max(lastBrace, lastBracket);

  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }

  return JSON.parse(text);
}

// ==========================================
// Generate Interview Questions
// ==========================================
async function generateInterviewQuestions(
  category,
  difficulty,
  numberOfQuestions
) {
  const prompt = `
You are an experienced technical interviewer.

Generate exactly ${numberOfQuestions} interview questions.

Category: ${category}
Difficulty: ${difficulty}

Return ONLY valid JSON.

Example:

[
  {
    "question":"What is React?"
  },
  {
    "question":"Explain Virtual DOM."
  }
]

No markdown.
No explanation.
Only JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const questions = extractJson(response.text);

    return questions;
  } catch (error) {
    console.error("Gemini Question Generation Error:", error);
    throw error;
  }
}

// ==========================================
// Evaluate Interview Answers
// ==========================================
async function evaluateInterviewAnswers(questions, answers) {
  const prompt = `
You are an expert technical interviewer.

Questions:

${JSON.stringify(questions, null, 2)}

Candidate Answers:

${JSON.stringify(answers, null, 2)}

Evaluate every answer.

Return ONLY valid JSON.

Format:

{
  "overallScore":85,
  "strengths":[
    "Strong React fundamentals"
  ],
  "weaknesses":[
    "Needs improvement in DSA"
  ],
  "suggestions":[
    "Practice Trees",
    "Improve DBMS"
  ],
  "questions":[
    {
      "score":8,
      "feedback":"Good answer"
    }
  ]
}

No markdown.
No explanation.
Only JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

   const result = extractJson(response.text);

console.log("========== GEMINI RESULT ==========");
console.log(JSON.stringify(result, null, 2));

return result;
  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    throw error;
  }
}

module.exports = {
  generateInterviewQuestions,
  evaluateInterviewAnswers,
};