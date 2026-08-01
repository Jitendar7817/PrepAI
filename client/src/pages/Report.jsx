import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Report() {
  const navigate = useNavigate();

const evaluation = useMemo(() => {
  const data = localStorage.getItem("evaluation");
  return data ? JSON.parse(data) : null;
}, []);

const interview = useMemo(() => {
  const data = localStorage.getItem("completedInterview");
  return data ? JSON.parse(data) : null;
}, []);

useEffect(() => {
  if (!evaluation || !interview) {
    navigate("/dashboard");
  }
}, [evaluation, interview, navigate]);

  if (!evaluation || !interview) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#0f172a",
          color: "white",
          fontSize: "28px",
        }}
      >
        Loading Report...
      </div>
    );
  }

  const score = evaluation.overallScore || 0;
    const styles = {
    page: {
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "40px",
      fontFamily: "Arial",
    },

    heading: {
      fontSize: "42px",
      textAlign: "center",
      color: "#38bdf8",
      marginBottom: "40px",
    },

    scoreCard: {
      background: "#1e293b",
      padding: "30px",
      borderRadius: "20px",
      textAlign: "center",
      marginBottom: "35px",
    },

    score: {
      fontSize: "60px",
      color: "#22c55e",
      fontWeight: "bold",
    },

    card: {
      background: "#1e293b",
      padding: "25px",
      borderRadius: "18px",
      marginBottom: "25px",
    },

    title: {
      color: "#38bdf8",
      marginBottom: "18px",
    },

    list: {
      paddingLeft: "20px",
      lineHeight: "35px",
      fontSize: "18px",
    },

    button: {
      marginTop: "30px",
      width: "100%",
      padding: "16px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
    },
  };
    return (
    <div style={styles.page}>

      <h1 style={styles.heading}>
        📊 AI Interview Report
      </h1>

      {/* Overall Score */}

      <div style={styles.scoreCard}>

        <h2>Overall Score</h2>

        <div style={styles.score}>
          {score}%
        </div>

      </div>

      {/* Strengths */}

      <div style={styles.card}>

        <h2 style={styles.title}>
          💪 Strengths
        </h2>

        <ul style={styles.list}>
          {(evaluation.strengths || []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

      </div>

      {/* Weaknesses */}

      <div style={styles.card}>

        <h2 style={styles.title}>
          ⚠ Weaknesses
        </h2>

        <ul style={styles.list}>
          {(evaluation.weaknesses || []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

      </div>

      {/* Suggestions */}

      <div style={styles.card}>

        <h2 style={styles.title}>
          💡 AI Suggestions
        </h2>

        <ul style={styles.list}>
          {(evaluation.suggestions || []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

      </div>

      {/* Question Wise Report */}

      <div style={styles.card}>

        <h2 style={styles.title}>
          📑 Question Wise Feedback
        </h2>

        {interview.questions.map((question, index) => (

          <div
            key={index}
            style={{
              marginBottom: "30px",
              borderBottom: "1px solid #334155",
              paddingBottom: "20px",
            }}
          >

            <h3 style={{ color: "#38bdf8" }}>
              Question {index + 1}
            </h3>

            <p>
              <strong>Question:</strong>
              <br />
              {question.question}
            </p>

            <p>
              <strong>Your Answer:</strong>
              <br />
              {question.answer || "Not Answered"}
            </p>

            <p>
              <strong>Score:</strong>{" "}
              {question.score}/10
            </p>

            <p>
              <strong>Feedback:</strong>
              <br />
              {question.feedback}
            </p>

          </div>

        ))}

      </div>

      <button
        style={styles.button}
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

    </div>
  );
}

export default Report;