import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function FinalReport() {
  const navigate = useNavigate();

  // =====================================
  // Load Reports
  // =====================================

  const technical = useMemo(() => {
    const data = localStorage.getItem("evaluation");
    return data ? JSON.parse(data) : null;
  }, []);

  const coding = useMemo(() => {
    const data = localStorage.getItem("codingReview");
    return data ? JSON.parse(data) : null;
  }, []);

  const hr = useMemo(() => {
    const data = localStorage.getItem("hrEvaluation");
    return data ? JSON.parse(data) : null;
  }, []);

  useEffect(() => {
    if (!technical || !coding || !hr) {
      navigate("/dashboard");
    }
  }, [technical, coding, hr, navigate]);

  if (!technical || !coding || !hr) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "32px",
        }}
      >
        Loading Final Placement Report...
      </div>
    );
  }

  // =====================================
  // Scores
  // =====================================

  const technicalScore =
    technical.overallScore || 0;

  const codingScore =
    coding.score || 0;

  const hrScore =
    hr.overallScore || 0;

  const overallScore = Math.round(
    (technicalScore + codingScore + hrScore) / 3
  );

  // =====================================
  // Placement Status
  // =====================================

  const getPlacementStatus = (score) => {
    if (score >= 90) return "🏆 Outstanding";
    if (score >= 80) return "🥇 Placement Ready";
    if (score >= 70) return "🥈 Good";
    if (score >= 60) return "🥉 Average";
    return "⚠ Needs Improvement";
  };

  const placementStatus =
    getPlacementStatus(overallScore);

  // =====================================
  // Estimated Package
  // =====================================

  const getSalary = (score) => {
    if (score >= 90) return "15 - 25 LPA";
    if (score >= 80) return "10 - 15 LPA";
    if (score >= 70) return "6 - 10 LPA";
    if (score >= 60) return "4 - 6 LPA";
    return "Practice More";
  };

  const estimatedPackage =
    getSalary(overallScore);

  // =====================================
  // Recommended Companies
  // =====================================

  const getCompanies = (score) => {
    if (score >= 90)
      return [
        "Google",
        "Microsoft",
        "Amazon",
        "Adobe",
        "Uber",
      ];

    if (score >= 80)
      return [
        "Amazon",
        "Microsoft",
        "Oracle",
        "Flipkart",
        "Samsung",
      ];

    if (score >= 70)
      return [
        "Infosys",
        "TCS",
        "Wipro",
        "Accenture",
        "Capgemini",
      ];

    return [
      "Service Based Companies",
      "Startup Companies",
    ];
  };

  const companies =
    getCompanies(overallScore);

  // =====================================
  // Merge Strengths
  // =====================================

  const strengths = [
    ...(technical.strengths || []),
    ...(coding.strengths || []),
    ...(hr.strengths || []),
  ];

  const weaknesses = [
    ...(technical.weaknesses || []),
    ...(coding.improvements || []),
    ...(hr.weaknesses || []),
  ];

  const suggestions = [
    ...(technical.suggestions || []),
    ...(coding.bestPractices || []),
    ...(hr.suggestions || []),
  ];

  // Remove duplicate values

  const unique = (arr) => [...new Set(arr)];

  // =====================================
  // AI Verdict
  // =====================================

  const aiVerdict = `
Based on your Technical Interview,
Coding Round and HR Interview performance,

your overall placement readiness score is ${overallScore}%.

Current estimated package:

${estimatedPackage}

Focus on your weaker areas and continue
practicing coding, communication and
problem solving to improve your chances
of getting into top product companies.
`;

  // =====================================
  // Download PDF
  // =====================================

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.text(
      "PrepAI Final Placement Report",
      20,
      20
    );

    doc.setFontSize(14);

    doc.text(
      `Overall Score : ${overallScore}%`,
      20,
      40
    );

    doc.text(
      `Placement Status : ${placementStatus}`,
      20,
      50
    );

    doc.text(
      `Estimated Package : ${estimatedPackage}`,
      20,
      60
    );

    autoTable(doc, {
      startY: 75,
      head: [["Section", "Score"]],
      body: [
        [
          "Technical Interview",
          technicalScore,
        ],
        [
          "Coding Round",
          codingScore,
        ],
        [
          "HR Interview",
          hrScore,
        ],
      ],
    });

    let y = doc.lastAutoTable.finalY + 15;

    doc.text("Recommended Companies", 20, y);

    autoTable(doc, {
      startY: y + 5,
      head: [["Company"]],
      body: companies.map((item) => [item]),
    });

    y = doc.lastAutoTable.finalY + 15;

    doc.text("Overall Strengths", 20, y);

    autoTable(doc, {
      startY: y + 5,
      head: [["Strength"]],
      body: unique(strengths).map((item) => [item]),
    });

    y = doc.lastAutoTable.finalY + 15;

    doc.text("Overall Weaknesses", 20, y);

    autoTable(doc, {
      startY: y + 5,
      head: [["Weakness"]],
      body: unique(weaknesses).map((item) => [item]),
    });

    y = doc.lastAutoTable.finalY + 15;

    doc.text("AI Verdict", 20, y);

    doc.text(aiVerdict, 20, y + 10);

    doc.save("PrepAI_Final_Report.pdf");
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
      fontSize: "70px",
      color: "#22c55e",
      fontWeight: "bold",
    },
        status: {
      fontSize: "24px",
      color: "#facc15",
      marginTop: "10px",
      fontWeight: "bold",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: "20px",
      marginBottom: "30px",
    },

    card: {
      background: "#1e293b",
      borderRadius: "18px",
      padding: "25px",
      textAlign: "center",
    },

    section: {
      background: "#1e293b",
      padding: "25px",
      borderRadius: "18px",
      marginBottom: "25px",
    },

    title: {
      color: "#38bdf8",
      marginBottom: "15px",
    },

    value: {
      fontSize: "40px",
      color: "#22c55e",
      fontWeight: "bold",
    },

    list: {
      paddingLeft: "20px",
      lineHeight: "34px",
      fontSize: "18px",
    },

    button: {
      width: "100%",
      padding: "16px",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
      color: "white",
      marginTop: "20px",
    },
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>
        🏆 Final Placement Report
      </h1>

      {/* Overall Score */}

      <div style={styles.scoreCard}>
        <h2>Overall Placement Score</h2>

        <div style={styles.score}>
          {overallScore}%
        </div>

        <div style={styles.status}>
          {placementStatus}
        </div>

        {/* Progress Bar */}

        <div
          style={{
            width: "100%",
            height: "18px",
            background: "#334155",
            borderRadius: "20px",
            marginTop: "25px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${overallScore}%`,
              height: "100%",
              background: "#22c55e",
            }}
          />
        </div>
      </div>

      {/* Scores */}

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.title}>📊 Technical</h3>
          <div style={styles.value}>
            {technicalScore}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.title}>💻 Coding</h3>
          <div style={styles.value}>
            {codingScore}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.title}>👔 HR</h3>
          <div style={styles.value}>
            {hrScore}
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.title}>💰 Estimated Package</h3>
          <div
            style={{
              color: "#facc15",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            {estimatedPackage}
          </div>
        </div>
      </div>

      {/* Recommended Companies */}

      <div style={styles.section}>
        <h2 style={styles.title}>
          🏢 Recommended Companies
        </h2>

        <ul style={styles.list}>
          {companies.map((company, index) => (
            <li key={index}>{company}</li>
          ))}
        </ul>
      </div>

      {/* Skill Ratings */}

      <div style={styles.section}>
        <h2 style={styles.title}>
          ⭐ Skill Ratings
        </h2>

        <ul style={styles.list}>
          <li>Problem Solving ⭐⭐⭐⭐☆</li>
          <li>Coding ⭐⭐⭐⭐⭐</li>
          <li>DSA ⭐⭐⭐⭐☆</li>
          <li>Communication ⭐⭐⭐⭐☆</li>
          <li>Confidence ⭐⭐⭐☆☆</li>
        </ul>
      </div>

      {/* Strengths */}

      <div style={styles.section}>
        <h2 style={styles.title}>
          💪 Overall Strengths
        </h2>

        <ul style={styles.list}>
          {unique(strengths).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}

      <div style={styles.section}>
        <h2 style={styles.title}>
          ⚠ Overall Weaknesses
        </h2>

        <ul style={styles.list}>
          {unique(weaknesses).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Suggestions */}

      <div style={styles.section}>
        <h2 style={styles.title}>
          💡 AI Suggestions
        </h2>

        <ul style={styles.list}>
          {unique(suggestions).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* AI Verdict */}

      <div style={styles.section}>
        <h2 style={styles.title}>
          🤖 Final AI Verdict
        </h2>

        <p
          style={{
            lineHeight: "34px",
            fontSize: "18px",
            whiteSpace: "pre-line",
          }}
        >
          {aiVerdict}
        </p>
      </div>

      {/* Buttons */}

      <button
        style={{
          ...styles.button,
          background: "#16a34a",
        }}
        onClick={downloadPDF}
      >
        📄 Download Final Placement Report
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

export default FinalReport;