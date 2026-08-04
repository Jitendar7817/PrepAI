import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";

import InterviewSetup from "./pages/InterviewSetup";
import Interview from "./pages/Interview";
import Report from "./pages/Report";

import CodingRound from "./pages/CodingRound";
import CodingReport from "./pages/CodingReport";

import HRInterview from "./pages/HRInterview";
import HRReport from "./pages/HRReport";

import FinalReport from "./pages/FinalReport";

import History from "./pages/History";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";

function App() {
  const token = localStorage.getItem("token");

  const PrivateRoute = (component) => {
    return token ? component : <Navigate to="/" replace />;
  };

  return (
    <Routes>
      {/* ========================= */}
      {/* Public Routes */}
      {/* ========================= */}

      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* ========================= */}
      {/* Dashboard */}
      {/* ========================= */}

      <Route
        path="/dashboard"
        element={PrivateRoute(<Dashboard />)}
      />

      {/* ========================= */}
      {/* AI Interview Setup */}
      {/* ========================= */}

      <Route
        path="/interview-setup"
        element={PrivateRoute(<InterviewSetup />)}
      />

      {/* ========================= */}
      {/* AI Technical Interview */}
      {/* ========================= */}

      <Route
        path="/interview"
        element={PrivateRoute(<Interview />)}
      />

      {/* ========================= */}
      {/* Technical Report */}
      {/* ========================= */}

      <Route
        path="/report"
        element={PrivateRoute(<Report />)}
      />

      {/* ========================= */}
      {/* Coding Round */}
      {/* ========================= */}

      <Route
        path="/coding-round"
        element={PrivateRoute(<CodingRound />)}
      />

      {/* ========================= */}
      {/* Coding Report */}
      {/* ========================= */}

      <Route
        path="/coding-report"
        element={PrivateRoute(<CodingReport />)}
      />

      {/* ========================= */}
      {/* HR Interview */}
      {/* ========================= */}

      <Route
        path="/hr-interview"
        element={PrivateRoute(<HRInterview />)}
      />

      {/* ========================= */}
      {/* HR Report */}
      {/* ========================= */}

      <Route
        path="/hr-report"
        element={PrivateRoute(<HRReport />)}
      />

      {/* ========================= */}
      {/* Final Placement Report */}
      {/* ========================= */}

      <Route
        path="/final-report"
        element={PrivateRoute(<FinalReport />)}
      />

      {/* ========================= */}
      {/* Interview History */}
      {/* ========================= */}

      <Route
        path="/history"
        element={PrivateRoute(<History />)}
      />

      {/* ========================= */}
      {/* Resume Analyzer */}
      {/* ========================= */}

      <Route
        path="/resume-analyzer"
        element={PrivateRoute(<ResumeAnalyzer />)}
      />

      {/* ========================= */}
      {/* Invalid Route */}
      {/* ========================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;