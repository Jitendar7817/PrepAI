const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load Environment Variables
dotenv.config();

// Database Connection
const connectDB = require("./config/db");

// ==========================
// Import Routes
// ==========================

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

// IMPORTANT: Linux is case-sensitive
const codingRoutes = require("./routes/CodingRoutes");
const hrRoutes = require("./routes/hrRoutes");
const finalReportRoutes = require("./routes/FinalReportRoutes");

// Initialize Express
const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================
// Home Route
// ==========================

app.get("/", (req, res) => {
  res.send("🚀 PrepAI Backend Running...");
});

// ==========================
// API Routes
// ==========================

// Authentication
app.use("/api/auth", authRoutes);

// AI Interview
app.use("/api/ai", aiRoutes);

// Resume Analyzer
app.use("/api/resume", resumeRoutes);

// Coding Round
app.use("/api/coding", codingRoutes);

// HR Interview
app.use("/api/hr", hrRoutes);

// Final Placement Report
app.use("/api/final-report", finalReportRoutes);

// ==========================
// 404 Route
// ==========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ==========================
// Start Server
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});