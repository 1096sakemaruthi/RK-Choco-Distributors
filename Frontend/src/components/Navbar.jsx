import React, { useEffect, useState } from "react";

import {
  FaHome,
  FaShoppingBag,
  FaTags,
  FaBoxOpen,
  FaUser,
  FaUserPlus,
  FaUserCircle,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customer, setCustomer] = useState(null);


  // =================================================
  // CHECK CUSTOMER LOGIN
  // =================================================

  useEffect(() => {

    const checkLogin = () => {

      const loginStatus =
        localStorage.getItem("isLoggedIn");

      const savedCustomer =
        localStorage.getItem("loggedInUser");


      if (
        loginStatus === "true" &&
        savedCustomer
      ) {

        setIsLoggedIn(true);

        setCustomer(
          JSON.parse(savedCustomer)
        );

      } else {

        setIsLoggedIn(false);

        setCustomer(null);

      }

    };


    checkLogin();


    // =================================================
    // UPDATE NAVBAR AFTER LOGIN / LOGOUT
    // =================================================

    window.addEventListener(
      "storage",
      checkLogin
    );


    return () => {

      window.removeEventListener(
        "storage",
        checkLogin
      );

    };

  }, []);


  // =================================================
  // LOGOUT
  // =================================================

  const handleLogout = () => {

    localStorage.removeItem("isLoggedIn");

    localStorage.removeItem("loggedInUser");

    localStorage.removeItem("registeredUser");

    setIsLoggedIn(false);

    setCustomer(null);

    navigate("/");

  };


  return (

    <nav className="navbar">


      {/* =================================================
          LEFT SIDE - BRAND
      ================================================= */}

      <div className="navbar-brand">

        <img
          src="/images/logo.png"
          alt="RK Choco Logo"
        />

        <div className="brand-text">

          <h2>
            RK Choco
          </h2>

          <p>
            Premium Chocolate Distributor
          </p>

        </div>

      </div>


      {/* =================================================
          RIGHT SIDE - MENU
      ================================================= */}

      <div className="navbar-menu">


        <Link
          to="/"
          className="nav-link"
        >

          <FaHome />

          <span>
            Home
          </span>

        </Link>


        <Link
          to="/products"
          className="nav-link"
        >

          <FaShoppingBag />

          <span>
            Products
          </span>

        </Link>


        <Link
          to="/brands"
          className="nav-link"
        >

          <FaTags />

          <span>
            Brands
          </span>

        </Link>


        <Link
          to="/orders"
          className="nav-link"
        >

          <FaBoxOpen />

          <span>
            Orders
          </span>

        </Link>


        {/* =================================================
            CUSTOMER NOT LOGGED IN
        ================================================= */}

        {!isLoggedIn && (

          <>

            <Link
              to="/login"
              className="login-btn"
            >

              <FaUser />

              <span>
                Login
              </span>

            </Link>


            <Link
              to="/register"
              className="register-btn"
            >

              <FaUserPlus />

              <span>
                Register
              </span>

            </Link>

          </>

        )}


        {/* =================================================
            CUSTOMER LOGGED IN
        ================================================= */}

        {isLoggedIn && customer && (

          <Link
            to="/profile"
            className="profile-btn"
          >

            <FaUserCircle />

            <span>
              {customer.fullName}
            </span>

          </Link>

        )}

      </div>

    </nav>

  );

}

export default Navbar;