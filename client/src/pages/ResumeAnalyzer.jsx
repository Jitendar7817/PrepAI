import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import {
  FaFilePdf,
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaLightbulb,
  FaArrowLeft,
} from "react-icons/fa";

function ResumeAnalyzer() {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] = useState(null);

  const rating = useMemo(() => {
    if (!analysis || typeof analysis.atsScore !== "number") return null;

    const score = analysis.atsScore;

    let stars;
    let label;

    if (score >= 90) {
      stars = 5;
      label = "Excellent";
    } else if (score >= 80) {
      stars = 4;
      label = "Very Good";
    } else if (score >= 70) {
      stars = 3;
      label = "Good";
    } else if (score >= 60) {
      stars = 2;
      label = "Average";
    } else {
      stars = 1;
      label = "Needs Improvement";
    }

    const starDisplay =
      "⭐".repeat(stars) + "☆".repeat(5 - stars);

    return { stars, label, starDisplay };
  }, [analysis]);

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
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaArrowLeft />
          &nbsp; Dashboard
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
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaUpload color="#38bdf8" />
          {" "}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
              color: "#cbd5e1",
            }}
          >
            <FaFilePdf color="#ef4444" size={22} />
            <strong>{resume.name}</strong>
          </div>
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {loading ? (
            "Analyzing Resume..."
          ) : (
            <>
              <FaUpload />
              &nbsp; Analyze Resume
            </>
          )}
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
            <h2 style={{ color: "#38bdf8" }}>📊 ATS Resume Score</h2>

            <h1
              style={{
                color: "#22c55e",
                fontSize: "60px",
                marginTop: "15px",
              }}
            >
              {analysis.atsScore}%
            </h1>

            <p
              style={{
                marginTop: "10px",
                color: "#94a3b8",
              }}
            >
              AI Generated Resume Rating
            </p>

            {rating && (
              <div style={{ marginTop: "20px" }}>
                <p
                  style={{
                    fontSize: "28px",
                    letterSpacing: "4px",
                  }}
                >
                  {rating.starDisplay}
                </p>

                <p
                  style={{
                    marginTop: "8px",
                    color: "#38bdf8",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {rating.label} Resume
                </p>
              </div>
            )}
          </div>

          {/* Skills */}
          <div
            style={{
              background: "#1e293b",
              padding: "25px",
              borderRadius: "18px",
            }}
          >
            <h2 style={{ color: "#38bdf8" }}>✅ Skills Detected</h2>

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
            <h2
              style={{
                color: "#22c55e",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaCheckCircle />
              {" "}
              Strengths
            </h2>

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
            <h2
              style={{
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaTimesCircle />
              {" "}
              Weaknesses
            </h2>

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
            <h2
              style={{
                color: "#38bdf8",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaLightbulb />
              {" "}
              AI Suggestions
            </h2>

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