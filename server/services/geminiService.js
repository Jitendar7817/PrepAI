const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "gemini-3.6-flash";

// ==========================================
// Helper: Extract JSON safely
// ==========================================
function extractJson(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Invalid Gemini response");
  }

  let text = rawText.trim();

  text = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = text.indexOf("{");
  const firstBracket = text.indexOf("[");

  let start = -1;

  if (firstBrace === -1) start = firstBracket;
  else if (firstBracket === -1) start = firstBrace;
  else start = Math.min(firstBrace, firstBracket);

  const lastBrace = text.lastIndexOf("}");
  const lastBracket = text.lastIndexOf("]");

  const end = Math.max(lastBrace, lastBracket);

  if (start !== -1 && end !== -1) {
    text = text.slice(start, end + 1);
  }

  return JSON.parse(text);
}
// ==========================================
// ==========================================
// Generate Interview Questions
// ==========================================
async function generateInterviewQuestions({
  company = "General",
  role = "Software Engineer",
  difficulty = "Medium",
  language = "English",
  topics = [],
  questionCount = 10,
  previousQuestions = [],
}) {

  const topicText =
    topics.length > 0
      ? topics.join(", ")
      : "General Computer Science";

  const previousQuestionsText =
    previousQuestions.length > 0
      ? previousQuestions
          .map((q, index) => `${index + 1}. ${q}`)
          .join("\n")
      : "No previous questions.";

  const prompt = `
You are an experienced Technical Interviewer.

Generate EXACTLY ${questionCount} interview questions.

Company:
${company}

Role:
${role}

Difficulty:
${difficulty}

Interview Language:
${language}

Topics:
${topicText}

Previously Asked Questions:

${previousQuestionsText}

Rules:

1. NEVER repeat any previous question.

2. Generate questions ONLY from selected topics.

3. Questions must match ${role} interview.

4. Company specific interview style:

- Google → DSA + Problem Solving
- Amazon → Leadership + Coding
- Microsoft → Problem Solving + Design
- Meta → Coding + React + JS
- Apple → Fundamentals
- Infosys → System Engineer
- TCS → Ninja/Digital
- Wipro → Technical Round
- Accenture → Coding + OOP
- Capgemini → Technical + SQL
- Deloitte → Technical + Scenario Based

5. Mix these question types:

- Theory
- Practical
- Debugging
- Scenario Based
- Coding Concept

6. Return ONLY JSON.

Example:

[
  {
    "question":"Explain React Virtual DOM."
  },
  {
    "question":"Difference between BFS and DFS."
  }
]

No markdown.

Only JSON.
`;

  try {

    console.log("================================");
    console.log("Generating AI Interview");
    console.log("Company :", company);
    console.log("Role :", role);
    console.log("Difficulty :", difficulty);
    console.log("Topics :", topicText);
    console.log("================================");
        const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 1,
        topP: 0.95,
        topK: 40,
      },
    });

    let questions = extractJson(response.text);

    if (!Array.isArray(questions)) {
      throw new Error("Gemini did not return a valid question array.");
    }

    // ==========================================
    // Remove Empty Questions
    // ==========================================

    questions = questions.filter(
      (item) =>
        item &&
        typeof item.question === "string" &&
        item.question.trim() !== ""
    );

    // ==========================================
    // Remove Duplicate Questions
    // ==========================================

    const seen = new Set();

    questions = questions.filter((item) => {
      const question = item.question.trim();

      if (seen.has(question.toLowerCase())) {
        return false;
      }

      seen.add(question.toLowerCase());

      return true;
    });

    // ==========================================
    // Remove Previously Asked Questions
    // ==========================================

    questions = questions.filter(
      (item) =>
        !previousQuestions.some(
          (q) =>
            q.trim().toLowerCase() ===
            item.question.trim().toLowerCase()
        )
    );

    // ==========================================
    // Keep Required Count
    // ==========================================

    questions = questions.slice(0, Number(questionCount));

    console.log("================================");
    console.log("Generated Questions");
    console.log(JSON.stringify(questions, null, 2));
    console.log("================================");

    return questions;

  } catch (error) {

    console.error("Gemini Question Generation Error");
    console.error(error);

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
        temperature: 0.7,
      },
    });

    const result = extractJson(response.text);

    console.log("========== GEMINI RESULT ==========");
    console.log(JSON.stringify(result, null, 2));

    return result;

  } catch (error) {

    console.error("Gemini Evaluation Error");
    console.error(error);

    throw error;
  }
}

// ==========================================
// Exports
// ==========================================

module.exports = {
  generateInterviewQuestions,
  evaluateInterviewAnswers,
};

