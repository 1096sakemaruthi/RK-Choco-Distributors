import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaShieldAlt,
  FaStore,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowLeft,
  FaUserPlus,
  FaBoxOpen,
  FaTruck,
} from "react-icons/fa";

import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  // =================================================
  // PASSWORD VISIBILITY
  // =================================================

  const [showPassword, setShowPassword] = useState(false);

  // =================================================
  // FORM VALUES
  // =================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =================================================
  // LOGIN MESSAGES
  // =================================================

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState("");

  // =================================================
  // LOGIN FUNCTION
  // =================================================

  const handleLogin = async () => {
    setLoginError("");

    // =================================================
    // EMPTY FIELD
    // =================================================

    if (!email.trim() || !password) {
      setLoginError(
        "Please enter your email/mobile number and password."
      );

      return;
    }

    // =================================================
    // LOGIN VALUE
    // =================================================

    const loginValue = email.trim();

    // =================================================
    // CUSTOMER FROM BACKEND
    // =================================================

    let customer = null;

    // =================================================
    // NORMALIZE MOBILE NUMBER
    // =================================================

    /*
      Supported mobile formats:

      9876543210
      98765 43210
      +91 9876543210
      +919876543210
      91 9876543210
      91-9876543210

      Backend receives:

      9876543210
    */

    const digitsOnly = loginValue.replace(/\D/g, "");

    let mobileNumber = null;

    if (digitsOnly.length === 10) {
      mobileNumber = digitsOnly;
    } else if (
      digitsOnly.length === 12 &&
      digitsOnly.startsWith("91")
    ) {
      mobileNumber = digitsOnly.substring(2);
    }

    // =================================================
    // CHECK EMAIL OR MOBILE NUMBER
    // =================================================

    try {
      // =================================================
      // MOBILE NUMBER LOGIN
      // =================================================

      if (mobileNumber) {
        const response = await axios.get(
          `https://cdms-backend-80mn.onrender.com/api/customers/mobile/${mobileNumber}`
        );

        customer = response.data;
      }

      // =================================================
      // EMAIL LOGIN
      // =================================================

      else {
        const response = await axios.get(
          `https://cdms-backend-80mn.onrender.com/api/customers/email/${encodeURIComponent(
            loginValue
          )}`
        );

        customer = response.data;
      }
    } catch (err) {
      // =================================================
      // CUSTOMER NOT FOUND
      // =================================================

      if (err.response && err.response.status === 404) {
        setLoginError(
          "Incorrect email/mobile number or password. Please try again."
        );
      } else {
        setLoginError(
          "Cannot connect to the server. Please make sure the backend is running."
        );
      }

      return;
    }

    // =================================================
    // CUSTOMER NOT FOUND
    // =================================================

    if (!customer) {
      setLoginError(
        "Incorrect email/mobile number or password. Please try again."
      );

      return;
    }

    // =================================================
    // CHECK PASSWORD
    // =================================================

    const passwordMatches =
      customer.password === password;

    // =================================================
    // INCORRECT PASSWORD
    // =================================================

    if (!passwordMatches) {
      setLoginError(
        "Incorrect email/mobile number or password. Please try again."
      );

      return;
    }

    // =================================================
    // CHECK CUSTOMER STATUS
    // =================================================

    if (
      customer.status &&
      customer.status.toLowerCase() !== "active"
    ) {
      setLoginError(
        "Your account is currently inactive. Please contact RK Choco Distributors."
      );

      return;
    }

    // =================================================
    // LOGIN SUCCESS
    // =================================================

    setLoginError("");
    setLoginSuccess(true);

    // =================================================
    // SAVE LOGIN STATUS
    // =================================================

    localStorage.setItem(
      "isLoggedIn",
      "true"
    );

    // =================================================
    // SAVE BACKEND CUSTOMER
    // =================================================

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(customer)
    );

    // =================================================
    // KEEP REGISTERED USER DATA
    // =================================================

    localStorage.setItem(
      "registeredUser",
      JSON.stringify({
        customerId: customer.customerId,
        fullName: customer.fullName,
        mobileNumber: customer.mobileNumber,
        email: customer.email,
        address: customer.address,
        password: customer.password,
        status: customer.status,
        registeredAt: customer.registeredAt,
      })
    );

    // =================================================
    // OPEN HOME AFTER SUCCESS
    // =================================================

    setTimeout(() => {
      navigate("/");
    }, 1800);
  };

  return (
    <main className="login-page">

      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <div className="login-bg-circle login-circle-one"></div>

      <div className="login-bg-circle login-circle-two"></div>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="login-content">


        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="login-left">


          {/* =================================================
              BRAND
          ================================================= */}

          <div className="login-brand-heading">

            <div className="login-logo-container">
              <FaStore className="login-logo-icon" />
            </div>

            <div className="login-brand-name">

              <h1>
                RK Choco
              </h1>

              <h2>
                DISTRIBUTORS
              </h2>

            </div>

          </div>


          {/* =================================================
              BRAND LINE
          ================================================= */}

          <div className="login-brand-line"></div>


          {/* =================================================
              WELCOME TITLE
          ================================================= */}

          <h2 className="login-welcome">
            Welcome Back to Our
            <br />
            Distribution Network
          </h2>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p className="login-left-text">
            Login to your RK Choco Distributors account
            and continue ordering trusted chocolate brands,
            quality products and reliable distribution
            services.
          </p>


          {/* =================================================
              FEATURES
          ================================================= */}

          <div className="login-features">


            {/* FEATURE 1 */}

            <div className="login-feature-item">

              <div className="login-feature-icon">
                <FaShieldAlt />
              </div>

              <div>

                <strong>
                  Trusted Brands
                </strong>

                <span>
                  Quality chocolate brands you can rely on
                </span>

              </div>

            </div>


            {/* FEATURE 2 */}

            <div className="login-feature-item">

              <div className="login-feature-icon">
                <FaBoxOpen />
              </div>

              <div>

                <strong>
                  Quality Products
                </strong>

                <span>
                  Reliable products with consistent quality
                </span>

              </div>

            </div>


            {/* FEATURE 3 */}

            <div className="login-feature-item">

              <div className="login-feature-icon">
                <FaTruck />
              </div>

              <div>

                <strong>
                  Reliable Distribution
                </strong>

                <span>
                  Simple and dependable order delivery
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              BUSINESS NOTE
          ================================================= */}

          <div className="login-business-note">

            <div className="login-note-line"></div>

            <p>
              Your trusted partner for chocolate distribution.
            </p>

          </div>

        </div>


        {/* =================================================
            LOGIN CARD
        ================================================= */}

        <section className="login-box">


          {/* =================================================
              TOP CARD LINE
          ================================================= */}

          <div className="login-card-top"></div>


          {/* =================================================
              LOGIN TITLE
          ================================================= */}

          <div className="login-title-area">

            <div className="login-title-icon">
              <FaUserPlus />
            </div>

            <h2>
              Welcome Back
            </h2>

            <p>
              Login to RK Choco Distributors
            </p>

          </div>


          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {loginError && (
            <div className="login-error-message">

              <FaExclamationCircle />

              <span>
                {loginError}
              </span>

            </div>
          )}


          {/* =================================================
              EMAIL OR MOBILE NUMBER
          ================================================= */}

          <div className="login-input-box">

            <FaEnvelope className="login-input-icon" />

            <input
              type="text"
              placeholder="Email Address or Mobile Number"
              value={email}
              autoComplete="username"
              onChange={(e) => {
                setEmail(e.target.value);
                setLoginError("");
              }}
            />

          </div>


          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="login-input-box">

            <FaLock className="login-input-icon" />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError("");
              }}
            />

            <button
              type="button"
              className="login-eye-button"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              onClick={() =>
                setShowPassword(!showPassword)
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

          <div className="login-forgot">

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>


          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

          <button
            type="button"
            className="login-button"
            onClick={handleLogin}
            disabled={loginSuccess}
          >

            <span>
              Login
            </span>

            <FaArrowRight />

          </button>


          {/* =================================================
              LOGIN SUCCESS MESSAGE
          ================================================= */}

          {loginSuccess && (
            <div className="login-success-message">

              <FaCheckCircle />

              <div>

                <strong>
                  Login Successful!
                </strong>

                <span>
                  Welcome back to RK Choco Distributors.
                </span>

              </div>

            </div>
          )}


          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="login-security">

            <FaShieldAlt />

            <span>
              Your information is secure with us
            </span>

          </div>


          {/* =================================================
              REGISTER LINK
          ================================================= */}

          <div className="login-register-link">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Register
            </Link>

          </div>


          {/* =================================================
              BACK TO HOME
          ================================================= */}

          <Link
            to="/"
            className="login-home-link"
          >

            <FaArrowLeft />

            <span>
              Back to Home
            </span>

          </Link>


        </section>

      </section>

    </main>
  );
}

export default Login;