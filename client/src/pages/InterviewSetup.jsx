import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MdOutlineTimer } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import API from "../services/api";

function InterviewSetup() {
  const navigate = useNavigate();

  // Read localStorage synchronously via the lazy initializer (runs once,
  // before first paint) instead of setState-in-effect, which avoids an
  // extra cascading render.
  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    company: "General",
    role: "Software Engineer",
    difficulty: "Medium",
    language: "English",
    questionCount: 10,
    interviewTime: 15,
    topics: [],
  });

  // Redirect if there was no valid user in localStorage. No setState here,
  // just a side effect (navigation), so it's a clean use of useEffect.
  useEffect(() => {
    if (!user) {
      toast.error("Please log in to continue");
      navigate("/");
    }
  }, [user, navigate]);

  const companies = [
    "General",
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Apple",
    "Netflix",
    "Infosys",
    "TCS",
    "Wipro",
    "Accenture",
    "Capgemini",
    "Deloitte",
  ];

  const roles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Analyst",
    "AI/ML Engineer",
    "DevOps Engineer",
    "Cloud Engineer",
  ];

  const topics = [
    "Arrays",
    "Strings",
    "Linked List",
    "Stack",
    "Queue",
    "Trees",
    "Graphs",
    "Recursion",
    "Dynamic Programming",
    "OOP",
    "DBMS",
    "Operating System",
    "Computer Networks",
    "SQL",
    "JavaScript",
    "React",
    "Node.js",
    "System Design",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTopic = (topic) => {
    if (formData.topics.includes(topic)) {
      setFormData({
        ...formData,
        topics: formData.topics.filter((item) => item !== topic),
      });
    } else {
      setFormData({
        ...formData,
        topics: [...formData.topics, topic],
      });
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please log in to continue");
      return;
    }

    if (formData.topics.length < 2) {
      toast.error("Please select at least 2 topics");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/ai/generate", {
        userId: user._id,
        company: formData.company,
        role: formData.role,
        difficulty: formData.difficulty,
        language: formData.language,
        questionCount: Number(formData.questionCount),
        interviewTime: Number(formData.interviewTime),
        topics: formData.topics,
      });

      if (!data.success) {
        toast.error("Failed to generate interview");
        return;
      }

      localStorage.setItem("interview", JSON.stringify(data.interview));

      localStorage.removeItem("answers");
      localStorage.removeItem("evaluation");
      localStorage.removeItem("completedInterview");
      localStorage.removeItem("interviewStartTime");

      toast.success("Interview Generated Successfully");

      navigate("/interview");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to Generate Interview"
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "40px",
      fontFamily: "Arial",
    },

    container: {
      maxWidth: "900px",
      margin: "auto",
      background: "#1e293b",
      padding: "35px",
      borderRadius: "20px",
    },

    heading: {
      textAlign: "center",
      color: "#38bdf8",
      marginBottom: "35px",
      fontSize: "38px",
    },

    label: {
      display: "block",
      marginBottom: "10px",
      fontWeight: "bold",
      color: "#38bdf8",
    },

    input: {
      width: "100%",
      padding: "14px",
      marginBottom: "20px",
      borderRadius: "10px",
      border: "none",
      fontSize: "16px",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
      gap: "20px",
    },

    card: {
      background: "rgba(15,23,42,.65)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,.08)",
      borderRadius: "16px",
      padding: "20px",
      transition: ".3s",
    },

    topicsBox: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
      gap: "12px",
      marginTop: "20px",
    },

    topicChip: {
      padding: "14px 18px",
      borderRadius: "30px",
      background: "#1e293b",
      border: "1px solid rgba(255,255,255,.08)",
      cursor: "pointer",
      transition: ".25s",
      userSelect: "none",
      textAlign: "center",
      fontWeight: "500",
    },

    button: {
      width: "100%",
      marginTop: "35px",
      padding: "18px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
      boxShadow: "0 10px 25px rgba(37,99,235,.35)",
      transition: ".3s",
    },
  };

  const cardHoverHandlers = {
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,.35)";
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>🤖 AI Interview Setup</h1>

        {/* AI Ready Banner */}
        <div
          style={{
            marginBottom: "30px",
            padding: "18px",
            borderRadius: "18px",
            background: "linear-gradient(90deg,#2563eb,#38bdf8)",
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "18px",
            boxShadow: "0 10px 25px rgba(37,99,235,.35)",
          }}
        >
          🤖 AI is ready to generate your personalized interview.
        </div>

        <div style={{ ...styles.grid, marginTop: "20px" }}>
          {/* Company */}
          <div style={styles.card} {...cardHoverHandlers}>
            <label style={styles.label}>Company</label>
            <select
              name="company"
              value={formData.company}
              onChange={handleChange}
              style={styles.input}
            >
              {companies.map((company) => (
                <option key={company}>{company}</option>
              ))}
            </select>
          </div>

          {/* Role */}
          <div style={styles.card} {...cardHoverHandlers}>
            <label style={styles.label}>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.input}
            >
              {roles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div style={styles.card} {...cardHoverHandlers}>
            <label style={styles.label}>Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              style={styles.input}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                gap: "10px",
              }}
            >
              <span
                style={{
                  background:
                    formData.difficulty === "Easy" ? "#16a34a" : "#334155",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                }}
              >
                Easy
              </span>

              <span
                style={{
                  background:
                    formData.difficulty === "Medium" ? "#f59e0b" : "#334155",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                }}
              >
                Medium
              </span>

              <span
                style={{
                  background:
                    formData.difficulty === "Hard" ? "#dc2626" : "#334155",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                }}
              >
                Hard
              </span>
            </div>
          </div>

          {/* Language */}
          <div style={styles.card} {...cardHoverHandlers}>
            <label style={styles.label}>Interview Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              style={styles.input}
            >
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>

          {/* Question Count */}
          <div style={styles.card} {...cardHoverHandlers}>
            <label style={styles.label}>Number of Questions</label>
            <select
              name="questionCount"
              value={formData.questionCount}
              onChange={handleChange}
              style={styles.input}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>

          {/* Interview Time */}
          <div style={styles.card} {...cardHoverHandlers}>
            <label
              style={{
                ...styles.label,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <MdOutlineTimer size={22} />
              Interview Time
            </label>
            <select
              name="interviewTime"
              value={formData.interviewTime}
              onChange={handleChange}
              style={styles.input}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </div>
        </div>

        {/* Topics */}
        <h2
          style={{
            color: "#38bdf8",
            marginTop: "35px",
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <BsStars />
          Choose Interview Topics
        </h2>

        <p
          style={{
            marginBottom: "20px",
            color: "#94a3b8",
          }}
        >
          Selected Topics :
          <strong
            style={{
              color: "#38bdf8",
              marginLeft: "8px",
            }}
          >
            {formData.topics.length}
          </strong>
        </p>

        <div style={{ ...styles.topicsBox, marginTop: "25px" }}>
          {topics.map((topic) => (
            <div
              key={topic}
              onClick={() => handleTopic(topic)}
              style={{
                ...styles.topicChip,

                background: formData.topics.includes(topic)
                  ? "linear-gradient(90deg,#2563eb,#38bdf8)"
                  : "#1e293b",

                color: formData.topics.includes(topic) ? "#fff" : "#cbd5e1",

                transform: formData.topics.includes(topic)
                  ? "scale(1.04)"
                  : "scale(1)",

                boxShadow: formData.topics.includes(topic)
                  ? "0 10px 25px rgba(37,99,235,.35)"
                  : "none",
              }}
            >
              {topic}
            </div>
          ))}
        </div>

        {/* Selected Interview Summary */}
        <div
          style={{
            marginTop: "35px",
            background: "rgba(15,23,42,.65)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: "18px",
            padding: "20px",
          }}
        >
          <h3
            style={{
              color: "#38bdf8",
              marginBottom: "15px",
            }}
          >
            📋 Interview Summary
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: "15px",
            }}
          >
            <div>
              🏢 <strong>Company:</strong> {formData.company}
            </div>

            <div>
              💼 <strong>Role:</strong> {formData.role}
            </div>

            <div>
              🔥 <strong>Difficulty:</strong> {formData.difficulty}
            </div>

            <div>
              🌐 <strong>Language:</strong> {formData.language}
            </div>

            <div>
              ❓ <strong>Questions:</strong> {formData.questionCount}
            </div>

            <div>
              ⏱ <strong>Time:</strong> {formData.interviewTime} mins
            </div>

            <div>
              📚 <strong>Topics:</strong> {formData.topics.length}
            </div>
          </div>
        </div>

        <button
          style={{
            ...styles.button,
            transform: loading ? "scale(.98)" : "scale(1)",
          }}
          disabled={loading}
          onClick={handleSubmit}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow =
              "0 20px 40px rgba(37,99,235,.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(37,99,235,.35)";
          }}
        >
          {loading ? "Generating AI Interview..." : "🚀 Generate AI Interview"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          Powered by <strong>Google Gemini AI</strong> • Personalized
          Questions • Company Specific Interviews
        </p>
      </div>
    </div>
  );
}

export default InterviewSetup;