import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

function History() {
  const navigate = useNavigate();

  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));

  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);

  const fetchHistory = useCallback(async () => {
    if (!user?._id) {
      toast.error("You must be logged in to view interview history");
      setLoading(false);
      navigate("/");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.get(`/ai/history/${user._id}`);

      if (data.success) {
        setInterviews(data.interviews);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to load interview history"
      );
    } finally {
      setLoading(false);
    }
  }, [navigate, user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHistory();
  }, [fetchHistory]);

  const openReport = (interview) => {
    localStorage.setItem("completedInterview", JSON.stringify(interview));

    localStorage.setItem(
      "evaluation",
      JSON.stringify({
        overallScore: interview.totalScore,
        strengths: interview.strengths,
        weaknesses: interview.weaknesses,
        suggestions: interview.suggestions,
        questions: interview.questions,
      })
    );

    navigate("/report");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          color: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "25px",
          fontWeight: "bold",
        }}
      >
        Loading Interview History...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "40px",
        color: "#ffffff",
      }}
    >
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
          📜 Interview History
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "12px 24px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            background: "#2563eb",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Back to Dashboard
        </button>
      </div>

      {interviews.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "120px",
          }}
        >
          <h2
            style={{
              color: "#38bdf8",
              marginBottom: "15px",
            }}
          >
            No Interviews Found
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "18px",
            }}
          >
            Generate your first AI Interview from Dashboard.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "25px",
          }}
        >
          {interviews.map((interview) => (
            <div
              key={interview._id}
              style={{
                background: "#1e293b",
                padding: "25px",
                borderRadius: "18px",
                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              }}
            >
              <h2
                style={{
                  color: "#38bdf8",
                  marginBottom: "15px",
                }}
              >
                {interview.title}
              </h2>

              <p>
                <strong>Category:</strong> {interview.category}
              </p>

              <p>
                <strong>Difficulty:</strong> {interview.difficulty}
              </p>

              <p>
                <strong>Status:</strong> {interview.status}
              </p>

              <p>
                <strong>Score:</strong> {interview.totalScore}%
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(interview.createdAt).toLocaleDateString()}
              </p>

              <button
                onClick={() => openReport(interview)}
                style={{
                  marginTop: "20px",
                  width: "100%",
                  padding: "14px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                View Report
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;