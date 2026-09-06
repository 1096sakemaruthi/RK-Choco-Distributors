import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaShoppingCart,
} from "react-icons/fa";

import "../styles/PlaceOrder.css";
import api from "../services/api";

function PlaceOrder() {
  const navigate = useNavigate();

  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD CART
  ===================================================== */

  const cartItems = JSON.parse(
    localStorage.getItem("cartItems") || "[]"
  );

  /* =====================================================
     TOTAL BOXES
  ===================================================== */

  const totalBoxes = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  /* =====================================================
     TOTAL PRODUCTS
  ===================================================== */

  const totalProducts = cartItems.length;

  /* =====================================================
     GRAND TOTAL
  ===================================================== */

  const grandTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  /* =====================================================
     CREATE ORDER ID
  ===================================================== */

  const createOrderId = () => {
    const timestamp = Date.now();

    const randomNumber = Math.floor(
      1000 + Math.random() * 9000
    );

    return `ORD-${timestamp}-${randomNumber}`;
  };

  /* =====================================================
     PLACE ORDER
  ===================================================== */

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    setError("");

    /* =================================================
       VALIDATION
    ================================================= */

    if (!shopName.trim()) {
      setError("Please enter shop name.");
      return;
    }

    if (!ownerName.trim()) {
      setError("Please enter owner name.");
      return;
    }

    if (mobileNumber.length !== 10) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!deliveryAddress.trim()) {
      setError(
        "Please enter delivery address."
      );
      return;
    }

    if (cartItems.length === 0) {
      setError(
        "Your cart is empty."
      );
      return;
    }

    /* =================================================
       START LOADING
    ================================================= */

    setPlacingOrder(true);

    try {
      /* ===============================================
         CURRENT DATE + TIME
      =============================================== */

      const now = new Date();

      const orderDate =
        now.toLocaleDateString("en-IN");

      const orderTime =
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

      const createdAt =
        now.toISOString();

      /* ===============================================
         DELIVERY DATE
         3 DAYS FROM ORDER DATE
      =============================================== */

      const deliveryDate =
        new Date(now);

      deliveryDate.setDate(
        deliveryDate.getDate() + 3
      );

      /* ===============================================
         ORDER ID
      =============================================== */

      const orderId =
        createOrderId();

      /* ===============================================
         ORDER DATA
      =============================================== */

      const orderData = {
        orderId: orderId,

        shopName: shopName.trim(),

        ownerName: ownerName.trim(),

        mobileNumber: mobileNumber,

        deliveryAddress:
          deliveryAddress.trim(),

        totalProducts:
          totalProducts,

        totalBoxes:
          totalBoxes,

        grandTotal:
          grandTotal,

        orderDate:
          orderDate,

        orderTime:
          orderTime,

        createdAt:
          createdAt,

        deliveryDate:
          deliveryDate.toISOString(),

        /*
         * IMPORTANT:
         * Backend Order.java lo items String.
         * Kabatti cart array ni JSON String ga send chestunnam.
         */

        items:
          JSON.stringify(cartItems),

        status:
          "Order Received",
      };

      console.log(
        "Sending order to backend:",
        orderData
      );

      /* ===============================================
         SEND ORDER TO SPRING BOOT
         
         api.js baseURL:
         http://localhost:8080/api
         
         So "/orders" =
         http://localhost:8080/api/orders
      =============================================== */

      const response =
        await api.post(
          "/orders",
          orderData
        );

      console.log(
        "Order saved successfully:",
        response.data
      );

      /* ===============================================
         BACKEND RESPONSE
      =============================================== */

      const savedOrder =
        response.data;

      /* ===============================================
         SUCCESS ORDER DATA
         
         Backend items String ga return chestundi.
         Customer UI kosam original cartItems array
         use chestunnam.
      =============================================== */

      const successOrder = {
        ...savedOrder,

        items:
          cartItems,
      };

      /* ===============================================
         SAVE LAST ORDER
      =============================================== */

      localStorage.setItem(
        "lastOrder",
        JSON.stringify(
          successOrder
        )
      );

      /* ===============================================
         SAVE ALL ORDERS LOCALLY
         
         Existing customer Orders page
         compatibility kosam.
      =============================================== */

      const existingOrders =
        JSON.parse(
          localStorage.getItem(
            "orders"
          ) || "[]"
        );

      const updatedOrders = [
        ...existingOrders,
        successOrder,
      ];

      localStorage.setItem(
        "orders",
        JSON.stringify(
          updatedOrders
        )
      );

      /* ===============================================
         CLEAR CART
      =============================================== */

      localStorage.removeItem(
        "cartItems"
      );

      /* ===============================================
         GO TO ORDER SUCCESS PAGE
      =============================================== */

      navigate(
        "/order-success"
      );

    } catch (err) {
      console.error(
        "Order placement error:",
        err
      );

      /* ===============================================
         BACKEND ERROR MESSAGE
      =============================================== */

      if (err.response) {
        console.error(
          "Backend response:",
          err.response.data
        );

        console.error(
          "Backend status:",
          err.response.status
        );
      }

      setError(
        "Unable to place order. Please make sure CDMS Backend is running."
      );

    } finally {
      setPlacingOrder(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <main className="place-order-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="place-order-header">

        <Link
          to="/cart"
          className="order-back-link"
        >

          <FaArrowLeft />

          Back to Cart

        </Link>

        <span className="order-small-title">

          ORDER DETAILS

        </span>

        <h1>

          📦 Place Your Order

        </h1>

        <p>

          Enter your shop details to place
          your chocolate order.

        </p>

      </section>

      {/* =================================================
          FORM
      ================================================= */}

      <section className="place-order-container">

        <form
          className="order-form"
          onSubmit={
            handlePlaceOrder
          }
        >

          {/* SHOP NAME */}

          <div className="form-group">

            <label htmlFor="shopName">

              Shop Name

            </label>

            <input
              id="shopName"
              type="text"
              placeholder="Enter shop name"
              value={shopName}
              onChange={(event) =>
                setShopName(
                  event.target.value
                )
              }
              disabled={placingOrder}
            />

          </div>

          {/* OWNER NAME */}

          <div className="form-group">

            <label htmlFor="ownerName">

              Owner Name

            </label>

            <input
              id="ownerName"
              type="text"
              placeholder="Enter owner name"
              value={ownerName}
              onChange={(event) =>
                setOwnerName(
                  event.target.value
                )
              }
              disabled={placingOrder}
            />

          </div>

          {/* MOBILE */}

          <div className="form-group">

            <label htmlFor="mobileNumber">

              Mobile Number

            </label>

            <input
              id="mobileNumber"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
              value={mobileNumber}
              onChange={(event) => {

                const value =
                  event.target.value.replace(
                    /\D/g,
                    ""
                  );

                setMobileNumber(
                  value
                );

              }}
              disabled={placingOrder}
            />

          </div>

          {/* ADDRESS */}

          <div className="form-group">

            <label htmlFor="deliveryAddress">

              Delivery Address

            </label>

            <textarea
              id="deliveryAddress"
              rows="4"
              placeholder="Enter complete delivery address"
              value={deliveryAddress}
              onChange={(event) =>
                setDeliveryAddress(
                  event.target.value
                )
              }
              disabled={placingOrder}
            />

          </div>

          {/* ERROR */}

          {error && (

            <div
              style={{
                color: "red",
                background: "#ffeaea",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "15px",
                fontWeight: "600",
              }}
            >

              {error}

            </div>

          )}

          {/* ORDER SUMMARY */}

          <div className="order-summary">

            <h2>

              Order Summary

            </h2>

            <div className="summary-row">

              <span>

                Total Products

              </span>

              <strong>

                {totalProducts}

              </strong>

            </div>

            <div className="summary-row">

              <span>

                Total Boxes

              </span>

              <strong>

                {totalBoxes}

              </strong>

            </div>

            <div className="summary-row grand-total">

              <span>

                Grand Total

              </span>

              <strong>

                ₹{grandTotal}

              </strong>

            </div>

          </div>

          {/* PLACE ORDER */}

          <button
            type="submit"
            className="place-order-button"
            disabled={
              placingOrder ||
              cartItems.length === 0
            }
          >

            <FaShoppingCart />

            {placingOrder
              ? "Placing Order..."
              : "Place Order"}

          </button>

        </form>

      </section>

    </main>
  );
}

export default PlaceOrder;