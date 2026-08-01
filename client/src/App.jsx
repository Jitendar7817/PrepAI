import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Report from "./pages/Report";
import History from "./pages/History";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          token ? (
            <Dashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Interview */}
      <Route
        path="/interview"
        element={
          token ? (
            <Interview />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Report */}
      <Route
        path="/report"
        element={
          token ? (
            <Report />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Interview History */}
      <Route
        path="/history"
        element={
          token ? (
            <History />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Resume Analyzer */}
      <Route
        path="/resume-analyzer"
        element={
          token ? (
            <ResumeAnalyzer />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Invalid Route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;