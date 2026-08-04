import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import {
  MdDashboard,
  MdOutlineLogout,
} from "react-icons/md";

import {
  FaRobot,
  FaCode,
  FaHistory,
  FaFileAlt,
  FaChartLine,
} from "react-icons/fa";

import {
  HiDocumentText,
} from "react-icons/hi2";

import {
  BsGraphUpArrow,
} from "react-icons/bs";

import {
  PiUserFocusBold,
} from "react-icons/pi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#020617,#0f172a,#1e293b)",
    color: "#fff",
    padding: "40px",
  },
  card: {
    background: "rgba(30,41,59,0.7)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.35)",
    transition: "all .3s ease",
  },
  featureCard: {
    background: "rgba(30,41,59,.7)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: "18px",
    padding: "25px",
    cursor: "pointer",
    transition: "all .3s ease",
  },
  button: {
    background: "linear-gradient(90deg,#2563eb,#38bdf8)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 22px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: ".3s",
  },
};

const handleCardHoverIn = (e) => {
  e.currentTarget.style.transform = "translateY(-8px)";
  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,.35)";
};

const handleCardHoverOut = (e) => {
  e.currentTarget.style.transform = "translateY(0)";
  e.currentTarget.style.boxShadow = "none";
};

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    highestScore: 0,
    recentScores: [],
  });

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      if (!user._id) return;

      try {
        const { data } = await API.get(`/ai/dashboard/${user._id}`);

        if (!isMounted) return;

        setStats({
          totalInterviews: data.stats.totalInterviews || 0,
          completedInterviews: data.stats.completedInterviews || 0,
          averageScore: data.stats.averageScore || 0,
          highestScore: data.stats.highestScore || 0,
          recentScores: data.stats.recentScores || [],
        });
      } catch (error) {
        console.log(error);
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logout Successful");

    navigate("/");
  };

  const chartData = {
    labels: stats.recentScores.map((_, index) => `Interview ${index + 1}`),
    datasets: [
      {
        label: "Interview Score",
        data: stats.recentScores,
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56, 189, 248, 0.2)",
        pointBackgroundColor: "#38bdf8",
        pointBorderColor: "#0f172a",
        pointRadius: 5,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#cbd5e1" },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#38bdf8",
        bodyColor: "#ffffff",
      },
    },
    scales: {
      x: {
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(148,163,184,0.1)" },
      },
      y: {
        min: 0,
        max: 100,
        ticks: { color: "#cbd5e1" },
        grid: { color: "rgba(148,163,184,0.1)" },
      },
    },
  };

  const statCards = [
    {
      label: "Total Interviews",
      value: stats.totalInterviews,
      icon: <HiDocumentText size={34} />,
    },
    {
      label: "Completed",
      value: stats.completedInterviews,
      icon: <FaRobot size={34} />,
    },
    {
      label: "Average Score",
      value: `${stats.averageScore}%`,
      icon: <BsGraphUpArrow size={34} />,
    },
    {
      label: "Highest Score",
      value: `${stats.highestScore}%`,
      icon: <FaChartLine size={34} />,
    },
  ];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <MdDashboard size={42} color="#38bdf8" />

            <h1
              style={{
                fontSize: "36px",
                color: "#38bdf8",
                margin: 0,
              }}
            >
              PrepAI Dashboard
            </h1>
          </div>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "18px",
              marginTop: "8px",
            }}
          >
            Welcome,
            <span
              style={{
                color: "#38bdf8",
                fontWeight: "bold",
                marginLeft: "6px",
              }}
            >
              {user?.name || "User"}
            </span>
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 22px",
            background: "#ef4444",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          <MdOutlineLogout size={22} />
          Logout
        </button>
      </div>

      {/* Statistics Cards */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              ...styles.card,
              padding: "22px",
              textAlign: "center",
            }}
            onMouseEnter={handleCardHoverIn}
            onMouseLeave={handleCardHoverOut}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "8px",
                color: "#38bdf8",
              }}
            >
              {card.icon}
            </div>

            <div
              style={{
                fontSize: "26px",
                fontWeight: "bold",
                color: "#38bdf8",
              }}
            >
              {card.value}
            </div>

            <div style={{ color: "#cbd5e1", marginTop: "6px" }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Performance Graph */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "40px auto 0",
          background: "#1e293b",
          padding: "30px",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,.08)",
          boxShadow: "0 8px 25px rgba(0,0,0,.35)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2
          style={{
            color: "#38bdf8",
            marginBottom: "20px",
          }}
        >
          Performance Graph
        </h2>

        <div style={{ height: "300px" }}>
          {stats.recentScores.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p style={{ color: "#cbd5e1", textAlign: "center" }}>
              No interview scores yet. Complete an interview to see your
              progress here.
            </p>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "50px auto 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          onClick={() => navigate("/interview-setup")}
          style={styles.featureCard}
          onMouseEnter={handleCardHoverIn}
          onMouseLeave={handleCardHoverOut}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#38bdf8",
              marginBottom: "10px",
            }}
          >
            <FaRobot size={26} color="#38bdf8" />
            AI Interview
          </h2>

          <p style={{ color: "#cbd5e1" }}>
            Generate unlimited AI powered mock interviews.
          </p>
        </div>

        <div
          onClick={() => navigate("/coding-round")}
          style={styles.featureCard}
          onMouseEnter={handleCardHoverIn}
          onMouseLeave={handleCardHoverOut}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#38bdf8",
              marginBottom: "10px",
            }}
          >
            <FaCode size={26} color="#38bdf8" />
            Coding Round
          </h2>

          <p style={{ color: "#cbd5e1" }}>
            Practice live coding challenges with AI evaluation.
          </p>
        </div>

        <div
          onClick={() => navigate("/hr-interview")}
          style={styles.featureCard}
          onMouseEnter={handleCardHoverIn}
          onMouseLeave={handleCardHoverOut}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#38bdf8",
              marginBottom: "10px",
            }}
          >
            <PiUserFocusBold size={26} color="#38bdf8" />
            HR Interview
          </h2>

          <p style={{ color: "#cbd5e1" }}>
            Practice behavioral and HR round questions.
          </p>
        </div>

        <div
          onClick={() => navigate("/resume-analyzer")}
          style={styles.featureCard}
          onMouseEnter={handleCardHoverIn}
          onMouseLeave={handleCardHoverOut}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#38bdf8",
              marginBottom: "10px",
            }}
          >
            <FaFileAlt size={26} color="#38bdf8" />
            Resume Analyzer
          </h2>

          <p style={{ color: "#cbd5e1" }}>
            Analyze your resume using Gemini AI.
          </p>
        </div>

        <div
          onClick={() => navigate("/history")}
          style={styles.featureCard}
          onMouseEnter={handleCardHoverIn}
          onMouseLeave={handleCardHoverOut}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#38bdf8",
              marginBottom: "10px",
            }}
          >
            <FaHistory size={26} color="#38bdf8" />
            Interview History
          </h2>

          <p style={{ color: "#cbd5e1" }}>
            View all your previous AI interviews.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;