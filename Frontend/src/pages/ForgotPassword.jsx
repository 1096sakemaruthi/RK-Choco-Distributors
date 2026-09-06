import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaPhone,
  FaArrowLeft,
  FaShieldAlt,
  FaKey,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import "../styles/forgotpassword.css";


function ForgotPassword() {

  const navigate = useNavigate();


  const [identifier, setIdentifier] =
    useState("");

  const [messageType, setMessageType] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  /* =====================================================
     SEND RESET OTP
     EMAIL OR PHONE NUMBER
  ===================================================== */

  const handleResetOtp = async () => {

    setMessage("");
    setMessageType("");

    const value =
      identifier.trim();


    /* EMPTY INPUT */

    if (!value) {

      setMessageType("error");

      setMessage(
        "Please enter your registered email or phone number."
      );

      return;
    }


    /* =================================================
       BASIC EMAIL / PHONE VALIDATION
    ================================================= */

    const isEmail =
      value.includes("@");

    const isPhone =
      /^[0-9]{10}$/.test(value);


    if (!isEmail && !isPhone) {

      setMessageType("error");

      setMessage(
        "Please enter a valid email address or 10-digit phone number."
      );

      return;
    }


    try {

      setLoading(true);


      /* =================================================
         SEND OTP TO SPRING BOOT BACKEND
      ================================================= */

      const response =
        await fetch(
          "http://localhost:8080/api/customer-password/send-otp",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              identifier: value,
            }),
          }
        );


      const data =
        await response.text();


      /* =================================================
         BACKEND ERROR
      ================================================= */

      if (!response.ok) {

        setMessageType("error");

        setMessage(
          data ||
          "Unable to send OTP. Please try again."
        );

        setLoading(false);

        return;
      }


      /* =================================================
         SAVE IDENTIFIER FOR RESET PASSWORD PAGE
      ================================================= */

      sessionStorage.setItem(
        "customerResetIdentifier",
        value
      );

      /*
       * ResetPassword.jsx reads resetIdentifier
       * from localStorage.
       *
       * So save the same identifier there also.
       */

      localStorage.setItem(
        "resetIdentifier",
        value
      );


      /* =================================================
         SUCCESS MESSAGE
      ================================================= */

      setMessageType("success");

      setMessage(
        "Reset OTP sent to your email or phone number."
      );


      /*
       * Open Reset Password page after
       * showing success message.
       */

      setTimeout(() => {

        navigate(
          "/reset-password"
        );

      }, 1500);


    } catch (error) {

      console.error(
        "Forgot password error:",
        error
      );


      setMessageType("error");

      setMessage(
        "Unable to connect to the server. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  /* =====================================================
     RESEND RESET OTP
  ===================================================== */

  const handleResend = () => {

    handleResetOtp();

  };


  return (

    <div className="forgot-page">


      {/* =================================================
          LEFT SIDE
      ================================================= */}

      <div className="forgot-left">


        <div className="forgot-brand">


          <img
            src="/images/logo.png"
            alt="RK Choco Distributors"
            className="forgot-logo"
          />


          <div className="forgot-brand-name">

            <h1>
              RK Choco
            </h1>

            <h2>
              DISTRIBUTORS
            </h2>

          </div>


        </div>


        <div className="forgot-line"></div>


        <h3 className="forgot-welcome">
          Secure Your Account
        </h3>


        <p className="forgot-left-text">

          Don't worry if you forgot your password.
          Enter your registered email address or
          phone number and we'll help you get back
          into your account securely.

        </p>


        <div className="forgot-features">


          <div>

            <FaShieldAlt />

            <span>
              Secure account recovery
            </span>

          </div>


          <div>

            <FaKey />

            <span>
              Easy password reset
            </span>

          </div>


          <div>

            <FaEnvelope />

            <span>
              Reset OTP sent to your email or phone number
            </span>

          </div>


        </div>


      </div>


      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="forgot-box">


        <div className="forgot-box-icon">

          <FaKey />

        </div>


        <div className="forgot-top-line"></div>


        <h2>
          Forgot Password?
        </h2>


        <p>

          Enter your registered email address or
          phone number and we'll help you reset
          your password.

        </p>


        {/* =================================================
            EMAIL / PHONE INPUT
        ================================================= */}

        <div className="input-box">


          {identifier.includes("@") ? (

            <FaEnvelope className="icon" />

          ) : (

            <FaPhone className="icon" />

          )}


          <input
            type="text"
            placeholder="Enter your Email or Phone Number"
            value={identifier}
            onChange={(e) => {

              setIdentifier(
                e.target.value
              );

              setMessage("");
              setMessageType("");

            }}
          />


        </div>


        {/* =================================================
            SUCCESS / ERROR MESSAGE
        ================================================= */}

        {message && (

          <div
            className={`forgot-message ${
              messageType === "success"
                ? "success-message"
                : "error-message"
            }`}
          >

            {messageType === "success" ? (

              <FaCheckCircle />

            ) : (

              <FaExclamationCircle />

            )}


            <span>
              {message}
            </span>

          </div>

        )}


        {/* =================================================
            RESET OTP BUTTON
        ================================================= */}

        {!messageType ||
        messageType === "error" ? (

          <button
            type="button"
            className="forgot-btn"
            onClick={handleResetOtp}
            disabled={loading}
          >

            <span>

              {loading
                ? "Sending OTP..."
                : "Send Reset OTP"}

            </span>

            <FaArrowLeft
              className="reset-arrow"
            />

          </button>

        ) : (

          <button
            type="button"
            className="forgot-btn resend-btn"
            onClick={handleResend}
            disabled={loading}
          >

            <span>

              {loading
                ? "Sending OTP..."
                : "Resend OTP"}

            </span>

            <FaArrowLeft
              className="reset-arrow"
            />

          </button>

        )}


        {/* =================================================
            BACK TO LOGIN
        ================================================= */}

        <div className="back-login">


          <Link to="/login">

            <FaArrowLeft />

            Back to Login

          </Link>


        </div>


      </div>


    </div>

  );
}


export default ForgotPassword;