import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

// ===========================
// Constants
// ===========================

const STORAGE_KEY_INTERVIEW = "interview";
const STORAGE_KEY_START_TIME = "interviewStartTime";
const STORAGE_KEY_ANSWERS = "answers";

// ===========================
// Helpers
// ===========================
function loadInterview() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INTERVIEW);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      !Array.isArray(parsed.questions) ||
      parsed.questions.length === 0
    ) {
      return null;
    }
    return parsed;
  } catch (err) {
    console.error("Failed to parse interview from localStorage:", err);
    return null;
  }
}

function loadAnswers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ANSWERS);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};

    return parsed;
  } catch (err) {
    console.error("Failed to parse answers from localStorage:", err);
    return {};
  }
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// ===========================
// Styles
// ===========================
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "40px",
  },
  loadingScreen: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
    fontSize: "25px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "16px",
  },
  title: {
    color: "#38bdf8",
    fontSize: "36px",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: "18px",
  },
  timerBadge: {
    background: "#1e293b",
    padding: "12px 24px",
    borderRadius: "12px",
    fontWeight: "bold",
    color: "#38bdf8",
    fontSize: "20px",
  },
  timerBadgeLow: {
    color: "#f87171",
  },
  progressWrapper: {
    marginBottom: "25px",
  },
  progressLabel: {
    marginBottom: "10px",
    color: "#cbd5e1",
  },
  progressTrack: {
    width: "100%",
    height: "10px",
    background: "#334155",
    borderRadius: "10px",
  },
  progressFill: {
    height: "100%",
    background: "#38bdf8",
    borderRadius: "10px",
    transition: "0.3s",
  },
  questionCard: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 0 15px rgba(0,0,0,0.2)",
  },
  questionText: {
    color: "#38bdf8",
    marginBottom: "20px",
    lineHeight: "1.5",
  },
  answerTextarea: {
    width: "100%",
    padding: "18px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    resize: "vertical",
    fontSize: "16px",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  navRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "30px",
  },
  navButton: (disabled) => ({
    padding: "14px 28px",
    background: disabled ? "#475569" : "#334155",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  }),
  nextButton: {
    padding: "14px 30px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  submitButton: (disabled) => ({
    padding: "14px 30px",
    background: disabled ? "#16794a" : "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  }),
};

// ===========================
// Main Component
// ===========================
function Interview() {
  const navigate = useNavigate();

  // Loaded once on mount; guards against corrupted/missing localStorage data.
  const [interview] = useState(() => loadInterview());

  // Persist interview start time so refreshing the page doesn't reset the countdown.
  useEffect(() => {
    if (!interview) return;

    let startTime = localStorage.getItem(STORAGE_KEY_START_TIME);

    if (!startTime) {
      localStorage.setItem(
        STORAGE_KEY_START_TIME,
        Date.now().toString()
      );
    }
  }, [interview]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(() => loadAnswers());
  const [timeLeft, setTimeLeft] = useState(() => {
  const interview = loadInterview();

  return (interview?.interviewTime || 15) * 60;
});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasSubmittedRef = useRef(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // ===========================
  // Redirect if interview missing/invalid
  // ===========================
  useEffect(() => {
    if (!interview) {
      toast.error("Interview Not Found");
      navigate("/dashboard");
    }
  }, [interview, navigate]);

  // ===========================
  // Submit Interview
  // ===========================
  const handleSubmit = useCallback(async () => {
    if (hasSubmittedRef.current) return;

    if (!interview || !interview._id) {
      toast.error("Interview data not found.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/");
      return;
    }

    hasSubmittedRef.current = true;
    setIsSubmitting(true);

    try {
      // Convert answers object into array
      const answerArray = interview.questions.map(
        (_, index) => answers[index] || ""
      );

      // Submit Interview
      const response = await API.post(
        `/ai/${interview._id}/submit`,
        {
          answers: answerArray,
        }
      );

      // ==========================
      // Debug Logs
      // ==========================
      console.log("========== API RESPONSE ==========");
      console.log(response.data);
      console.log("Evaluation:", response.data.evaluation);
      console.log("Interview:", response.data.interview);
      console.log("=================================");

      // Save report data
      localStorage.setItem(
        "evaluation",
        JSON.stringify(response.data.evaluation)
      );

      localStorage.setItem(
        "completedInterview",
        JSON.stringify(response.data.interview)
      );

      console.log("Saved Evaluation:", localStorage.getItem("evaluation"));

      console.log(
        "Saved Interview:",
        localStorage.getItem("completedInterview")
      );

      toast.success("Interview Evaluated Successfully");

      console.log("Navigating to /report");

      localStorage.removeItem(STORAGE_KEY_START_TIME);
      localStorage.removeItem(STORAGE_KEY_ANSWERS);

      navigate("/report");
    } catch (error) {
      console.error("Submit Error:", error);

      toast.error(error.response?.data?.message || "Failed to submit interview");

      hasSubmittedRef.current = false;
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, interview, navigate]);

  // ===========================
  // Timer countdown
  // ===========================
  useEffect(() => {
    if (!interview) return;

    const totalSeconds = (interview.interviewTime || 15) * 60;

    const startTime = Number(
      localStorage.getItem(STORAGE_KEY_START_TIME)
    );

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);

      const remaining = totalSeconds - elapsed;

      if (remaining <= 0) {
        setTimeLeft(0);
        handleSubmit();
        return;
      }

      setTimeLeft(remaining);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [interview, handleSubmit]);

  // ===========================
  // Answer change handler
  // ===========================
  const handleAnswerChange = (e) => {
    setAnswers((prev) => {
      const updatedAnswers = {
        ...prev,
        [currentQuestion]: e.target.value,
      };

      localStorage.setItem(
        STORAGE_KEY_ANSWERS,
        JSON.stringify(updatedAnswers)
      );

      return updatedAnswers;
    });
  };

  // ===========================================
  // Start Voice Recording
  // ===========================================
  const startRecording = () => {
    resetTranscript();

    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });

    toast.success("Listening...");
  };

  // ===========================================
  // Stop Voice Recording
  // ===========================================
  const stopRecording = () => {
    SpeechRecognition.stopListening();

    // Fill textarea from the speech transcript once recording stops.
    // Done here (event handler) instead of a useEffect, so we don't
    // trigger a setState-in-effect cascade.
    if (transcript) {
      setAnswers((prev) => {
        const updatedAnswers = {
          ...prev,
          [currentQuestion]: transcript,
        };

        localStorage.setItem(
          STORAGE_KEY_ANSWERS,
          JSON.stringify(updatedAnswers)
        );

        return updatedAnswers;
      });
    }

    toast.success("Recording Stopped");
  };

  // ===========================================
  // AI Read Question
  // ===========================================
  const speakQuestion = () => {
    if (!interview) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(
      interview.questions[currentQuestion].question
    );

    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  // ===========================
  // Navigation handlers
  // ===========================
  const handlePrevious = () => {
    setCurrentQuestion((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (!interview) return;
    setCurrentQuestion((prev) =>
      Math.min(interview.questions.length - 1, prev + 1)
    );
  };

  // ===========================
  // Guard: browser support
  // ===========================
  if (!browserSupportsSpeechRecognition) {
    return (
      <div style={styles.loadingScreen}>
        Speech Recognition is not supported in this browser.
      </div>
    );
  }

  // ===========================
  // Guard: loading / redirect state
  // ===========================
  if (!interview) {
    return <div style={styles.loadingScreen}>Loading interview...</div>;
  }

  const isLastQuestion = currentQuestion === interview.questions.length - 1;
  const progressPercent =
    ((currentQuestion + 1) / interview.questions.length) * 100;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Interview</h1>
          <p style={styles.subtitle}>
            Question {currentQuestion + 1} of {interview.questions.length}
          </p>
        </div>
       <div
  style={{
    ...styles.timerBadge,
    ...(timeLeft <= 60 ? styles.timerBadgeLow : {}),
  }}
>
  ⏰ {formatTime(timeLeft)}
</div>
      </div>

      <div style={styles.progressWrapper}>
        <div style={styles.progressLabel}>Progress</div>
        <div style={styles.progressTrack}>
          <div
            style={{ ...styles.progressFill, width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div style={styles.questionCard}>
        <h3 style={styles.questionText}>
          {interview.questions[currentQuestion]?.question}
        </h3>
        <textarea
          style={styles.answerTextarea}
          rows={6}
          value={answers[currentQuestion] || ""}
          onChange={handleAnswerChange}
          placeholder="Type your answer here..."
        />
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={speakQuestion}
            style={{
              padding: "12px 20px",
              background: "#8b5cf6",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            🔊 Read Question
          </button>

          {!listening ? (
            <button
              onClick={startRecording}
              style={{
                padding: "12px 20px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              🎤 Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              style={{
                padding: "12px 20px",
                background: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              🛑 Stop Recording
            </button>
          )}
        </div>
      </div>

      <div style={styles.navRow}>
        <button
          style={styles.navButton(currentQuestion === 0)}
          disabled={currentQuestion === 0}
          onClick={handlePrevious}
        >
          Previous
        </button>

        {isLastQuestion ? (
          <button
            style={styles.submitButton(isSubmitting)}
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <button style={styles.nextButton} onClick={handleNext}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default Interview;