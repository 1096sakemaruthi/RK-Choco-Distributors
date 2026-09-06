import React, { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  FaKey,
  FaLock,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import "../styles/forgotpassword.css";


function ResetPassword() {

  const location = useLocation();
  const navigate = useNavigate();


  /* =====================================================
     GET CUSTOMER EMAIL
     ===================================================== */

  const params =
    new URLSearchParams(location.search);


  const identifier =
    params.get("identifier") ||
    sessionStorage.getItem("customerResetIdentifier") ||
    localStorage.getItem("resetIdentifier") ||
    "";


  /* =====================================================
     STATES
     ===================================================== */

  const [otp, setOtp] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  const [messageType, setMessageType] =
    useState("");

  const [message, setMessage] =
    useState("");


  const [verified, setVerified] =
    useState(false);


  /* =====================================================
     VERIFY OTP
     ===================================================== */

  const handleVerifyOtp = async () => {

    setMessage("");
    setMessageType("");


    /* EMAIL CHECK */

    if (!identifier) {

      setMessageType("error");

      setMessage(
        "Email address is missing. Please request a new OTP."
      );

      return;
    }


    /* OTP CHECK */

    if (!otp.trim()) {

      setMessageType("error");

      setMessage(
        "Please enter the OTP."
      );

      return;
    }


    if (!/^\d{6}$/.test(otp.trim())) {

      setMessageType("error");

      setMessage(
        "Please enter a valid 6-digit OTP."
      );

      return;
    }


    try {

      const response =
        await fetch(
          "http://localhost:8080/api/customer-password/verify-otp",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              identifier:
                identifier.trim().toLowerCase(),

              otp:
                otp.trim(),

            }),
          }
        );


      const data =
        await response.text();


      if (!response.ok) {

        setMessageType("error");

        setMessage(
          data ||
          "Invalid or expired OTP."
        );

        return;
      }


      /* OTP VERIFIED */

      setVerified(true);

      setMessageType("success");

      setMessage(
        "OTP verified successfully. You can reset your password now."
      );


    } catch (error) {

      console.error(
        "Verify OTP error:",
        error
      );


      setMessageType("error");

      setMessage(
        "Unable to connect to the server. Please try again."
      );
    }
  };


  /* =====================================================
     RESET PASSWORD
     ===================================================== */

  const handleResetPassword = async () => {

    setMessage("");
    setMessageType("");


    /* EMAIL CHECK */

    if (!identifier) {

      setMessageType("error");

      setMessage(
        "Email address is missing. Please request a new OTP."
      );

      return;
    }


    /* OTP VERIFICATION CHECK */

    if (!verified) {

      setMessageType("error");

      setMessage(
        "Please verify the OTP first."
      );

      return;
    }


    /* OTP CHECK */

    if (!otp.trim()) {

      setMessageType("error");

      setMessage(
        "Please enter the OTP."
      );

      return;
    }


    if (!/^\d{6}$/.test(otp.trim())) {

      setMessageType("error");

      setMessage(
        "Please enter a valid 6-digit OTP."
      );

      return;
    }


    /* NEW PASSWORD */

    if (!newPassword.trim()) {

      setMessageType("error");

      setMessage(
        "Please enter your new password."
      );

      return;
    }


    if (newPassword.length < 6) {

      setMessageType("error");

      setMessage(
        "Password must contain at least 6 characters."
      );

      return;
    }


    /* CONFIRM PASSWORD */

    if (!confirmPassword.trim()) {

      setMessageType("error");

      setMessage(
        "Please confirm your new password."
      );

      return;
    }


    /* PASSWORD MATCH */

    if (newPassword !== confirmPassword) {

      setMessageType("error");

      setMessage(
        "Passwords do not match."
      );

      return;
    }


    try {

      const response =
        await fetch(
          "http://localhost:8080/api/customer-password/reset-password",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              /* IMPORTANT:
                 OTP WAS MISSING IN YOUR OLD CODE
              */

              identifier:
                identifier.trim().toLowerCase(),

              otp:
                otp.trim(),

              newPassword:
                newPassword,

              confirmPassword:
                confirmPassword,

            }),
          }
        );


      const data =
        await response.text();


      if (!response.ok) {

        setMessageType("error");

        setMessage(
          data ||
          "Unable to reset password."
        );

        return;
      }


      /* =================================================
         PASSWORD RESET SUCCESS
         ================================================= */

      setMessageType("success");

      setMessage(
        "Password reset successfully. Please login with your new password."
      );


      /* REMOVE RESET DATA */

      sessionStorage.removeItem(
        "customerResetIdentifier"
      );

      localStorage.removeItem(
        "resetIdentifier"
      );


      /* GO TO LOGIN */

      setTimeout(() => {

        navigate("/login");

      }, 2000);


    } catch (error) {

      console.error(
        "Reset password error:",
        error
      );


      setMessageType("error");

      setMessage(
        "Unable to connect to the server. Please try again."
      );
    }
  };


  /* =====================================================
     RETURN UI
     ===================================================== */

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
          Reset Your Password
        </h3>


        <p className="forgot-left-text">

          Enter the OTP sent to your registered
          email address and create a new
          password securely.

        </p>


        <div className="forgot-features">


          <div>

            <FaKey />

            <span>
              Secure OTP verification
            </span>

          </div>


          <div>

            <FaLock />

            <span>
              Create a new password
            </span>

          </div>


          <div>

            <FaCheckCircle />

            <span>
              OTP valid for 5 minutes
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
          Reset Password
        </h2>


        <p>
          Enter the OTP sent to your email address.
        </p>


        {/* =================================================
            OTP
            ================================================= */}

        <div className="input-box">


          <FaKey className="icon" />


          <input

            type="text"

            inputMode="numeric"

            maxLength="6"

            placeholder="Enter 6-digit OTP"

            value={otp}

            disabled={verified}

            onChange={(e) => {

              const value =
                e.target.value.replace(
                  /\D/g,
                  ""
                );


              setOtp(value);

              setMessage("");

              setMessageType("");

            }}

          />


        </div>


        {/* =================================================
            VERIFY OTP BUTTON
            ================================================= */}

        {!verified && (

          <button

            type="button"

            className="forgot-btn"

            onClick={handleVerifyOtp}

          >

            <span>
              Verify OTP
            </span>


            <FaArrowLeft
              className="reset-arrow"
            />

          </button>

        )}


        {/* =================================================
            NEW PASSWORD
            ================================================= */}

        {verified && (

          <>


            <div className="input-box">


              <FaLock
                className="icon"
              />


              <input

                type="password"

                placeholder="Enter New Password"

                value={newPassword}

                onChange={(e) => {

                  setNewPassword(
                    e.target.value
                  );

                  setMessage("");

                  setMessageType("");

                }}

              />


            </div>


            <div className="input-box">


              <FaLock
                className="icon"
              />


              <input

                type="password"

                placeholder="Confirm New Password"

                value={confirmPassword}

                onChange={(e) => {

                  setConfirmPassword(
                    e.target.value
                  );

                  setMessage("");

                  setMessageType("");

                }}

              />


            </div>


            {/* =================================================
                RESET PASSWORD BUTTON
                ================================================= */}

            <button

              type="button"

              className="forgot-btn"

              onClick={
                handleResetPassword
              }

            >

              <span>
                Reset Password
              </span>


              <FaArrowLeft
                className="reset-arrow"
              />

            </button>


          </>

        )}


        {/* =================================================
            MESSAGE
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
            BACK TO LOGIN
            ================================================= */}

        <div className="back-login">


          <button

            type="button"

            onClick={() =>
              navigate("/login")
            }

            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "inherit",
              font: "inherit",
            }}

          >

            <FaArrowLeft />

            Back to Login

          </button>


        </div>


      </div>


    </div>

  );
}


export default ResetPassword;