import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

function ResumeAnalyzer() {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }

    setResume(file);
  };

  const analyzeResume = async () => {
    if (!resume) {
      toast.error("Please select a resume.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("resume", resume);

      const { data } = await API.post(
        "/resume/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setAnalysis(data.analysis);

        toast.success("Resume analyzed successfully.");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Resume analysis failed."
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
        color: "#ffffff",
        padding: "40px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            color: "#38bdf8",
            fontSize: "38px",
          }}
        >
          📄 AI Resume Analyzer
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "12px 24px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Upload Card */}
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
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
          Upload Resume
        </h2>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{
            marginBottom: "20px",
            width: "100%",
            color: "white",
          }}
        />

        {resume && (
          <p
            style={{
              marginBottom: "20px",
              color: "#cbd5e1",
            }}
          >
            Selected File: <strong>{resume.name}</strong>
          </p>
        )}

        <button
          onClick={analyzeResume}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background: loading ? "#64748b" : "#22c55e",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {loading
            ? "Analyzing Resume..."
            : "Analyze Resume"}
        </button>
      </div>
            {/* Resume Analysis */}
      {analysis && (
        <div
          style={{
            marginTop: "40px",
            display: "grid",
            gap: "25px",
          }}
        >
          {/* ATS Score */}
          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "18px",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: "#38bdf8" }}>ATS Score</h2>

            <h1
              style={{
                color: "#22c55e",
                fontSize: "60px",
                marginTop: "15px",
              }}
            >
              {analysis.atsScore}%
            </h1>
          </div>

          {/* Skills */}
          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "18px",
            }}
          >
            <h2 style={{ color: "#38bdf8" }}>Skills</h2>

            <ul>
              {(analysis.skills || []).map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          {/* Strengths */}
          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "18px",
            }}
          >
            <h2 style={{ color: "#22c55e" }}>Strengths</h2>

            <ul>
              {(analysis.strengths || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "18px",
            }}
          >
            <h2 style={{ color: "#ef4444" }}>Weaknesses</h2>

            <ul>
              {(analysis.weaknesses || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Missing Skills */}
          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "18px",
            }}
          >
            <h2 style={{ color: "#f59e0b" }}>Missing Skills</h2>

            <ul>
              {(analysis.missingSkills || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "18px",
            }}
          >
            <h2 style={{ color: "#38bdf8" }}>Suggestions</h2>

            <ul>
              {(analysis.suggestions || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
          </div>
  );
}

export default ResumeAnalyzer;