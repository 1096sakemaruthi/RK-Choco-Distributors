import React, { useState } from "react";

import {
    useSearchParams,
    useNavigate
} from "react-router-dom";

import axios from "axios";

import {
    FaArrowLeft,
    FaLock,
    FaEnvelope,
    FaKey,
    FaClock,
    FaShieldAlt,
    FaCheckCircle,
    FaExclamationCircle
} from "react-icons/fa";

import "../styles/AdminResetPassword.css";


function AdminResetPassword() {

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();


    // =================================================
    // EMAIL FROM URL
    // =================================================

    const email = searchParams.get("email");


    // =================================================
    // FORM STATES
    // =================================================

    const [otp, setOtp] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");


    // =================================================
    // MESSAGE STATES
    // =================================================

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");


    // =================================================
    // LOADING
    // =================================================

    const [loading, setLoading] = useState(false);


    // =================================================
    // RESET PASSWORD
    // =================================================

    const handleResetPassword = async (e) => {

        e.preventDefault();

        setMessage("");

        setError("");


        // =================================================
        // EMAIL CHECK
        // =================================================

        if (!email) {

            setError(
                "Invalid password reset request. Please request a new OTP."
            );

            return;
        }


        // =================================================
        // OTP CHECK
        // =================================================

        if (!otp.trim()) {

            setError(
                "Please enter the OTP."
            );

            return;
        }


        // =================================================
        // OTP FORMAT
        // =================================================

        if (!/^\d{6}$/.test(otp.trim())) {

            setError(
                "Please enter a valid 6-digit OTP."
            );

            return;
        }


        // =================================================
        // PASSWORD CHECK
        // =================================================

        if (!newPassword.trim()) {

            setError(
                "Please enter your new password."
            );

            return;
        }


        // =================================================
        // CONFIRM PASSWORD CHECK
        // =================================================

        if (!confirmPassword.trim()) {

            setError(
                "Please confirm your new password."
            );

            return;
        }


        // =================================================
        // PASSWORD MATCH
        // =================================================

        if (newPassword !== confirmPassword) {

            setError(
                "New password and confirm password do not match."
            );

            return;
        }


        // =================================================
        // START LOADING
        // =================================================

        setLoading(true);


        try {

            // =================================================
            // SEND RESET REQUEST
            // =================================================

            const response = await axios.post(
                "http://localhost:8080/api/admin/reset-password",
                {
                    email: email,

                    otp: otp.trim(),

                    newPassword: newPassword,

                    confirmPassword: confirmPassword
                }
            );


            // =================================================
            // SUCCESS
            // =================================================

            setMessage(
                response.data ||
                "Admin password reset successfully."
            );


            // =================================================
            // CLEAR FORM
            // =================================================

            setOtp("");

            setNewPassword("");

            setConfirmPassword("");


            // =================================================
            // GO TO ADMIN LOGIN
            // =================================================

            setTimeout(() => {

                navigate("/admin-login");

            }, 2000);


        } catch (err) {

            console.error(
                "Admin reset password error:",
                err
            );


            if (
                err.response &&
                err.response.data
            ) {

                setError(
                    typeof err.response.data === "string"
                        ? err.response.data
                        : "Unable to reset password."
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


    // =================================================
    // BACK TO ADMIN LOGIN
    // =================================================

    const handleBackToLogin = (e) => {

        e.preventDefault();

        navigate("/admin-login");

    };


    // =================================================
    // UI
    // =================================================

    return (

        <div className="admin-reset-page">


            {/* =================================================
                LEFT BRANDING
            ================================================= */}

            <div className="admin-reset-brand">

                <div className="admin-reset-logo">

                    {/* 
                        IMPORTANT:
                        Keep your existing logo path here.
                        If your logo path is different, use that
                        existing path only.
                    */}

                    <img
                        src="/images/logo.png"
                        alt="RK Choco Distributors Logo"
                    />

                </div>


                <h2>
                    RK CHOCO
                </h2>


                <h3>
                    DISTRIBUTORS
                </h3>


                <div className="reset-brand-line">

                    <span></span>

                    <strong>◆</strong>

                    <span></span>

                </div>


                <p>
                    Delivering Happiness to Every Shop
                </p>


                <div className="reset-security">

                    <FaShieldAlt />

                    <span>
                        Secure Admin Account Recovery
                    </span>

                </div>


                <div className="reset-security">

                    <FaKey />

                    <span>
                        Secure OTP verification
                    </span>

                </div>


                <div className="reset-security">

                    <FaLock />

                    <span>
                        Create a new password
                    </span>

                </div>


                <div className="reset-security">

                    <FaCheckCircle />

                    <span>
                        OTP valid for 5 minutes
                    </span>

                </div>

            </div>


            {/* =================================================
                RIGHT SECTION
            ================================================= */}

            <div className="admin-reset-section">


                <div className="admin-reset-box">


                    {/* =================================================
                        BACK LINK
                    ================================================= */}

                    <div className="reset-back-top">

                        <a
                            href="/admin-login"
                            onClick={handleBackToLogin}
                        >

                            <FaArrowLeft />

                            <span>
                                Back to Admin Login
                            </span>

                        </a>

                    </div>


                    {/* =================================================
                        RESET ICON
                    ================================================= */}

                    <div className="reset-icon">

                        <FaLock />

                    </div>


                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <h1>
                        Reset Admin Password
                    </h1>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <p className="reset-description">

                        Enter the OTP sent to your registered Admin
                        email and create a new password securely.

                    </p>


                    {/* =================================================
                        TITLE LINE
                    ================================================= */}

                    <div className="reset-title-line">

                        <span></span>

                        <span></span>

                    </div>


                    {/* =================================================
                        OTP VALIDITY
                    ================================================= */}

                    <div className="reset-validity">

                        <FaClock />

                        <span>
                            OTP is valid for 5 minutes.
                        </span>

                    </div>


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form onSubmit={handleResetPassword}>


                        {/* =================================================
                            OTP
                        ================================================= */}

                        <div className="reset-input-group">

                            <label>
                                OTP
                            </label>


                            <div className="reset-input-wrapper otp-input">

                                <FaKey />

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="6"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => {

                                        const value =
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            );

                                        setOtp(value);

                                        setError("");

                                        setMessage("");

                                    }}
                                />

                            </div>

                        </div>


                        {/* =================================================
                            NEW PASSWORD
                        ================================================= */}

                        <div className="reset-input-group">

                            <label>
                                New Password
                            </label>


                            <div className="reset-input-wrapper">

                                <FaLock />

                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => {

                                        setNewPassword(
                                            e.target.value
                                        );

                                        setError("");

                                        setMessage("");

                                    }}
                                />

                            </div>

                        </div>


                        {/* =================================================
                            CONFIRM PASSWORD
                        ================================================= */}

                        <div className="reset-input-group">

                            <label>
                                Confirm New Password
                            </label>


                            <div className="reset-input-wrapper">

                                <FaLock />

                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => {

                                        setConfirmPassword(
                                            e.target.value
                                        );

                                        setError("");

                                        setMessage("");

                                    }}
                                />

                            </div>

                        </div>


                        {/* =================================================
                            ERROR MESSAGE
                        ================================================= */}

                        {error && (

                            <div className="reset-error">

                                <FaExclamationCircle />

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        {/* =================================================
                            SUCCESS MESSAGE
                        ================================================= */}

                        {message && (

                            <div className="reset-success">

                                <FaCheckCircle />

                                <span>
                                    {message}
                                </span>

                            </div>

                        )}


                        {/* =================================================
                            RESET BUTTON
                        ================================================= */}

                        <button
                            type="submit"
                            className="reset-password-button"
                            disabled={loading}
                        >

                            <FaLock />

                            <span>

                                {loading
                                    ? "Resetting Password..."
                                    : "Reset Password"
                                }

                            </span>

                        </button>


                    </form>


                    {/* =================================================
                        SECURITY BOTTOM
                    ================================================= */}

                    <div className="reset-security-bottom">

                        <FaShieldAlt />

                        <span>
                            Secure Admin Account Recovery
                        </span>

                    </div>


                    {/* =================================================
                        LOGIN LINK
                    ================================================= */}

                    <div className="reset-login-link">

                        Remember your password?

                        <a
                            href="/admin-login"
                            onClick={handleBackToLogin}
                        >
                            Admin Login
                        </a>

                    </div>


                </div>

            </div>

        </div>

    );

}


export default AdminResetPassword;