import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRobot,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Password strength calculation (0-4)
  const getPasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const strength = getPasswordStrength(formData.password);

  const strengthConfig = [
    { label: "", color: "#334155", width: "0%" },
    { label: "Weak", color: "#ef4444", width: "25%" },
    { label: "Fair", color: "#f97316", width: "50%" },
    { label: "Good", color: "#eab308", width: "75%" },
    { label: "Strong", color: "#22c55e", width: "100%" },
  ];

  const currentStrength = strengthConfig[strength];

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const passwordsMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success(response.data.message);

      navigate("/");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginBottom: "15px",
          }}
        >
          <FaRobot
            size={48}
            color="#38bdf8"
          />

          <h1 className="logo">
            PrepAI
          </h1>
        </div>

        <h2
          style={{
            textAlign: "center",
            fontSize: "30px",
            color: "#fff",
            marginBottom: "8px",
          }}
        >
          Create Account 🚀
        </h2>

        <p
          className="subtitle"
          style={{
            color: "#94a3b8",
            lineHeight: "28px",
          }}
        >
          Start your AI Interview Journey
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              name="name"
              placeholder="Enter your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Password Strength Indicator */}
          {formData.password.length > 0 && (
            <div style={{ marginBottom: "16px", marginTop: "-8px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Password Strength
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: currentStrength.color,
                    fontWeight: 600,
                  }}
                >
                  {currentStrength.label}
                </span>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "6px",
                  borderRadius: "4px",
                  backgroundColor: "#1e293b",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: currentStrength.width,
                    height: "100%",
                    backgroundColor: currentStrength.color,
                    borderRadius: "4px",
                    transition: "width 0.3s ease, background-color 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Real-time Confirm Password Feedback */}
          {formData.confirmPassword.length > 0 && (
            <p
              style={{
                fontSize: "13px",
                marginTop: "-8px",
                marginBottom: "16px",
                color: passwordsMatch ? "#22c55e" : "#ef4444",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {passwordsMatch ? "🟢 Passwords match" : "🔴 Passwords do not match"}
            </p>
          )}

          <button
            className="login-btn"
            disabled={loading || passwordsMismatch}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Register
                <FaArrowRight />
              </>
            )}
          </button>

        </form>

        <p className="register-text">
          <FaShieldAlt
            style={{
              marginRight: "8px",
              color: "#38bdf8",
            }}
          />
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;