import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import API from "../services/api";
import toast from "react-hot-toast";

function CodingRound() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [company, setCompany] = useState("General");
  const [language, setLanguage] = useState("C++");
  const [difficulty, setDifficulty] = useState("Easy");
  const [topic, setTopic] = useState("Arrays");

  const [loading, setLoading] = useState(false);

  const [codingRound, setCodingRound] = useState(null);
  const [question, setQuestion] = useState(null);

  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {

    return 0;

}`);

  // Redirect if user is not logged in
  if (!user) {
    navigate("/");
    return null;
  }

  // ===========================
  // Language Starter Code
  // ===========================

  const handleLanguageChange = (e) => {
    const lang = e.target.value;

    setLanguage(lang);

    if (lang === "C++") {
      setCode(`#include <iostream>
using namespace std;

int main() {

    return 0;

}`);
    }

    if (lang === "Java") {
      setCode(`public class Main {

    public static void main(String[] args) {

    }

}`);
    }

    if (lang === "Python") {
      setCode(`# Write your code here`);
    }

    if (lang === "JavaScript") {
      setCode(`function solve() {

}`);
    }
  };

  // ===========================
  // Generate Coding Question
  // ===========================

  const generateQuestion = async () => {
    try {
      setLoading(true);

      const { data } = await API.post("/coding/generate", {
        userId: user._id,
        company,
        language,
        topic,
        difficulty,
      });

      setCodingRound(data.codingRound);
      setQuestion(data.codingRound.question);

      const starter = data.codingRound.question.starterCode;

      if (language === "C++") {
        setCode(starter.cpp);
      }

      if (language === "Java") {
        setCode(starter.java);
      }

      if (language === "Python") {
        setCode(starter.python);
      }

      if (language === "JavaScript") {
        setCode(starter.javascript);
      }

      toast.success("Coding Question Generated");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to Generate Coding Question"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Submit Code
  // ===========================

  const submitCode = async () => {
    if (!codingRound) {
      toast.error("Please generate a question first");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post(
        `/coding/${codingRound._id}/submit`,
        {
          language,
          code,
        }
      );

      toast.success("Code Submitted & Reviewed");

      localStorage.setItem(
        "codingReview",
        JSON.stringify(data.aiReview)
      );

      localStorage.setItem(
        "codingRound",
        JSON.stringify(data.codingRound)
      );

      navigate("/coding-report");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to Submit Code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
  style={{
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "40px",
    fontFamily: "Arial",
  }}
>
  <h1
    style={{
      textAlign: "center",
      color: "#38bdf8",
      marginBottom: "40px",
    }}
  >
    💻 AI Coding Round
  </h1>

  <div
    style={{
      maxWidth: "1000px",
      margin: "auto",
      background: "#1e293b",
      padding: "30px",
      borderRadius: "20px",
    }}
  >
    <h2
      style={{
        color: "#38bdf8",
        marginBottom: "25px",
      }}
    >
      Generate Coding Question
    </h2>

    {/* Company */}

    <select
      value={company}
      onChange={(e) => setCompany(e.target.value)}
      style={{
        width: "100%",
        padding: "15px",
        marginBottom: "20px",
        borderRadius: "10px",
        fontSize: "16px",
      }}
    >
      <option>General</option>
      <option>Google</option>
      <option>Amazon</option>
      <option>Microsoft</option>
      <option>Meta</option>
      <option>Apple</option>
      <option>Netflix</option>
      <option>Infosys</option>
      <option>TCS</option>
      <option>Wipro</option>
      <option>Accenture</option>
      <option>Capgemini</option>
      <option>Deloitte</option>
    </select>

    {/* Language */}

    <select
      value={language}
      onChange={handleLanguageChange}
      style={{
        width: "100%",
        padding: "15px",
        marginBottom: "20px",
        borderRadius: "10px",
        fontSize: "16px",
      }}
    >
      <option>C++</option>
      <option>Java</option>
      <option>Python</option>
      <option>JavaScript</option>
    </select>

    {/* Difficulty */}

    <select
      value={difficulty}
      onChange={(e) => setDifficulty(e.target.value)}
      style={{
        width: "100%",
        padding: "15px",
        marginBottom: "20px",
        borderRadius: "10px",
        fontSize: "16px",
      }}
    >
      <option>Easy</option>
      <option>Medium</option>
      <option>Hard</option>
    </select>

    {/* Topic */}

    <select
      value={topic}
      onChange={(e) => setTopic(e.target.value)}
      style={{
        width: "100%",
        padding: "15px",
        marginBottom: "25px",
        borderRadius: "10px",
        fontSize: "16px",
      }}
    >
      <option>Arrays</option>
      <option>Strings</option>
      <option>Linked List</option>
      <option>Stack</option>
      <option>Queue</option>
      <option>Trees</option>
      <option>Graphs</option>
      <option>Dynamic Programming</option>
    </select>

    <button
      onClick={generateQuestion}
      disabled={loading}
      style={{
        width: "100%",
        padding: "16px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "30px",
      }}
    >
      {loading
        ? "Generating..."
        : "🚀 Generate Coding Question"}
    </button>

    {question && (
      <div
        style={{
          background: "#0f172a",
          padding: "25px",
          borderRadius: "15px",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ color: "#38bdf8" }}>
          {question.title}
        </h2>

        <p style={{ marginTop: "15px" }}>
          {question.description}
        </p>

        <h3 style={{ marginTop: "25px" }}>
          Sample Input
        </h3>

        <pre>{question.sampleInput}</pre>

        <h3>Sample Output</h3>

        <pre>{question.sampleOutput}</pre>

        <h3>Constraints</h3>

        <ul>
          {(question.constraints || []).map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>

        <h3>Hints</h3>

        <ul>
          {(question.hints || []).map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>
      </div>
    )}

    <Editor
      height="500px"
      language={
        language === "C++"
          ? "cpp"
          : language === "Java"
          ? "java"
          : language === "Python"
          ? "python"
          : "javascript"
      }
      theme="vs-dark"
      value={code}
      onChange={(value) => setCode(value || "")}
    />

    <button
      onClick={submitCode}
      disabled={!codingRound || loading}
      style={{
        width: "100%",
        padding: "16px",
        marginTop: "25px",
        background: "#16a34a",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: "bold",
      }}
    >
      {loading ? "Submitting..." : "✅ Submit Code"}
    </button>
  </div>
</div>
  );
}

export default CodingRound;