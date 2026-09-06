import React, { useEffect, useState } from "react";

import "../styles/admindashboard.css";

import { Link, useNavigate } from "react-router-dom";

import {
  FaBoxOpen,
  FaTags,
  FaUsers,
  FaClipboardList,
  FaChartBar,
  FaSignOutAlt,
  FaStore,
  FaUserShield,
  FaArrowRight,
} from "react-icons/fa";

import api from "../services/api";


function AdminDashboard() {

  const navigate = useNavigate();


  // =================================================
  // DASHBOARD STATISTICS
  // =================================================

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalBrands: 0,
    totalCustomers: 0,
    totalOrders: 0,
  });


  // =================================================
  // LOAD DASHBOARD STATISTICS
  // =================================================

  useEffect(() => {

    const loadDashboardStatistics = async () => {

      try {

        // ---------------------------------------------
        // LOAD EXISTING DASHBOARD STATISTICS
        // ---------------------------------------------

        const statsResponse = await api.get(
          "/admin/dashboard/stats"
        );


        // ---------------------------------------------
        // LOAD ACTUAL BRAND COUNT
        // ---------------------------------------------

        const brandsResponse = await api.get(
          "/brands/count"
        );


        // ---------------------------------------------
        // UPDATE DASHBOARD
        // ---------------------------------------------

        setStats({
          ...statsResponse.data,
          totalBrands: brandsResponse.data,
        });

      } catch (error) {

        console.error(
          "Error loading dashboard statistics:",
          error
        );

      }

    };


    loadDashboardStatistics();

  }, []);


  // =================================================
  // ADMIN LOGOUT
  // =================================================

  const handleLogout = () => {

    localStorage.removeItem("adminLoggedIn");

    localStorage.removeItem("loggedInAdmin");

    navigate("/admin-login");

  };


  return (

    <div className="admin-dashboard-page">


      {/* =================================================
          ADMIN NAVBAR
      ================================================= */}

      <header className="admin-navbar">


        {/* LEFT — COMPANY */}

        <div className="admin-navbar-brand">

          <div className="admin-navbar-logo">

            <FaStore />

          </div>


          <div className="admin-navbar-title">

            <h2>
              RK CHOCO DISTRIBUTORS
            </h2>

            <span>
              Management Panel
            </span>

          </div>

        </div>


        {/* RIGHT — ADMIN */}

        <div className="admin-navbar-profile">

          <div className="admin-profile-icon">

            <FaUserShield />

          </div>


          <div className="admin-profile-text">

            <strong>
              Administrator
            </strong>

            <span>
              Admin Panel
            </span>

          </div>


          {/* =================================================
              LOGOUT BUTTON
          ================================================= */}

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >

            <FaSignOutAlt />

            <span>
              Logout
            </span>

          </button>

        </div>


      </header>


      {/* =================================================
          MAIN DASHBOARD
      ================================================= */}

      <main className="dashboard">


        {/* =================================================
            WELCOME SECTION
        ================================================= */}

        <section className="dashboard-intro">


          <span className="section-label">
            ADMINISTRATION
          </span>


          <h1>
            Welcome to your Dashboard
          </h1>


          <p>
            Manage products, brands, customers, orders and
            business reports from one place.
          </p>


          <div className="intro-line"></div>


        </section>



        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <section className="summary-grid">


          {/* =================================================
              PRODUCTS
          ================================================= */}

          <Link
            to="/manage-products"
            className="summary-card"
          >

            <div className="summary-icon products-icon">

              <FaBoxOpen />

            </div>


            <div className="summary-content">

              <span>
                Total Products
              </span>

              <strong>
                {stats.totalProducts}
              </strong>

              <small>
                Manage your products
              </small>

            </div>

          </Link>



          {/* =================================================
              BRANDS
          ================================================= */}

          <Link
            to="/manage-brands"
            className="summary-card"
          >

            <div className="summary-icon brands-icon">

              <FaTags />

            </div>


            <div className="summary-content">

              <span>
                Total Brands
              </span>

              <strong>
                {stats.totalBrands}
              </strong>

              <small>
                Manage chocolate brands
              </small>

            </div>

          </Link>



          {/* =================================================
              CUSTOMERS
          ================================================= */}

          <Link
            to="/manage-customers"
            className="summary-card"
          >

            <div className="summary-icon customers-icon">

              <FaUsers />

            </div>


            <div className="summary-content">

              <span>
                Total Customers
              </span>

              <strong>
                {stats.totalCustomers}
              </strong>

              <small>
                Registered customers
              </small>

            </div>

          </Link>



          {/* =================================================
              ORDERS
          ================================================= */}

          <Link
            to="/manage-orders"
            className="summary-card"
          >

            <div className="summary-icon orders-icon">

              <FaClipboardList />

            </div>


            <div className="summary-content">

              <span>
                Total Orders
              </span>

              <strong>
                {stats.totalOrders}
              </strong>

              <small>
                Customer orders
              </small>

            </div>

          </Link>


        </section>



        {/* =================================================
            MANAGEMENT SECTION
        ================================================= */}

        <section className="management-section">


          <div className="management-heading">


            <div>

              <span className="section-label">
                MANAGEMENT
              </span>


              <h2>
                Manage Your Business
              </h2>

            </div>


            <div className="management-line"></div>


          </div>



          {/* =================================================
              MANAGEMENT CARDS
          ================================================= */}

          <div className="management-grid">


            {/* =================================================
                PRODUCTS
            ================================================= */}

            <Link
              to="/manage-products"
              className="management-card"
            >

              <div className="management-card-top">

                <div className="management-icon">

                  <FaBoxOpen />

                </div>


                <FaArrowRight className="management-arrow" />

              </div>


              <h3>
                Products
              </h3>


              <p>
                Add, edit, delete and manage your chocolate
                products, prices, stock and images.
              </p>


              <span className="manage-link">
                Manage Products
              </span>

            </Link>



            {/* =================================================
                BRANDS
            ================================================= */}

            <Link
              to="/manage-brands"
              className="management-card"
            >

              <div className="management-card-top">

                <div className="management-icon">

                  <FaTags />

                </div>


                <FaArrowRight className="management-arrow" />

              </div>


              <h3>
                Brands
              </h3>


              <p>
                Manage chocolate brands and their logos
                and information.
              </p>


              <span className="manage-link">
                Manage Brands
              </span>

            </Link>



            {/* =================================================
                CUSTOMERS
            ================================================= */}

            <Link
              to="/manage-customers"
              className="management-card"
            >

              <div className="management-card-top">

                <div className="management-icon">

                  <FaUsers />

                </div>


                <FaArrowRight className="management-arrow" />

              </div>


              <h3>
                Customers
              </h3>


              <p>
                View registered customers and their
                account information.
              </p>


              <span className="manage-link">
                Manage Customers
              </span>

            </Link>



            {/* =================================================
                ORDERS
            ================================================= */}

            <Link
              to="/manage-orders"
              className="management-card"
            >

              <div className="management-card-top">

                <div className="management-icon">

                  <FaClipboardList />

                </div>


                <FaArrowRight className="management-arrow" />

              </div>


              <h3>
                Orders
              </h3>


              <p>
                View customer orders, products, quantities,
                amounts and order status.
              </p>


              <span className="manage-link">
                Manage Orders
              </span>

            </Link>



            {/* =================================================
                REPORTS
            ================================================= */}

            <Link
              to="/reports"
              className="management-card"
            >

              <div className="management-card-top">

                <div className="management-icon">

                  <FaChartBar />

                </div>


                <FaArrowRight className="management-arrow" />

              </div>


              <h3>
                Reports
              </h3>


              <p>
                View business reports, sales information,
                orders and overall performance.
              </p>


              <span className="manage-link">
                View Reports
              </span>

            </Link>


          </div>


        </section>


      </main>


    </div>

  );

}


export default AdminDashboard;