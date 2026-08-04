import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  FaRobot,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", formData);

      // Save JWT Token
      localStorage.setItem("token", data.token);

      // Save Logged In User
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      toast.success("Login Successful");

      // Redirect Dashboard
      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message || "Login Failed"
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
            fontSize: "30px",
            marginBottom: "8px",
            color: "#fff"
          }}
        >
          Welcome Back 👋
        </h2>

        <p
          className="subtitle"
          style={{
            color: "#94a3b8",
            lineHeight: "28px"
          }}
        >
          Sign in to continue your AI Interview Journey
        </p>

        <form onSubmit={handleSubmit}>

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
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <span
              className="eye-icon"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {
                showPassword
                  ? <FaEyeSlash />
                  : <FaEye />
              }
            </span>

          </div>

          <button
            className="login-btn"
            disabled={loading}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px"
            }}
          >
            {
              loading
                ? "Logging In..."
                : <>
                    Login
                    <FaArrowRight />
                  </>
            }
          </button>

        </form>

        <p className="register-text">

          <FaShieldAlt
            style={{
              marginRight: "8px",
              color: "#38bdf8"
            }}
          />

          Don't have an account?

          {" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;