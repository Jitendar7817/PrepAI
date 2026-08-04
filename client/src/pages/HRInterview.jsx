import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function HRInterview() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [company, setCompany] = useState("General");

  const [loading, setLoading] = useState(false);

  const [interview, setInterview] = useState(null);

  const [answers, setAnswers] = useState([]);

  // ===========================
  // Handle Answer Change
  // ===========================

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];

    updatedAnswers[index] = value;

    setAnswers(updatedAnswers);
  };

  // ===========================
  // Generate HR Interview
  // ===========================

  const generateInterview = async () => {
    try {
      setLoading(true);

      const { data } = await API.post("/hr/generate", {
        userId: user._id,
        company,
      });

      setInterview(data.interview);

      setAnswers(
        new Array(data.interview.questions.length).fill("")
      );

      toast.success("HR Questions Generated");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to Generate HR Questions"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Submit HR Interview
  // ===========================

  const submitInterview = async () => {
    if (!interview) {
      toast.error("Please generate interview first");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post(
        `/hr/${interview._id}/submit`,
        {
          answers,
        }
      );

      localStorage.setItem(
        "hrEvaluation",
        JSON.stringify(data.evaluation)
      );

      localStorage.setItem(
        "hrInterview",
        JSON.stringify(data.interview)
      );

      toast.success("HR Interview Submitted Successfully");

      navigate("/hr-report");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to Submit HR Interview"
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
          marginBottom: "35px",
        }}
      >
        👔 AI HR Interview
      </h1>

      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "#1e293b",
          padding: "30px",
          borderRadius: "20px",
        }}
      >
        <h2
          style={{
            color: "#38bdf8",
            marginBottom: "20px",
          }}
        >
          Generate HR Interview
        </h2>

        {/* Company */}

        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "25px",
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

        <button
          onClick={generateInterview}
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
          }}
        >
          {loading
            ? "Generating..."
            : "🚀 Generate HR Questions"}
        </button>

        {/* ================= Questions ================= */}

        {interview && (
          <div
            style={{
              marginTop: "35px",
            }}
          >
            {interview.questions.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "#0f172a",
                  padding: "20px",
                  borderRadius: "15px",
                  marginBottom: "20px",
                }}
              >
                <h3
                  style={{
                    color: "#38bdf8",
                    marginBottom: "15px",
                  }}
                >
                  Question {index + 1}
                </h3>

                <p
                  style={{
                    marginBottom: "15px",
                    lineHeight: "28px",
                  }}
                >
                  {item.question}
                </p>

                <textarea
                  rows="5"
                  value={answers[index] || ""}
                  onChange={(e) =>
                    handleAnswerChange(index, e.target.value)
                  }
                  placeholder="Write your answer here..."
                  style={{
                    width: "100%",
                    padding: "15px",
                    borderRadius: "10px",
                    resize: "vertical",
                    fontSize: "15px",
                  }}
                />
              </div>
            ))}

            <button
              onClick={submitInterview}
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold",
                marginTop: "15px",
              }}
            >
              {loading
                ? "Submitting..."
                : "✅ Submit HR Interview"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HRInterview;