import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaChartLine,
  FaCheckCircle,
  FaEye,
  FaBuilding,
  FaSearch,
  FaClock,
  FaStar,
  FaFire,
  FaShieldAlt,
} from "react-icons/fa";

function History() {
  const navigate = useNavigate();

  const [user] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);

  // Search, Filter, Sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [sortDirection, setSortDirection] = useState("desc");

  // Get unique values for filters
  const categories = [...new Set(interviews.map((i) => i.category).filter(Boolean))];
  const difficulties = [...new Set(interviews.map((i) => i.difficulty).filter(Boolean))];
  const statuses = [...new Set(interviews.map((i) => i.status).filter(Boolean))];

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

  // Filter and Sort logic
  const getFilteredAndSortedInterviews = useCallback(() => {
    let result = [...interviews];

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.title?.toLowerCase().includes(term) ||
          i.category?.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (filterCategory) {
      result = result.filter((i) => i.category === filterCategory);
    }

    // Filter by difficulty
    if (filterDifficulty) {
      result = result.filter((i) => i.difficulty === filterDifficulty);
    }

    // Filter by status
    if (filterStatus) {
      result = result.filter((i) => i.status === filterStatus);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "score-high":
        result.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
        break;
      case "score-low":
        result.sort((a, b) => (a.totalScore || 0) - (b.totalScore || 0));
        break;
      case "title":
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      default:
        break;
    }

    if (sortDirection === "desc" && sortBy !== "newest" && sortBy !== "oldest") {
      result.reverse();
    }

    return result;
  }, [
    interviews,
    searchTerm,
    filterCategory,
    filterDifficulty,
    filterStatus,
    sortBy,
    sortDirection,
  ]);

  const filteredInterviews = getFilteredAndSortedInterviews();

  // Group by date for timeline
  const groupByDate = (items) => {
    const groups = {};
    items.forEach((item) => {
      const date = new Date(item.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });
    return groups;
  };

  const groupedInterviews = groupByDate(filteredInterviews);
  const sortedDates = Object.keys(groupedInterviews).sort(
    (a, b) => new Date(b) - new Date(a)
  );

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

  // Helper to get status color
  const getStatusColor = (status) => {
    const map = {
      completed: "#22c55e",
      pending: "#eab308",
      failed: "#ef4444",
      in_progress: "#3b82f6",
    };
    return map[status?.toLowerCase()] || "#94a3b8";
  };

  // Helper to get difficulty color
  const getDifficultyColor = (diff) => {
    const map = {
      easy: "#22c55e",
      medium: "#eab308",
      hard: "#ef4444",
      expert: "#8b5cf6",
    };
    return map[diff?.toLowerCase()] || "#94a3b8";
  };

  // Helper to get score label
  const getScoreLabel = (score) => {
    if (score >= 80) return { label: "Excellent", icon: <FaStar color="#f59e0b" /> };
    if (score >= 60) return { label: "Good", icon: <FaCheckCircle color="#22c55e" /> };
    if (score >= 40) return { label: "Average", icon: <FaClock color="#eab308" /> };
    return { label: "Needs Work", icon: <FaFire color="#ef4444" /> };
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterDifficulty("");
    setFilterStatus("");
    setSortBy("newest");
    setSortDirection("desc");
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
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid #1e293b",
              borderTop: "4px solid #38bdf8",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
          Loading Interview History...
        </div>
      </div>
    );
  }

  // Count active filters
  const activeFilterCount =
    [filterCategory, filterDifficulty, filterStatus].filter(Boolean).length +
    (searchTerm.trim() ? 1 : 0);

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
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <h1
          style={{
            color: "#38bdf8",
            fontSize: "38px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span>📊</span> Interview History
          <span
            style={{
              fontSize: "16px",
              fontWeight: "normal",
              color: "#94a3b8",
              marginLeft: "10px",
            }}
          >
            ({interviews.length} total)
          </span>
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
            display: "flex",
            alignItems: "center",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1d4ed8";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#2563eb";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <FaArrowLeft />
          &nbsp; Dashboard
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{
          background: "#1e293b",
          borderRadius: "16px",
          padding: "20px 24px",
          marginBottom: "30px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            alignItems: "center",
          }}
        >
          {/* Search */}
          <div
            style={{
              flex: "1",
              minWidth: "200px",
              display: "flex",
              alignItems: "center",
              background: "#0f172a",
              borderRadius: "10px",
              padding: "0 14px",
              border: "1px solid #334155",
              transition: "0.3s",
            }}
          >
            <FaSearch color="#64748b" size={14} />
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                padding: "12px 12px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                width: "100%",
              }}
            />
            {searchTerm && (
              <span
                onClick={() => setSearchTerm("")}
                style={{
                  cursor: "pointer",
                  color: "#64748b",
                  fontSize: "18px",
                  fontWeight: "bold",
                  padding: "0 4px",
                }}
              >
                ×
              </span>
            )}
          </div>

          {/* Category Filter */}
          <div style={{ minWidth: "140px" }}>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "10px",
                padding: "12px 14px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                width: "100%",
                cursor: "pointer",
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div style={{ minWidth: "130px" }}>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "10px",
                padding: "12px 14px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                width: "100%",
                cursor: "pointer",
              }}
            >
              <option value="">All Difficulty</option>
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: "130px" }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "10px",
                padding: "12px 14px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                width: "100%",
                cursor: "pointer",
              }}
            >
              <option value="">All Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div style={{ minWidth: "140px" }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "10px",
                padding: "12px 14px",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                width: "100%",
                cursor: "pointer",
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="score-high">Score: High to Low</option>
              <option value="score-low">Score: Low to High</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              style={{
                background: "transparent",
                border: "1px solid #475569",
                borderRadius: "10px",
                padding: "12px 18px",
                color: "#94a3b8",
                fontSize: "14px",
                cursor: "pointer",
                transition: "0.3s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#334155";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#94a3b8";
              }}
            >
              ✕ Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
            </button>
          )}
        </div>

        {/* Active filter badges */}
        {activeFilterCount > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid #334155",
            }}
          >
            {searchTerm && (
              <span
                style={{
                  background: "#2563eb",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FaSearch size={10} /> {searchTerm}
                <span
                  onClick={() => setSearchTerm("")}
                  style={{ cursor: "pointer", fontWeight: "bold", marginLeft: "4px" }}
                >
                  ×
                </span>
              </span>
            )}
            {filterCategory && (
              <span
                style={{
                  background: "#7c3aed",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FaBuilding size={10} /> {filterCategory}
                <span
                  onClick={() => setFilterCategory("")}
                  style={{ cursor: "pointer", fontWeight: "bold", marginLeft: "4px" }}
                >
                  ×
                </span>
              </span>
            )}
            {filterDifficulty && (
              <span
                style={{
                  background: "#059669",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FaShieldAlt size={10} /> {filterDifficulty}
                <span
                  onClick={() => setFilterDifficulty("")}
                  style={{ cursor: "pointer", fontWeight: "bold", marginLeft: "4px" }}
                >
                  ×
                </span>
              </span>
            )}
            {filterStatus && (
              <span
                style={{
                  background: "#d97706",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FaCheckCircle size={10} /> {filterStatus}
                <span
                  onClick={() => setFilterStatus("")}
                  style={{ cursor: "pointer", fontWeight: "bold", marginLeft: "4px" }}
                >
                  ×
                </span>
              </span>
            )}
          </div>
        )}
      </div>

      {interviews.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "120px",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>📭</div>
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
      ) : filteredInterviews.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "60px",
            padding: "40px",
            background: "#1e293b",
            borderRadius: "16px",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "15px" }}>🔍</div>
          <h2 style={{ color: "#94a3b8", marginBottom: "10px" }}>
            No interviews match your filters
          </h2>
          <p style={{ color: "#64748b" }}>
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={clearFilters}
            style={{
              marginTop: "20px",
              padding: "10px 24px",
              background: "#2563eb",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        // Timeline Layout
        <div style={{ position: "relative" }}>
          {/* Vertical timeline line */}
          <div
            style={{
              position: "absolute",
              left: "16px",
              top: "0",
              bottom: "0",
              width: "2px",
              background: "linear-gradient(to bottom, #38bdf8, #1e293b, #38bdf8)",
              opacity: 0.3,
              borderRadius: "2px",
            }}
          />

          {sortedDates.map((date) => (
            <div key={date} style={{ marginBottom: "40px" }}>
              {/* Date header with timeline dot */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "20px",
                  paddingLeft: "36px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "#38bdf8",
                    border: "3px solid #0f172a",
                    boxShadow: "0 0 20px rgba(56, 189, 248, 0.3)",
                    zIndex: 2,
                  }}
                />
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#38bdf8",
                    background: "rgba(56, 189, 248, 0.1)",
                    padding: "4px 20px",
                    borderRadius: "20px",
                    border: "1px solid rgba(56, 189, 248, 0.15)",
                  }}
                >
                  {date}
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                  }}
                >
                  {groupedInterviews[date].length} interview
                  {groupedInterviews[date].length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Cards for this date */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                  gap: "20px",
                  paddingLeft: "36px",
                }}
              >
                {groupedInterviews[date].map((interview) => {
                  const scoreLabel = getScoreLabel(interview.totalScore || 0);
                  return (
                    <div
                      key={interview._id}
                      style={{
                        background: "#1e293b",
                        padding: "24px 26px",
                        borderRadius: "16px",
                        border: "1px solid rgba(255,255,255,0.06)",
                        transition: "0.3s",
                        cursor: "pointer",
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.borderColor =
                          "rgba(56, 189, 248, 0.3)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 40px rgba(0,0,0,0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0px)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.06)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {/* Timeline connector line - to the left of each card */}
                      <div
                        style={{
                          position: "absolute",
                          left: "-20px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "16px",
                          height: "2px",
                          background: "rgba(56, 189, 248, 0.2)",
                        }}
                      />

                      {/* Card header with title and score label */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: "14px",
                        }}
                      >
                        <h2
                          style={{
                            color: "#38bdf8",
                            fontSize: "20px",
                            margin: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span>🎯</span> {interview.title}
                        </h2>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "13px",
                            fontWeight: "bold",
                            background:
                              interview.totalScore >= 80
                                ? "rgba(34, 197, 94, 0.15)"
                                : interview.totalScore >= 60
                                ? "rgba(234, 179, 8, 0.15)"
                                : "rgba(239, 68, 68, 0.15)",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            color:
                              interview.totalScore >= 80
                                ? "#22c55e"
                                : interview.totalScore >= 60
                                ? "#eab308"
                                : "#ef4444",
                            border:
                              interview.totalScore >= 80
                                ? "1px solid rgba(34, 197, 94, 0.2)"
                                : interview.totalScore >= 60
                                ? "1px solid rgba(234, 179, 8, 0.2)"
                                : "1px solid rgba(239, 68, 68, 0.2)",
                          }}
                        >
                          {scoreLabel.icon} {scoreLabel.label}
                        </div>
                      </div>

                      {/* Meta info row */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "16px",
                          marginBottom: "14px",
                          fontSize: "14px",
                          color: "#cbd5e1",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <FaBuilding color="#38bdf8" size={13} />
                          <strong>Category:</strong> {interview.category || "N/A"}
                        </span>

                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <FaCalendarAlt color="#38bdf8" size={13} />
                          <strong>Date:</strong>{" "}
                          {new Date(interview.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Second row: difficulty + status */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "16px",
                          marginBottom: "14px",
                          fontSize: "14px",
                          color: "#cbd5e1",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <FaShieldAlt color="#38bdf8" size={13} />
                          <strong>Difficulty:</strong>{" "}
                          <span
                            style={{
                              color: getDifficultyColor(interview.difficulty),
                              fontWeight: "600",
                            }}
                          >
                            {interview.difficulty
                              ? interview.difficulty.charAt(0).toUpperCase() +
                                interview.difficulty.slice(1)
                              : "N/A"}
                          </span>
                        </span>

                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <FaCheckCircle
                            color={getStatusColor(interview.status)}
                            size={13}
                          />
                          <strong>Status:</strong>{" "}
                          <span
                            style={{
                              color: getStatusColor(interview.status),
                              fontWeight: "600",
                            }}
                          >
                            {interview.status
                              ? interview.status.charAt(0).toUpperCase() +
                                interview.status.slice(1)
                              : "N/A"}
                          </span>
                        </span>
                      </div>

                      {/* Score with progress bar */}
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "6px",
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "14px",
                              color: "#94a3b8",
                            }}
                          >
                            <FaChartLine color="#22c55e" size={13} />
                            <strong>Score:</strong>
                          </span>
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              color:
                                interview.totalScore >= 80
                                  ? "#22c55e"
                                  : interview.totalScore >= 60
                                  ? "#eab308"
                                  : "#ef4444",
                            }}
                          >
                            {interview.totalScore || 0}%
                          </span>
                        </div>
                        <div
                          style={{
                            background: "#334155",
                            height: "8px",
                            borderRadius: "10px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(interview.totalScore || 0, 100)}%`,
                              height: "100%",
                              background:
                                interview.totalScore >= 80
                                  ? "linear-gradient(90deg, #22c55e, #4ade80)"
                                  : interview.totalScore >= 60
                                  ? "linear-gradient(90deg, #eab308, #facc15)"
                                  : "linear-gradient(90deg, #ef4444, #f87171)",
                              borderRadius: "10px",
                              transition: "width 0.6s ease",
                            }}
                          />
                        </div>
                      </div>

                      {/* View Report Button */}
                      <button
                        onClick={() => openReport(interview)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          background: "#2563eb",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "15px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          transition: "0.3s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#1d4ed8";
                          e.currentTarget.style.transform = "scale(1.01)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#2563eb";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <FaEye />
                        View Report
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;