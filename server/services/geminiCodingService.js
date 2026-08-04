const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "gemini-3.6-flash";

// ==========================================
// Extract JSON
// ==========================================

function extractJson(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Invalid Gemini Response");
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
// Generate Coding Question
// ==========================================

async function generateCodingQuestion(
  language,
  topic,
  difficulty,
  company = "General"
) {

  const prompt = `
You are an expert coding interviewer.

Generate ONE coding interview question.

Company:
${company}

Programming Language:
${language}

Topic:
${topic}

Difficulty:
${difficulty}

Return ONLY valid JSON.

Format:

{
"title":"",
"description":"",
"sampleInput":"",
"sampleOutput":"",
"constraints":[
"",
""
],
"hints":[
"",
""
],
"starterCode":{
"cpp":"",
"java":"",
"python":"",
"javascript":""
}
}

Rules:

1. Do NOT return markdown.
2. Do NOT explain.
3. JSON only.
`;

  try {

    console.log("==================================");
    console.log("Generating Coding Question...");
    console.log(company);
    console.log(language);
    console.log(topic);
    console.log(difficulty);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 1,
      },
    });

    const result = extractJson(response.text);

    console.log("===== CODING QUESTION =====");
    console.log(JSON.stringify(result, null, 2));

    return result;

  } catch (error) {

    console.error(error);
    throw error;

  }
}
// ==========================================
// Review Code
// ==========================================

async function reviewCode(
  question,
  language,
  code
) {

  const prompt = `
You are an expert coding interviewer.

Coding Question:

${JSON.stringify(question, null, 2)}

Programming Language:

${language}

Candidate Code:

${code}

Evaluate the code.

Return ONLY valid JSON.

Format:

{
  "score":90,
  "correctness":"Excellent",
  "timeComplexity":"O(n)",
  "spaceComplexity":"O(1)",
  "strengths":[
    "",
    ""
  ],
  "improvements":[
    "",
    ""
  ],
  "bestPractices":[
    "",
    ""
  ]
}

Rules:

1. Return ONLY JSON.
2. No markdown.
3. No explanation.
`;

  try {

    console.log("==================================");
    console.log("Reviewing Candidate Code...");

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });

    const result = extractJson(response.text);

    console.log("===== AI CODE REVIEW =====");
    console.log(JSON.stringify(result, null, 2));

    return result;

  } catch (error) {

    console.error(error);
    throw error;

  }

}
// ==========================================
// Exports
// ==========================================

module.exports = {
  generateCodingQuestion,
  reviewCode,
};