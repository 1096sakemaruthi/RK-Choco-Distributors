import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaArrowRight,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowLeft,
} from "react-icons/fa";

import "../styles/adminforgotpassword.css";

import api from "../services/api";


function AdminForgotPassword() {

  const navigate = useNavigate();

  // =================================================
  // FORM STATE
  // =================================================

  const [email, setEmail] = useState("");


  // =================================================
  // MESSAGE STATES
  // =================================================

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");


  // =================================================
  // LOADING STATE
  // =================================================

  const [loading, setLoading] = useState(false);


  // =================================================
  // ADMIN FORGOT PASSWORD
  // SEND OTP
  // =================================================

  const handleForgotPassword = async () => {

    setSuccess("");

    setError("");


    // =================================================
    // EMPTY EMAIL VALIDATION
    // =================================================

    if (!email.trim()) {

      setError(
        "Please enter your registered Admin email address."
      );

      return;
    }


    // =================================================
    // EMAIL VALIDATION
    // =================================================

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {

      setError(
        "Please enter a valid email address."
      );

      return;
    }


    // =================================================
    // START LOADING
    // =================================================

    setLoading(true);


    try {

      // =================================================
      // SEND OTP REQUEST TO SPRING BOOT
      // =================================================

      const response = await api.post(
        "/admin/forgot-password",
        {
          email: email.trim(),
        }
      );


      // =================================================
      // OTP SENT SUCCESSFULLY
      // =================================================

      setSuccess(
        response.data ||
        "OTP has been sent to your registered Admin email."
      );


      // =================================================
      // GO TO ADMIN RESET PASSWORD PAGE
      // =================================================

      setTimeout(() => {

        navigate(
          `/admin-reset-password?email=${encodeURIComponent(
            email.trim()
          )}`
        );

      }, 1000);


    } catch (err) {

      console.error(
        "Admin forgot password error:",
        err
      );


      // =================================================
      // BACKEND ERROR
      // =================================================

      if (
        err.response &&
        err.response.data
      ) {

        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Unable to process your request."
        );

      } else {

        setError(
          "Unable to connect to the server. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  return (

    <div className="admin-forgot-page">


      {/* =================================================
          LEFT BRANDING SECTION
      ================================================= */}

      <div className="admin-forgot-brand">


        {/* LOGO */}

        <div className="admin-forgot-logo">

          <img
            src="/images/logo.png"
            alt="RK Choco Distributors Logo"
          />

        </div>


        {/* COMPANY NAME */}

        <h2>
          RK CHOCO
        </h2>

        <h3>
          DISTRIBUTORS
        </h3>


        {/* DECORATIVE LINE */}

        <div className="forgot-brand-line">

          <span></span>

          <strong>◆</strong>

          <span></span>

        </div>


        {/* TAGLINE */}

        <p>
          Delivering Happiness to Every Shop
        </p>


        {/* SECURITY */}

        <div className="forgot-security">

          <FaShieldAlt />

          <span>
            Secure Admin Account Recovery
          </span>

        </div>


      </div>


      {/* =================================================
          RIGHT FORGOT PASSWORD BOX
      ================================================= */}

      <div className="admin-forgot-section">


        <div className="admin-forgot-box">


          {/* =================================================
              TOP BACK LINK
          ================================================= */}

          <div className="forgot-back-top">

            <Link to="/admin-login">

              <FaArrowLeft />

              Back to Admin Login

            </Link>

          </div>


          {/* =================================================
              ICON
          ================================================= */}

          <div className="forgot-icon">

            <FaEnvelope />

          </div>


          {/* =================================================
              TITLE
          ================================================= */}

          <h1>
            Forgot Password?
          </h1>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p className="forgot-description">

            Enter your registered Admin email address
            and we will send you a password reset OTP.

          </p>


          {/* =================================================
              DECORATIVE LINE
          ================================================= */}

          <div className="forgot-title-line">

            <span></span>

            <span></span>

            <span></span>

          </div>


          {/* =================================================
              SUCCESS MESSAGE
          ================================================= */}

          {success && (

            <div className="forgot-success">

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

            <div className="forgot-error">

              <FaExclamationCircle />

              <span>
                {error}
              </span>

            </div>

          )}


          {/* =================================================
              EMAIL INPUT
          ================================================= */}

          <div className="forgot-input-box">

            <div className="forgot-input-icon">

              <FaEnvelope />

            </div>


            <input
              type="email"
              placeholder="Enter Admin Email"
              value={email}
              onChange={(e) => {

                setEmail(e.target.value);

                setError("");

                setSuccess("");

              }}
            />

          </div>


          {/* =================================================
              SEND OTP BUTTON
          ================================================= */}

          <button
            type="button"
            className="forgot-reset-button"
            onClick={handleForgotPassword}
            disabled={loading}
          >

            <span>

              {loading
                ? "Sending OTP..."
                : "Send Reset OTP"}

            </span>


            {!loading && (

              <FaArrowRight />

            )}

          </button>


          {/* =================================================
              SECURITY MESSAGE
          ================================================= */}

          <div className="forgot-security-bottom">

            <FaShieldAlt />

            <span>

              OTP is valid for 5 minutes

            </span>

          </div>


          {/* =================================================
              LOGIN LINK
          ================================================= */}

          <div className="forgot-login-link">

            Remember your password?

            <Link to="/admin-login">

              Admin Login

            </Link>

          </div>


        </div>

      </div>

    </div>

  );

}


export default AdminForgotPassword;