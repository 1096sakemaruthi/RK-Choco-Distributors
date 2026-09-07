
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowLeft,
  FaBoxOpen,
  FaStore,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaShoppingBag,
  FaCheckCircle,
  FaEye,
  FaTimesCircle,
  FaClock,
  FaTimes,
} from "react-icons/fa";

import "../styles/Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  /* =====================================================
     LOAD LOGGED-IN CUSTOMER ORDERS
     BACKEND + MYSQL
     ===================================================== */

  useEffect(() => {
    const loadOrders = async () => {

      // =================================================
      // GET LOGGED-IN USER
      // =================================================

      const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "null"
      );

      // =================================================
      // GET CUSTOMER MOBILE NUMBER
      // =================================================

      const mobileNumber =
        loggedInUser?.mobileNumber ||
        loggedInUser?.phone ||
        "";

      // =================================================
      // IF USER IS NOT LOGGED IN
      // =================================================

      if (!mobileNumber) {
        console.warn(
          "No logged-in customer mobile number found."
        );

        setOrders([]);
        return;
      }

      try {

        // =================================================
        // CUSTOMER-SPECIFIC BACKEND API
        // =================================================

        const response = await fetch(
          `https://cdms-backend-80mn.onrender.com/api/orders/customer/${encodeURIComponent(
            mobileNumber
          )}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load customer orders. Status: ${response.status}`
          );
        }

        const data = await response.json();

        const backendOrders = Array.isArray(data)
          ? data
          : [];

        // =================================================
        // FORMAT ORDERS
        // =================================================

        const formattedOrders =
          backendOrders.map((order) => {

            let parsedItems = [];

            if (Array.isArray(order.items)) {

              parsedItems = order.items;

            } else if (
              typeof order.items === "string"
            ) {

              try {

                parsedItems = JSON.parse(
                  order.items || "[]"
                );

              } catch (error) {

                console.error(
                  "Unable to parse order items:",
                  error
                );

                parsedItems = [];
              }
            }

            return {
              ...order,
              items: Array.isArray(parsedItems)
                ? parsedItems
                : [],
            };
          });

        // =================================================
        // NEWEST ORDER FIRST
        // =================================================

        const sortedOrders = [
          ...formattedOrders,
        ].sort((a, b) => {

          const dateA = getOrderDateTime(a);
          const dateB = getOrderDateTime(b);

          if (!dateA && !dateB) {
            return 0;
          }

          if (!dateA) {
            return 1;
          }

          if (!dateB) {
            return -1;
          }

          return (
            dateB.getTime() -
            dateA.getTime()
          );
        });

        // =================================================
        // SHOW ONLY CURRENT CUSTOMER ORDERS
        // =================================================

        setOrders(sortedOrders);

        // =================================================
        // SAVE ONLY CURRENT CUSTOMER ORDERS
        // =================================================

        localStorage.setItem(
          "orders",
          JSON.stringify(sortedOrders)
        );

      } catch (error) {

        console.error(
          "Unable to load customer orders from backend:",
          error
        );

        // =================================================
        // FALLBACK TO LOCAL STORAGE
        // =================================================

        try {

          const savedOrders = JSON.parse(
            localStorage.getItem("orders") || "[]"
          );

          const localOrders = Array.isArray(
            savedOrders
          )
            ? savedOrders
            : [];

          // =================================================
          // FILTER BY LOGGED-IN CUSTOMER MOBILE NUMBER
          // =================================================

          const customerOrders =
            localOrders.filter(
              (order) =>
                String(
                  order.mobileNumber ||
                    order.phone ||
                    ""
                ) === String(mobileNumber)
            );

          // =================================================
          // FORMAT LOCAL ORDERS
          // =================================================

          const formattedLocalOrders =
            customerOrders.map((order) => {

              let parsedItems = [];

              if (Array.isArray(order.items)) {

                parsedItems = order.items;

              } else if (
                typeof order.items === "string"
              ) {

                try {

                  parsedItems = JSON.parse(
                    order.items || "[]"
                  );

                } catch (parseError) {

                  console.error(
                    "Unable to parse local order items:",
                    parseError
                  );

                  parsedItems = [];
                }
              }

              return {
                ...order,
                items: Array.isArray(
                  parsedItems
                )
                  ? parsedItems
                  : [],
              };
            });

          // =================================================
          // SORT LOCAL CUSTOMER ORDERS
          // =================================================

          const sortedLocalOrders =
            [
              ...formattedLocalOrders,
            ].sort((a, b) => {

              const dateA =
                getOrderDateTime(a);

              const dateB =
                getOrderDateTime(b);

              if (!dateA && !dateB) {
                return 0;
              }

              if (!dateA) {
                return 1;
              }

              if (!dateB) {
                return -1;
              }

              return (
                dateB.getTime() -
                dateA.getTime()
              );
            });

          setOrders(sortedLocalOrders);

        } catch (localError) {

          console.error(
            "Unable to load local orders:",
            localError
          );

          setOrders([]);
        }
      }
    };

    loadOrders();

  }, []);

  /* =====================================================
     GET ORDER CREATED DATE
     ===================================================== */

  const getOrderDateTime = (order) => {

    if (order.createdAt) {

      const date =
        new Date(order.createdAt);

      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }

    if (order.created_at) {

      const date =
        new Date(order.created_at);

      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }

    /* Fallback for old orders */

    if (order.orderDate) {

      const parts =
        String(order.orderDate).split("/");

      if (parts.length === 3) {

        const day = Number(parts[0]);
        const month =
          Number(parts[1]) - 1;
        const year =
          Number(parts[2]);

        let hours = 0;
        let minutes = 0;
        let seconds = 0;

        if (order.orderTime) {

          const timeMatch =
            String(order.orderTime).match(
              /(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?/i
            );

          if (timeMatch) {

            hours =
              Number(timeMatch[1]);

            minutes =
              Number(timeMatch[2]);

            seconds =
              timeMatch[3]
                ? Number(timeMatch[3])
                : 0;

            const ampm =
              timeMatch[4]
                ? timeMatch[4].toLowerCase()
                : "";

            if (
              ampm === "pm" &&
              hours !== 12
            ) {
              hours += 12;
            }

            if (
              ampm === "am" &&
              hours === 12
            ) {
              hours = 0;
            }
          }
        }

        const date =
          new Date(
            year,
            month,
            day,
            hours,
            minutes,
            seconds
          );

        if (!Number.isNaN(date.getTime())) {
          return date;
        }
      }
    }

    return null;
  };

  /* =====================================================
     FORMAT DATE + TIME
     ===================================================== */

  const formatDateTime = (order) => {

    const date =
      getOrderDateTime(order);

    if (!date) {

      return `${order.orderDate || "-"}${
        order.orderTime
          ? `, ${order.orderTime}`
          : ""
      }`;
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    );
  };

  /* =====================================================
     EXPECTED DELIVERY DATE
     MINIMUM 3 DAYS
     ===================================================== */

  const getDeliveryDate = (order) => {

    if (order.deliveryDate) {

      const backendDeliveryDate =
        new Date(order.deliveryDate);

      if (
        !Number.isNaN(
          backendDeliveryDate.getTime()
        )
      ) {
        return backendDeliveryDate;
      }
    }

    const orderDate =
      getOrderDateTime(order);

    if (!orderDate) {
      return null;
    }

    const deliveryDate =
      new Date(orderDate);

    deliveryDate.setDate(
      deliveryDate.getDate() + 3
    );

    return deliveryDate;
  };

  /* =====================================================
     DELIVERY DAYS
     ===================================================== */

  const getRemainingDeliveryDays = (order) => {

    const deliveryDate =
      getDeliveryDate(order);

    if (!deliveryDate) {
      return 3;
    }

    const now = new Date();

    const today =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

    const deliveryDay =
      new Date(
        deliveryDate.getFullYear(),
        deliveryDate.getMonth(),
        deliveryDate.getDate()
      );

    const difference =
      deliveryDay.getTime() -
      today.getTime();

    const days =
      Math.ceil(
        difference /
          (1000 * 60 * 60 * 24)
      );

    return Math.max(0, days);
  };

  /* =====================================================
     GET ORDER STATUS
     ===================================================== */

  const getOrderStatus = (order) => {

    if (
      order.status ===
        "Order Cancelled" ||
      order.status === "Cancelled"
    ) {
      return "Order Cancelled";
    }

    if (order.status === "Delivered") {
      return "Delivered";
    }

    const deliveryDate =
      getDeliveryDate(order);

    if (deliveryDate) {

      const now = new Date();

      if (now >= deliveryDate) {
        return "Delivered";
      }
    }

    return "Order Received";
  };

  /* =====================================================
     CAN CANCEL ORDER
     ONLY WITHIN 24 HOURS
     ===================================================== */

  const canCancelOrder = (order) => {

    const status =
      getOrderStatus(order);

    if (
      status === "Delivered" ||
      status === "Order Cancelled"
    ) {
      return false;
    }

    const orderDate =
      getOrderDateTime(order);

    if (!orderDate) {
      return false;
    }

    const now = new Date();

    const difference =
      now.getTime() -
      orderDate.getTime();

    const twentyFourHours =
      24 * 60 * 60 * 1000;

    return (
      difference >= 0 &&
      difference <= twentyFourHours
    );
  };

  /* =====================================================
     CANCEL ORDER
     BACKEND + MYSQL + LOCAL STORAGE
     ===================================================== */

  const handleCancelOrder = async (orderId) => {

    const targetOrder =
      orders.find(
        (order) =>
          order.orderId === orderId
      );

    if (!targetOrder) {
      return;
    }

    if (!canCancelOrder(targetOrder)) {

      alert(
        "This order cannot be cancelled now."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );

    if (!confirmed) {
      return;
    }

    const cancelledAt =
      new Date().toISOString();

    /* Immediately update frontend state */

    const updatedOrder = {
      ...targetOrder,
      status: "Order Cancelled",
      cancelledAt: cancelledAt,
    };

    const updatedOrders =
      orders.map(
        (order) =>
          order.orderId === orderId
            ? updatedOrder
            : order
      );

    setOrders(updatedOrders);

    if (
      selectedOrder &&
      selectedOrder.orderId === orderId
    ) {
      setSelectedOrder(updatedOrder);
    }

    /* Save localStorage */

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

    localStorage.setItem(
      "lastOrder",
      JSON.stringify(updatedOrder)
    );

    /* Send cancellation to backend */

    try {

      const response =
        await fetch(
          `https://cdms-backend-80mn.onrender.com/api/orders/${encodeURIComponent(
            orderId
          )}/cancel`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              status:
                "Order Cancelled",
              cancelledAt:
                cancelledAt,
            }),
          }
        );

      if (!response.ok) {

        throw new Error(
          `Backend cancellation failed. Status: ${response.status}`
        );
      }

      let backendOrder = null;

      try {

        backendOrder =
          await response.json();

      } catch (jsonError) {
        // Backend may return empty response
      }

      if (
        backendOrder &&
        backendOrder.orderId
      ) {

        const finalOrder = {
          ...backendOrder,
          status:
            backendOrder.status ||
            "Order Cancelled",
          cancelledAt:
            backendOrder.cancelledAt ||
            cancelledAt,
        };

        const finalOrders =
          updatedOrders.map(
            (order) =>
              order.orderId === orderId
                ? finalOrder
                : order
          );

        setOrders(finalOrders);

        localStorage.setItem(
          "orders",
          JSON.stringify(finalOrders)
        );

        if (
          selectedOrder &&
          selectedOrder.orderId ===
            orderId
        ) {

          setSelectedOrder(
            finalOrder
          );
        }
      }

      alert(
        "Order cancelled successfully."
      );

    } catch (error) {

      console.error(
        "Backend cancellation error:",
        error
      );

      alert(
        "Order cancelled on this device, but backend update failed. Please check that the backend is running."
      );
    }
  };

  /* =====================================================
     OPEN DETAILS
     ===================================================== */

  const openDetails = (order) => {
    setSelectedOrder(order);
  };

  /* =====================================================
     CLOSE DETAILS
     ===================================================== */

  const closeDetails = () => {
    setSelectedOrder(null);
  };

  /* =====================================================
     NO ORDERS
     ===================================================== */

  if (orders.length === 0) {

    return (
      <main className="orders-page">

        <section className="orders-header">

          <Link
            to="/products"
            className="orders-back"
          >
            <FaArrowLeft />
            Back to Products
          </Link>

          <div className="orders-header-content">

            <span className="orders-small-title">
              ORDER MANAGEMENT
            </span>

            <h1>
              📦 Orders
            </h1>

            <p>
              View your recent chocolate order details.
            </p>

          </div>

        </section>

        <section className="no-orders">

          <FaBoxOpen className="no-orders-icon" />

          <h2>
            No Orders Found
          </h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <Link
            to="/products"
            className="start-shopping-button"
          >
            <FaShoppingBag />
            Start Shopping
          </Link>

        </section>

      </main>
    );
  }

  /* =====================================================
     MAIN ORDERS PAGE
     ===================================================== */

  return (
    <main className="orders-page">

      <section className="orders-header">

        <Link
          to="/products"
          className="orders-back"
        >
          <FaArrowLeft />
          Back to Products
        </Link>

        <div className="orders-header-content">

          <span className="orders-small-title">
            ORDER MANAGEMENT
          </span>

          <h1>
            📦 Orders
          </h1>

          <p>
            View your recent chocolate order details.
          </p>

        </div>

      </section>


      <section className="order-history-header">

        <div className="order-history-title">

          <FaBoxOpen />

          <span>
            Order History
          </span>

        </div>

        <strong>
          {orders.length}{" "}
          {orders.length === 1
            ? "Order"
            : "Orders"}
        </strong>

      </section>


      <section className="orders-container">

        {orders.map((order) => {

          const status =
            getOrderStatus(order);

          const remainingDays =
            getRemainingDeliveryDays(
              order
            );

          const cancelAllowed =
            canCancelOrder(order);

          return (

            <article
              className="order-card"
              key={order.orderId}
            >

              <div className="order-card-header">

                <div>

                  <span className="order-label">
                    ORDER ID
                  </span>

                  <h2>
                    {order.orderId ||
                      "ORD-000000"}
                  </h2>

                </div>

                <div
                  className={
                    status ===
                    "Order Cancelled"
                      ? "order-status cancelled"
                      : status ===
                        "Delivered"
                      ? "order-status delivered"
                      : "order-status"
                  }
                >

                  {status ===
                  "Order Cancelled" ? (
                    <FaTimesCircle />
                  ) : (
                    <FaCheckCircle />
                  )}

                  {status}

                </div>

              </div>


              <div className="order-info-row">

                <div className="order-info-box">

                  <FaCalendarAlt />

                  <div>

                    <span>
                      Order Date &amp; Time
                    </span>

                    <strong>
                      {formatDateTime(order)}
                    </strong>

                  </div>

                </div>


                <div className="order-info-box">

                  <FaBoxOpen />

                  <div>

                    <span>
                      Total Boxes
                    </span>

                    <strong>
                      {order.totalBoxes || 0}
                    </strong>

                  </div>

                </div>


                <div className="order-info-box">

                  <FaRupeeSign />

                  <div>

                    <span>
                      Grand Total
                    </span>

                    <strong>
                      ₹
                      {order.grandTotal || 0}
                    </strong>

                  </div>

                </div>

              </div>


              <div
                className={
                  status ===
                  "Order Cancelled"
                    ? "delivery-message cancelled-message"
                    : status ===
                      "Delivered"
                    ? "delivery-message delivered-message"
                    : "delivery-message"
                }
              >

                {status ===
                "Order Cancelled" ? (

                  <>
                    <FaTimesCircle />

                    <strong>
                      This order has been cancelled.
                    </strong>

                    {order.cancelledAt && (

                      <span>
                        Cancelled on{" "}
                        {formatDateTime({
                          createdAt:
                            order.cancelledAt,
                        })}
                      </span>

                    )}

                  </>

                ) : status ===
                  "Delivered" ? (

                  <>
                    <FaCheckCircle />

                    <strong>
                      Order Delivered
                    </strong>
                  </>

                ) : (

                  <>
                    <FaClock />

                    <strong>
                      Order Received
                    </strong>

                    <span>
                      Expected delivery in{" "}
                      {remainingDays === 0
                        ? "3 days"
                        : `${remainingDays} days`}
                    </span>

                  </>

                )}

              </div>


              <div className="ordered-products">

                <h3>
                  <FaShoppingBag />
                  Products
                </h3>

                <div className="product-list">

                  {(Array.isArray(
                    order.items
                  )
                    ? order.items
                    : []
                  ).map(
                    (item, index) => (

                      <div
                        className="ordered-product"
                        key={
                          `${order.orderId}-${
                            item.name || index
                          }`
                        }
                      >

                        <div className="ordered-product-image">

                          <img
                            src={item.image}
                            alt={
                              item.name ||
                              "Product"
                            }
                          />

                        </div>

                        <div className="ordered-product-info">

                          <span>
                            {item.brand}
                          </span>

                          <h4>
                            {item.name}
                          </h4>

                          <p>
                            ₹{item.price} / Box
                          </p>

                        </div>

                        <div className="ordered-product-quantity">

                          <span>
                            Boxes
                          </span>

                          <strong>
                            {item.quantity}
                          </strong>

                        </div>

                        <div className="ordered-product-total">

                          <span>
                            Total
                          </span>

                          <strong>
                            ₹
                            {Number(
                              item.price || 0
                            ) *
                              Number(
                                item.quantity ||
                                  0
                              )}
                          </strong>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>


              <div className="order-bottom">

                <div className="order-bottom-status">

                  <span>
                    Order Status:
                  </span>

                  <strong>
                    {status}
                  </strong>

                </div>


                <div className="order-bottom-actions">

                  <button
                    type="button"
                    className="view-details-button"
                    onClick={() =>
                      openDetails(order)
                    }
                  >
                    <FaEye />
                    View Details
                  </button>

                  {cancelAllowed && (

                    <button
                      type="button"
                      className="cancel-order-button"
                      onClick={() =>
                        handleCancelOrder(
                          order.orderId
                        )
                      }
                    >
                      <FaTimesCircle />
                      Cancel Order
                    </button>

                  )}

                </div>

              </div>

            </article>

          );
        })}

      </section>


      {/* =====================================================
          VIEW DETAILS MODAL
      ===================================================== */}

      {selectedOrder && (

        <div
          className="order-details-overlay"
          onClick={closeDetails}
        >

          <div
            className="order-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="details-close"
              onClick={closeDetails}
              aria-label="Close"
            >
              <FaTimes />
            </button>


            <div className="details-modal-header">

              <span>
                ORDER DETAILS
              </span>

              <h2>
                {selectedOrder.orderId}
              </h2>

              <div
                className={
                  getOrderStatus(
                    selectedOrder
                  ) === "Order Cancelled"
                    ? "modal-status cancelled"
                    : getOrderStatus(
                        selectedOrder
                      ) === "Delivered"
                    ? "modal-status delivered"
                    : "modal-status"
                }
              >

                {getOrderStatus(
                  selectedOrder
                ) ===
                "Order Cancelled" ? (
                  <FaTimesCircle />
                ) : (
                  <FaCheckCircle />
                )}

                {getOrderStatus(
                  selectedOrder
                )}

              </div>

            </div>


            <div className="customer-details">

              <h3>
                Customer Details
              </h3>

              <div className="details-grid">

                <div className="detail-box">

                  <FaStore />

                  <div>

                    <span>
                      Shop Name
                    </span>

                    <strong>
                      {selectedOrder.shopName}
                    </strong>

                  </div>

                </div>


                <div className="detail-box">

                  <FaUser />

                  <div>

                    <span>
                      Owner Name
                    </span>

                    <strong>
                      {selectedOrder.ownerName}
                    </strong>

                  </div>

                </div>


                <div className="detail-box">

                  <FaPhone />

                  <div>

                    <span>
                      Mobile Number
                    </span>

                    <strong>
                      {selectedOrder.mobileNumber}
                    </strong>

                  </div>

                </div>


                <div className="detail-box">

                  <FaCalendarAlt />

                  <div>

                    <span>
                      Order Date &amp; Time
                    </span>

                    <strong>
                      {formatDateTime(
                        selectedOrder
                      )}
                    </strong>

                  </div>

                </div>


                <div className="detail-box address-box">

                  <FaMapMarkerAlt />

                  <div>

                    <span>
                      Delivery Address
                    </span>

                    <strong>
                      {
                        selectedOrder.deliveryAddress
                      }
                    </strong>

                  </div>

                </div>

              </div>

            </div>


            <div className="modal-products">

              <h3>
                <FaShoppingBag />
                Ordered Products
              </h3>

              {(Array.isArray(
                selectedOrder.items
              )
                ? selectedOrder.items
                : []
              ).map(
                (item, index) => (

                  <div
                    className="modal-product"
                    key={
                      `${selectedOrder.orderId}-${
                        item.name || index
                      }`
                    }
                  >

                    <div className="modal-product-image">

                      <img
                        src={item.image}
                        alt={
                          item.name ||
                          "Product"
                        }
                      />

                    </div>

                    <div className="modal-product-info">

                      <span>
                        {item.brand}
                      </span>

                      <h4>
                        {item.name}
                      </h4>

                      <p>
                        ₹{item.price} / Box
                      </p>

                    </div>

                    <div className="modal-product-quantity">

                      <span>
                        Boxes
                      </span>

                      <strong>
                        {item.quantity}
                      </strong>

                    </div>

                    <div className="modal-product-total">

                      <span>
                        Total
                      </span>

                      <strong>
                        ₹
                        {Number(
                          item.price || 0
                        ) *
                          Number(
                            item.quantity ||
                              0
                          )}
                      </strong>

                    </div>

                  </div>

                )
              )}

            </div>


            <div className="modal-summary">

              <div>

                <span>
                  Total Boxes
                </span>

                <strong>
                  {selectedOrder.totalBoxes}
                </strong>

              </div>

              <div>

                <span>
                  Grand Total
                </span>

                <strong>
                  ₹{selectedOrder.grandTotal}
                </strong>

              </div>

            </div>


            <div
              className={
                getOrderStatus(
                  selectedOrder
                ) === "Order Cancelled"
                  ? "modal-delivery cancelled-message"
                  : getOrderStatus(
                      selectedOrder
                    ) === "Delivered"
                  ? "modal-delivery delivered-message"
                  : "modal-delivery"
              }
            >

              {getOrderStatus(
                selectedOrder
              ) === "Order Cancelled" ? (

                <>
                  <FaTimesCircle />

                  <strong>
                    Order Cancelled
                  </strong>

                  {selectedOrder.cancelledAt && (

                    <span>
                      Cancelled on{" "}
                      {formatDateTime({
                        createdAt:
                          selectedOrder.cancelledAt,
                      })}
                    </span>

                  )}

                </>

              ) : getOrderStatus(
                  selectedOrder
                ) === "Delivered" ? (

                <>
                  <FaCheckCircle />

                  <strong>
                    Order Delivered
                  </strong>
                </>

              ) : (

                <>
                  <FaClock />

                  <strong>
                    Expected delivery in{" "}
                    {
                      getRemainingDeliveryDays(
                        selectedOrder
                      )
                    }{" "}
                    days
                  </strong>
                </>

              )}

            </div>


            {canCancelOrder(
              selectedOrder
            ) && (

              <button
                type="button"
                className="modal-cancel-button"
                onClick={() =>
                  handleCancelOrder(
                    selectedOrder.orderId
                  )
                }
              >
                <FaTimesCircle />
                Cancel Order
              </button>

            )}

          </div>

        </div>

      )}

    </main>
  );
}

export default Orders;

