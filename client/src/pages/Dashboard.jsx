import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "React",
    difficulty: "Easy",
    numberOfQuestions: 5,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logout Successful");

    navigate("/");
  };

  const generateInterview = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter interview title");
      return;
    }

    if (!user._id) {
      toast.error("Please login again");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/ai/generate", {
        userId: user._id,
        title: formData.title,
        category: formData.category,
        difficulty: formData.difficulty,
        numberOfQuestions: Number(formData.numberOfQuestions),
      });

      localStorage.setItem("interview", JSON.stringify(data.interview));

      toast.success("Interview Generated Successfully");

       navigate("/interview");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Something went wrong"
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
        <div>
          <h1
            style={{
              fontSize: "36px",
              color: "#38bdf8",
              marginBottom: "8px",
            }}
          >
            🚀 PrepAI Dashboard
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "18px",
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
            padding: "12px 24px",
            background: "#ef4444",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      {/* Generate Interview Card */}
      <div
        style={{
          background: "#1e293b",
          padding: "30px",
          borderRadius: "20px",
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            color: "#38bdf8",
            marginBottom: "25px",
          }}
        >
          Generate AI Interview
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Interview Title"
          value={formData.title}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "none",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        >
          <option value="React">React</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Node.js">Node.js</option>
          <option value="Express.js">Express.js</option>
          <option value="MongoDB">MongoDB</option>
          <option value="DSA">DSA</option>
          <option value="DBMS">DBMS</option>
          <option value="Operating System">Operating System</option>
          <option value="Computer Networks">Computer Networks</option>
        </select>

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "none",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <input
          type="number"
          name="numberOfQuestions"
          min="1"
          max="20"
          value={formData.numberOfQuestions}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "25px",
            borderRadius: "10px",
            border: "none",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={generateInterview}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background: loading ? "#64748b" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {loading ? "Generating AI Interview..." : "Generate AI Interview"}
        </button>
      </div>

      {/* Features Section */}
      <div
        style={{
          marginTop: "50px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#1e293b",
            padding: "25px",
            borderRadius: "15px",
            transition: "0.3s",
          }}
        >
          <h2
            style={{
              color: "#38bdf8",
              marginBottom: "10px",
            }}
          >
            🤖 AI Interview
          </h2>

          <p style={{ color: "#cbd5e1" }}>
            Generate unlimited AI powered mock interviews.
          </p>
        </div>

        {/* <div
          style={{
            background: "#1e293b",
            padding: "25px",
            borderRadius: "15px",
          }}
        >
          <h2
            style={{
              color: "#38bdf8",
              marginBottom: "10px",
            }}
          >
            📄 Resume Analyzer
          </h2>

          <p style={{ color: "#cbd5e1" }}>
            Analyze your resume using Gemini AI.
          </p>
        </div> */}

       <div
  onClick={() => navigate("/resume-analyzer")}
  style={{
    background: "#1e293b",
    padding: "25px",
    borderRadius: "15px",
    cursor: "pointer",
    transition: "0.3s",
  }}
>
  <h2
    style={{
      color: "#38bdf8",
      marginBottom: "10px",
    }}
  >
    📄 Resume Analyzer
  </h2>

  <p style={{ color: "#cbd5e1" }}>
    Analyze your resume using Gemini AI.
  </p>
</div>

<div
  onClick={() => navigate("/history")}
  style={{
    background: "#1e293b",
    padding: "25px",
    borderRadius: "15px",
    cursor: "pointer",
    transition: "0.3s",
  }}
>
  <h2
    style={{
      color: "#38bdf8",
      marginBottom: "10px",
    }}
  >
    📜 Interview History
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