import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaUserShield,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaTruck,
  FaHandshake,
  FaAward,
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/adminlogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  // =================================================
  // FORM STATES
  // =================================================

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // =================================================
  // PASSWORD VISIBILITY
  // =================================================

  const [showPassword, setShowPassword] = useState(false);

  // =================================================
  // MESSAGE STATES
  // =================================================

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // =================================================
  // ADMIN LOGIN
  // =================================================

  const handleAdminLogin = async () => {
    // Clear previous messages
    setSuccess("");
    setError("");

    // =================================================
    // EMPTY FIELD VALIDATION
    // =================================================

    if (!username || !password) {
      setError(
        "Please enter your Admin Username or Email and Password."
      );

      return;
    }

    // =================================================
    // BACKEND LOGIN
    // =================================================

    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/login",
        {
          username: username.trim(),
          password: password,
        }
      );

      // =================================================
      // LOGIN SUCCESS
      // =================================================

      const adminData = response.data;

      // Save admin login status
      localStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      // Save logged-in admin details
      localStorage.setItem(
        "loggedInAdmin",
        JSON.stringify(adminData)
      );

      // Success message
      setSuccess(
        "Admin Login Successful! Welcome to the Management Panel."
      );

      // =================================================
      // OPEN ADMIN DASHBOARD
      // =================================================

      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1500);

    } catch (err) {
      // =================================================
      // BACKEND ERROR
      // =================================================

      if (err.response) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Invalid Admin Username/Email or Password."
        );
      } else {
        setError(
          "Cannot connect to the server. Please make sure the backend is running."
        );
      }
    }
  };

  return (
    <div className="admin-login-page">

      {/* =================================================
          LEFT SIDE
      ================================================= */}

      <div className="admin-left-section">

        {/* =================================================
            LOGIN BOX
        ================================================= */}

        <div className="admin-login-box">

          {/* ADMIN ICON */}

          <div className="admin-logo">
            <FaUserShield />
          </div>

          {/* TITLE */}

          <h1>
            Admin Login
          </h1>

          {/* DESCRIPTION */}

          <p className="admin-login-description">
            RK Choco Distributors Management Panel
          </p>

          {/* DECORATIVE LINE */}

          <div className="admin-title-line">
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* =================================================
              SUCCESS MESSAGE
          ================================================= */}

          {success && (
            <div className="admin-success-message">

              <FaCheckCircle />

              <span>
                {success}
              </span>

            </div>
          )}

          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (
            <div className="admin-error-message">

              <span>
                {error}
              </span>

            </div>
          )}

          {/* =================================================
              USERNAME / EMAIL
          ================================================= */}

          <div className="admin-input-box">

            <div className="admin-input-icon">
              <FaUserShield />
            </div>

            <input
              type="text"
              placeholder="Admin Username or Email"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
            />

          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="admin-input-box">

            <div className="admin-input-icon">
              <FaLock />
            </div>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />

            <button
              type="button"
              className="admin-eye-button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >

              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}

            </button>

          </div>

          {/* =================================================
              FORGOT PASSWORD
          ================================================= */}

          <div className="admin-forgot">

            <Link to="/admin-forgot-password">
              Forgot Password?
            </Link>

          </div>

          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

          <button
            type="button"
            className="admin-login-btn"
            onClick={handleAdminLogin}
            disabled={!!success}
          >

            <span>
              Login
            </span>

            <FaArrowRight />

          </button>

          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="admin-security">

            <FaShieldAlt />

            <span>
              Secure Admin Access
            </span>

          </div>

          {/* =================================================
              OR LINE
          ================================================= */}

          <div className="admin-or-line">

            <span></span>

            <strong>
              or
            </strong>

            <span></span>

          </div>

          {/* =================================================
              BACK HOME
          ================================================= */}

          <div className="admin-bottom-home">

            <Link to="/">

              <span>
                ←
              </span>

              Back to Home

            </Link>

          </div>

        </div>

      </div>

      {/* =================================================
          RIGHT SIDE — COMPANY BRANDING
      ================================================= */}

      <div className="admin-right-section">

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="admin-company-logo">

          <img
            src="/images/logo.png"
            alt="RK Choco Distributors"
          />

        </div>

        {/* =================================================
            COMPANY NAME
        ================================================= */}

        <h2>
          RK CHOCO DISTRIBUTORS
        </h2>

        {/* GOLD DECORATIVE LINE */}

        <div className="company-line">

          <span></span>

          <strong>
            ❖
          </strong>

          <span></span>

        </div>

        {/* TAGLINE */}

        <h3>
          Delivering Happiness to Every Shop
        </h3>

        {/* HEART LINE */}

        <div className="company-divider">

          <span></span>

          <strong>
            ♥
          </strong>

          <span></span>

        </div>

        {/* =================================================
            FEATURES
        ================================================= */}

        <div className="admin-features">

          {/* TRUSTED QUALITY */}

          <div className="admin-feature">

            <div className="feature-icon">
              <FaShieldAlt />
            </div>

            <span>
              Trusted
              <br />
              Quality
            </span>

          </div>

          {/* DELIVERY */}

          <div className="admin-feature">

            <div className="feature-icon">
              <FaTruck />
            </div>

            <span>
              On-Time
              <br />
              Delivery
            </span>

          </div>

          {/* RELATIONSHIPS */}

          <div className="admin-feature">

            <div className="feature-icon">
              <FaHandshake />
            </div>

            <span>
              Strong
              <br />
              Relationships
            </span>

          </div>

          {/* CUSTOMER */}

          <div className="admin-feature">

            <div className="feature-icon">
              <FaAward />
            </div>

            <span>
              Customer
              <br />
              Satisfaction
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;