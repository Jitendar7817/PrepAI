import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function CodingReport() {
  const navigate = useNavigate();

  const review = useMemo(() => {
    const data = localStorage.getItem("codingReview");
    return data ? JSON.parse(data) : null;
  }, []);

  const codingRound = useMemo(() => {
    const data = localStorage.getItem("codingRound");
    return data ? JSON.parse(data) : null;
  }, []);

  useEffect(() => {
    if (!review || !codingRound) {
      navigate("/dashboard");
    }
  }, [review, codingRound, navigate]);

  if (!review || !codingRound) {
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
        Loading Coding Report...
      </div>
    );
  }

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("PrepAI - Coding Round Report", 20, 20);

    doc.setFontSize(14);

    doc.text(`Company : ${codingRound.company}`, 20, 35);
    doc.text(`Language : ${codingRound.language}`, 20, 45);
    doc.text(`Topic : ${codingRound.topic}`, 20, 55);
    doc.text(`Difficulty : ${codingRound.difficulty}`, 20, 65);
    doc.text(`Score : ${review.score}/100`, 20, 75);

    autoTable(doc, {
      startY: 90,
      head: [["Metric", "Result"]],
      body: [
        ["Correctness", review.correctness],
        ["Time Complexity", review.timeComplexity],
        ["Space Complexity", review.spaceComplexity],
      ],
    });

    let y = doc.lastAutoTable.finalY + 15;

    doc.text("Strengths", 20, y);

    autoTable(doc, {
      startY: y + 5,
      head: [["Strength"]],
      body: (review.strengths || []).map((item) => [item]),
    });

    y = doc.lastAutoTable.finalY + 15;

    doc.text("Improvements", 20, y);

    autoTable(doc, {
      startY: y + 5,
      head: [["Improvement"]],
      body: (review.improvements || []).map((item) => [item]),
    });

    y = doc.lastAutoTable.finalY + 15;

    doc.text("Best Practices", 20, y);

    autoTable(doc, {
      startY: y + 5,
      head: [["Best Practice"]],
      body: (review.bestPractices || []).map((item) => [item]),
    });

    doc.save("PrepAI_Coding_Report.pdf");
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

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
      gap: "20px",
      marginBottom: "30px",
    },

    card: {
      background: "#1e293b",
      padding: "25px",
      borderRadius: "18px",
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
        💻 AI Coding Report
      </h1>

      {/* Score */}

      <div style={styles.scoreCard}>
        <h2>Coding Score</h2>

        <div style={styles.score}>
          {review.score}/100
        </div>
      </div>

      {/* Metrics */}

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.title}>
            ✅ Correctness
          </h3>

          <p>{review.correctness}</p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.title}>
            ⏱ Time Complexity
          </h3>

          <p>{review.timeComplexity}</p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.title}>
            💾 Space Complexity
          </h3>

          <p>{review.spaceComplexity}</p>
        </div>
      </div>

      {/* Strengths */}

      <div style={styles.card}>
        <h2 style={styles.title}>
          💪 Strengths
        </h2>

        <ul style={styles.list}>
          {(review.strengths || []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Improvements */}

      <div style={styles.card}>
        <h2 style={styles.title}>
          ⚠ Improvements
        </h2>

        <ul style={styles.list}>
          {(review.improvements || []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Best Practices */}

      <div style={styles.card}>
        <h2 style={styles.title}>
          💡 Best Practices
        </h2>

        <ul style={styles.list}>
          {(review.bestPractices || []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Buttons */}

      <button
        style={{
          ...styles.button,
          background: "#16a34a",
        }}
        onClick={downloadPDF}
      >
        📄 Download Coding Report
      </button>

      <button
        style={{
          ...styles.button,
          background: "#7c3aed",
        }}
        onClick={() => navigate("/hr-interview")}
      >
        👔 Continue to HR Interview
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

export default CodingReport;