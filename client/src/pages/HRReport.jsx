import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function HRReport() {
  const navigate = useNavigate();

  const evaluation = useMemo(() => {
    const data = localStorage.getItem("hrEvaluation");
    return data ? JSON.parse(data) : null;
  }, []);

  const interview = useMemo(() => {
    const data = localStorage.getItem("hrInterview");
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
        Loading HR Report...
      </div>
    );
  }

  const score = evaluation.overallScore || 0;

  const performance =
    score >= 90
      ? "🏆 Outstanding"
      : score >= 80
      ? "🥇 Excellent"
      : score >= 70
      ? "🥈 Good"
      : score >= 50
      ? "🥉 Average"
      : "⚠ Needs Improvement";

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("PrepAI - HR Interview Report", 20, 20);

    doc.setFontSize(14);

    doc.text(`Company : ${interview.company}`, 20, 35);
    doc.text(`Overall Score : ${score}/100`, 20, 45);

    doc.setFontSize(16);
    doc.text("Strengths", 20, 65);

    autoTable(doc, {
      startY: 70,
      head: [["Strength"]],
      body: (evaluation.strengths || []).map((item) => [item]),
    });

    let y = doc.lastAutoTable.finalY + 15;

    doc.text("Weaknesses", 20, y);

    autoTable(doc, {
      startY: y + 5,
      head: [["Weakness"]],
      body: (evaluation.weaknesses || []).map((item) => [item]),
    });

    y = doc.lastAutoTable.finalY + 15;

    doc.text("Suggestions", 20, y);

    autoTable(doc, {
      startY: y + 5,
      head: [["Suggestion"]],
      body: (evaluation.suggestions || []).map((item) => [item]),
    });

    y = doc.lastAutoTable.finalY + 15;

    doc.text("Question Wise Feedback", 20, y);

    autoTable(doc, {
      startY: y + 5,
      head: [["Question", "Score", "Feedback"]],
      body: interview.questions.map((q) => [
        q.question,
        `${q.score}/10`,
        q.feedback,
      ]),
    });

    doc.save("PrepAI_HR_Report.pdf");
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "40px",
      fontFamily: "Arial",
    },

    heading: {
      textAlign: "center",
      color: "#38bdf8",
      fontSize: "42px",
      marginBottom: "35px",
    },

    scoreCard: {
      background: "#1e293b",
      padding: "30px",
      borderRadius: "20px",
      textAlign: "center",
      marginBottom: "30px",
    },

    score: {
      fontSize: "60px",
      color: "#22c55e",
      fontWeight: "bold",
    },

    performance: {
      fontSize: "22px",
      marginTop: "10px",
      color: "#facc15",
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
      marginBottom: "15px",
    },

    list: {
      paddingLeft: "20px",
      lineHeight: "32px",
      fontSize: "18px",
    },

    button: {
      width: "100%",
      padding: "16px",
      border: "none",
      borderRadius: "12px",
      color: "white",
      fontSize: "18px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "20px",
    },
  };
    return (
    <div style={styles.page}>
      <h1 style={styles.heading}>
        👔 AI HR Interview Report
      </h1>

      {/* Overall Score */}

      <div style={styles.scoreCard}>
        <h2>Overall HR Score</h2>

        <div style={styles.score}>
          {score}%
        </div>

        <div style={styles.performance}>
          {performance}
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

      {/* Question Wise Feedback */}

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
              <strong>Score:</strong> {question.score}/10
            </p>

            <p>
              <strong>Feedback:</strong>
              <br />
              {question.feedback}
            </p>
          </div>
        ))}
      </div>

      {/* Buttons */}

      <button
        style={{
          ...styles.button,
          background: "#16a34a",
        }}
        onClick={downloadPDF}
      >
        📄 Download HR Report
      </button>

      <button
        style={{
          ...styles.button,
          background: "#7c3aed",
        }}
        onClick={() => navigate("/final-report")}
      >
        🏆 Continue to Final Placement Report
      </button>

      <button
        style={{
          ...styles.button,
          background: "#2563eb",
        }}
        onClick={() => navigate("/dashboard")}
      >
        🏠 Back to Dashboard
      </button>
    </div>
  );
}

export default HRReport;