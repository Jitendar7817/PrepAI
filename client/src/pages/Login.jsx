import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import API from "../services/api";

function Login() {
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
      window.location.href = "/dashboard";

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

        <h1 className="logo">
          PrepAI
        </h1>

        <h2>
          Welcome Back 👋
        </h2>

        <p className="subtitle">
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
          >
            {
              loading
                ? "Logging In..."
                : "Login"
            }
          </button>

        </form>

        <p className="register-text">

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