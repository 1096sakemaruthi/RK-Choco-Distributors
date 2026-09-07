import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaArrowLeft,
  FaShieldAlt,
  FaTruck,
  FaBoxOpen,
} from "react-icons/fa";

import "../styles/register.css";

function Register() {
  const navigate = useNavigate();

  // =================================================
  // FORM STATES
  // =================================================

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  // =================================================
  // PASSWORD VISIBILITY
  // =================================================

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =================================================
  // MESSAGES
  // =================================================

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =================================================
  // REGISTER FUNCTION
  // =================================================

  const handleRegister = async () => {
    setMessage("");
    setError("");

    // =================================================
    // EMPTY FIELD VALIDATION
    // =================================================

    if (
      !fullName.trim() ||
      !mobileNumber.trim() ||
      !email.trim() ||
      !address.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all the details.");
      return;
    }

    // =================================================
    // MOBILE VALIDATION
    // =================================================

    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    // =================================================
    // EMAIL VALIDATION
    // =================================================

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    // =================================================
    // PASSWORD VALIDATION
    // =================================================

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    // =================================================
    // CONFIRM PASSWORD
    // =================================================

    if (password !== confirmPassword) {
      setError(
        "Password and Confirm Password do not match."
      );
      return;
    }

    // =================================================
    // CHECK EXISTING USER
    // =================================================

    const existingUser = JSON.parse(
      localStorage.getItem("registeredUser") || "null"
    );

    if (
      existingUser &&
      existingUser.email &&
      existingUser.email.toLowerCase() ===
        email.toLowerCase()
    ) {
      setError(
        "This email is already registered. Please login."
      );
      return;
    }

    // =================================================
    // CUSTOMER DATA
    // =================================================

    const userData = {
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email.trim(),
      address: address.trim(),
      password,
    };

    // =================================================
    // SEND CUSTOMER DATA TO BACKEND
    // =================================================

    try {
      const response = await axios.post(
        "https://cdms-backend-80mn.onrender.com/api/customers/register",
        userData
      );

      // =================================================
      // SAVE USER LOCALLY
      // =================================================

      localStorage.setItem(
        "registeredUser",
        JSON.stringify(userData)
      );

      // =================================================
      // CUSTOMER DATA FOR EXISTING FRONTEND ADMIN DATA
      // =================================================

      const customerData = {
        id: response.data.customerId || Date.now(),

        name: fullName.trim(),
        fullName: fullName.trim(),

        phone: mobileNumber.trim(),
        mobileNumber: mobileNumber.trim(),

        email: email.trim(),

        address: address.trim(),

        status: "active",

        registeredAt:
          response.data.registeredAt ||
          new Date().toISOString(),
      };

      // =================================================
      // GET EXISTING CUSTOMERS
      // =================================================

      const existingCustomers = JSON.parse(
        localStorage.getItem("rkChocoCustomers") || "[]"
      );

      const customersArray = Array.isArray(
        existingCustomers
      )
        ? existingCustomers
        : [];

      // =================================================
      // CHECK DUPLICATE EMAIL
      // =================================================

      const alreadyExists = customersArray.some(
        (customer) =>
          customer.email &&
          customer.email.toLowerCase() ===
            email.trim().toLowerCase()
      );

      // =================================================
      // ADD CUSTOMER
      // =================================================

      if (!alreadyExists) {
        customersArray.push(customerData);

        localStorage.setItem(
          "rkChocoCustomers",
          JSON.stringify(customersArray)
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      setMessage(
        "Registration successful! Redirecting to Login..."
      );

      // =================================================
      // REDIRECT
      // =================================================

      setTimeout(() => {
        navigate("/login");
      }, 1800);

    } catch (err) {

      // =================================================
      // BACKEND ERROR
      // =================================================

      if (err.response) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Registration failed. Please try again."
        );
      } else {
        setError(
          "Cannot connect to the server. Please make sure the backend is running."
        );
      }

      return;
    }
  };

  return (
    <main className="register-page">

      {/* =================================================
          DECORATIVE BACKGROUND ELEMENTS
      ================================================= */}

      <div className="register-bg-circle circle-one"></div>
      <div className="register-bg-circle circle-two"></div>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="register-content">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="register-left">

          {/* BRAND */}

          <div className="brand-heading">

            <div className="logo-container">

              <img
                src="/images/logo.png"
                alt="RK Choco Distributors Logo"
                className="register-logo"
              />

            </div>

            <div className="brand-name">

              <h1>RK Choco</h1>

              <h2>DISTRIBUTORS</h2>

            </div>

          </div>


          {/* LINE */}

          <div className="brand-line"></div>


          {/* MAIN TITLE */}

          <h3 className="register-welcome">
            Join Our Distribution Network
          </h3>


          {/* DESCRIPTION */}

          <p className="register-left-text">
            Create your account and connect with
            RK Choco Distributors for trusted brands,
            quality products and reliable service.
          </p>


          {/* FEATURES */}

          <div className="register-features">

            <div className="feature-item">

              <div className="feature-icon">
                <FaShieldAlt />
              </div>

              <div>

                <strong>Trusted Brands</strong>

                <span>
                  Quality chocolate brands you can rely on
                </span>

              </div>

            </div>


            <div className="feature-item">

              <div className="feature-icon">
                <FaBoxOpen />
              </div>

              <div>

                <strong>Quality Products</strong>

                <span>
                  Reliable products with consistent quality
                </span>

              </div>

            </div>


            <div className="feature-item">

              <div className="feature-icon">
                <FaTruck />
              </div>

              <div>

                <strong>Reliable Distribution</strong>

                <span>
                  Simple and dependable order delivery
                </span>

              </div>

            </div>

          </div>


          {/* LEFT BOTTOM NOTE */}

          <div className="business-note">

            <span className="note-line"></span>

            <p>
              Your trusted partner for chocolate distribution.
            </p>

          </div>

        </div>


        {/* =================================================
            RIGHT REGISTER CARD
        ================================================= */}

        <div className="register-box">

          {/* TOP DECORATION */}

          <div className="register-card-top"></div>


          {/* TITLE */}

          <div className="register-title-area">

            <div className="title-icon">
              <FaUser />
            </div>

            <h2>Create Account</h2>

            <p>
              Register to RK Choco Distributors
            </p>

          </div>


          {/* SUCCESS MESSAGE */}

          {message && (

            <div className="success-message">

              <FaCheckCircle />

              <span>{message}</span>

            </div>

          )}


          {/* ERROR MESSAGE */}

          {error && (

            <div className="error-message">
              {error}
            </div>

          )}


          {/* FULL NAME */}

          <div className="input-box">

            <FaUser className="input-icon" />

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
            />

          </div>


          {/* MOBILE */}

          <div className="input-box">

            <FaPhone className="input-icon" />

            <input
              type="tel"
              placeholder="Mobile Number"
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => {

                const value =
                  e.target.value.replace(/\D/g, "");

                setMobileNumber(value);

              }}
            />

          </div>


          {/* EMAIL */}

          <div className="input-box">

            <FaEnvelope className="input-icon" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>


          {/* ADDRESS */}

          <div className="input-box">

            <FaHome className="input-icon" />

            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
            />

          </div>


          {/* PASSWORD */}

          <div className="input-box">

            <FaLock className="input-icon" />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              type="button"
              className="eye-button"
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


          {/* CONFIRM PASSWORD */}

          <div className="input-box">

            <FaLock className="input-icon" />

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

            <button
              type="button"
              className="eye-button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >

              {showConfirmPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}

            </button>

          </div>


          {/* PASSWORD NOTE */}

          <div className="password-note">

            <FaShieldAlt />

            <span>
              Password must contain at least 6 characters
            </span>

          </div>


          {/* REGISTER BUTTON */}

          <button
            type="button"
            className="register-button"
            onClick={handleRegister}
            disabled={!!message}
          >
            Register
          </button>


          {/* LOGIN LINK */}

          <div className="login-link">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Login
            </Link>

          </div>


          {/* BACK TO HOME */}

          <Link
            to="/"
            className="register-home-link"
          >
            <FaArrowLeft />
            Back to Home
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Register;