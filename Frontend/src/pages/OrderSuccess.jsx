import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaCheck,
  FaClock,
  FaClipboardList,
  FaHome,
  FaShoppingBag,
} from "react-icons/fa";

import "../styles/OrderSuccess.css";

function ChocolateDecoration({ side }) {
  return (
    <div
      className={`success-decoration ${side}`}
      aria-hidden="true"
    >

      <div className="decor-leaf leaf-one"></div>
      <div className="decor-leaf leaf-two"></div>
      <div className="decor-leaf leaf-three"></div>

      <div className="decor-bag"></div>

      <div className="decor-chocolate chocolate-one"></div>
      <div className="decor-chocolate chocolate-two"></div>
      <div className="decor-chocolate chocolate-three"></div>

      <span className="decor-spark spark-one">
        ✦
      </span>

      <span className="decor-spark spark-two">
        ✦
      </span>

      <span className="decor-zigzag zigzag-one">
        ╱╲
      </span>

      <span className="decor-zigzag zigzag-two">
        ╱╲
      </span>

    </div>
  );
}

function OrderSuccess() {

  const navigate = useNavigate();

  /* =====================================================
     LOAD LAST ORDER
  ===================================================== */

  const order = JSON.parse(
    localStorage.getItem("lastOrder") || "null"
  );

  /* =====================================================
     FALLBACK
  ===================================================== */

  if (!order) {
    return (
      <main className="success-page">

        <div className="success-card">

          <div className="success-icon">
            <FaCheck />
          </div>

          <h1>
            Order Successfully Placed!
          </h1>

          <p>
            Your order information could not
            be found.
          </p>

          <button
            type="button"
            className="success-home-button"
            onClick={() =>
              navigate("/")
            }
          >
            <FaHome />
            Back to Home
          </button>

        </div>

      </main>
    );
  }

  return (

    <main className="success-page">

      {/* =================================================
          LEFT DECORATION
      ================================================= */}

      <ChocolateDecoration side="left-decoration" />

      {/* =================================================
          RIGHT DECORATION
      ================================================= */}

      <ChocolateDecoration side="right-decoration" />

      {/* =================================================
          SUCCESS CARD
      ================================================= */}

      <section className="success-card">

        {/* =================================================
            GREEN CHECK
        ================================================= */}

        <div className="success-icon-wrapper">

          <span className="success-star star-one">
            ✦
          </span>

          <div className="success-icon">
            <FaCheck />
          </div>

          <span className="success-star star-two">
            ✦
          </span>

        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <h1>
          Order Successfully Placed!
        </h1>

        {/* =================================================
            GOLD DIVIDER
        ================================================= */}

        <div className="success-divider">

          <span></span>

          <b>
            ❧
          </b>

          <span></span>

        </div>

        {/* =================================================
            THANK YOU
        ================================================= */}

        <h2 className="thank-you-title">

          <span>
            ❧
          </span>

          Thank you for your order!

          <span>
            ❧
          </span>

        </h2>

        <p className="success-message">
          We have received your order and it is being processed.
          <br />
          You will receive an order confirmation shortly.
        </p>

        {/* =================================================
            ONLY TWO SUMMARY BOXES
        ================================================= */}

        <div className="success-summary">

          {/* TOTAL BOXES */}

          <div className="summary-item">

            <div className="summary-icon">
              <FaShoppingBag />
            </div>

            <span>
              Total Boxes
            </span>

            <strong>
              {order.totalBoxes}
            </strong>

          </div>

          {/* GRAND TOTAL */}

          <div className="summary-item">

            <div className="summary-icon">
              ₹
            </div>

            <span>
              Grand Total
            </span>

            <strong>
              ₹{order.grandTotal}
            </strong>

          </div>

        </div>

        {/* =================================================
            ORDER INFORMATION
        ================================================= */}

        <div className="order-information">

          {/* STATUS */}

          <div className="information-row">

            <div className="information-label">

              <FaClipboardList />

              <span>
                Order Status
              </span>

            </div>

            <strong>
              Order Received
            </strong>

          </div>

          {/* ORDER ID */}

          <div className="information-row">

            <div className="information-label">

              <FaClipboardList />

              <span>
                Order ID
              </span>

            </div>

            <strong>
              {order.orderId}
            </strong>

          </div>

          {/* ORDER DATE & TIME */}

          <div className="information-row">

            <div className="information-label">

              <FaClock />

              <span>
                Order Date & Time
              </span>

            </div>

            <strong>
              {order.orderDate}, {order.orderTime}
            </strong>

          </div>

        </div>

        {/* =================================================
            NOTIFICATION
        ================================================= */}

        <div className="success-notification">

          <FaClock />

          <span>
            We will notify you when your order is on the way!
          </span>

        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="success-buttons">

          {/* CONTINUE SHOPPING */}

          <button
            type="button"
            className="continue-shopping-button"
            onClick={() =>
              navigate("/products")
            }
          >

            <FaShoppingBag />

            Continue Shopping

          </button>

          {/* BACK TO HOME */}

          <button
            type="button"
            className="back-home-button"
            onClick={() =>
              navigate("/")
            }
          >

            <FaHome />

            Back to Home

          </button>

        </div>

        {/* =================================================
            VIEW MY ORDERS
        ================================================= */}

        <button
          type="button"
          className="view-orders-button"
          onClick={() =>
            navigate("/orders")
          }
        >

          <FaClipboardList />

          View My Orders

        </button>

      </section>

    </main>
  );
}

export default OrderSuccess;