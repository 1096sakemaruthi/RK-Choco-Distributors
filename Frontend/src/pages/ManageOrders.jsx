import React, { useEffect, useMemo, useState } from "react";

import {
  FaShoppingCart,
  FaSearch,
  FaEye,
  FaTrash,
  FaTimes,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaBoxOpen,
  FaExclamationTriangle,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "../styles/manageorders.css";

import api from "../services/api";


function ManageOrders() {

  // =========================================================
  // STATE
  // =========================================================

  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(true);


  // =========================================================
  // LOAD ORDERS FROM SPRING BOOT / MYSQL
  // =========================================================

  useEffect(() => {

    loadOrders();

  }, []);


  const loadOrders = () => {

    setLoading(true);

    api
      .get("/orders")

      .then((response) => {

        if (Array.isArray(response.data)) {

          const formattedOrders =
            response.data.map((order) => {

              let parsedItems = [];

              if (order.items) {

                try {

                  if (Array.isArray(order.items)) {

                    parsedItems = order.items;

                  } else {

                    parsedItems =
                      JSON.parse(order.items);

                  }

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

                id: order.orderId,

                customerName:
                  order.ownerName ||
                  order.customerName ||
                  order.customer ||
                  "Customer",

                mobile:
                  order.mobileNumber ||
                  order.mobile ||
                  order.phone ||
                  "No mobile",

                total:
                  order.grandTotal ||
                  order.totalAmount ||
                  order.total ||
                  0,

                date:
                  order.createdAt ||
                  order.orderDate ||
                  "",

                items: parsedItems,

              };

            });


          setOrders(formattedOrders);

        } else {

          setOrders([]);

        }

      })

      .catch((error) => {

        console.error(
          "Error loading orders:",
          error
        );

        setOrders([]);

      })

      .finally(() => {

        setLoading(false);

      });

  };


  // =========================================================
  // ORDER STATUS
  // =========================================================

  const getStatus = (status) => {

    const value =
      String(status || "Pending")
        .trim()
        .toLowerCase();


    if (
      value === "pending" ||
      value === "order received" ||
      value === "order_received"
    ) {

      return {

        text: "Pending",

        className: "pending",

      };

    }


    if (value === "confirmed") {

      return {

        text: "Confirmed",

        className: "confirmed",

      };

    }


    if (value === "processing") {

      return {

        text: "Processing",

        className: "processing",

      };

    }


    if (
      value === "out for delivery" ||
      value === "out-for-delivery"
    ) {

      return {

        text: "Out for Delivery",

        className: "out-delivery",

      };

    }


    if (value === "delivered") {

      return {

        text: "Delivered",

        className: "delivered",

      };

    }


    if (
      value === "cancelled" ||
      value === "canceled" ||
      value === "order cancelled"
    ) {

      return {

        text: "Cancelled",

        className: "cancelled",

      };

    }


    return {

      text: "Pending",

      className: "pending",

    };

  };


  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================

  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {

    try {

      /*
       * IMPORTANT:
       * Status ni Spring Boot / MySQL lo save chestunnam.
       *
       * Frontend lo maatrame status change cheyyadam kaadu.
       */

      const response =
        await api.put(
          `/orders/${orderId}/status`,
          {
            status: newStatus,
          }
        );


      const backendOrder =
        response.data;


      // =====================================================
      // UPDATE FRONTEND ORDERS
      // =====================================================

      setOrders((previousOrders) =>

        previousOrders.map(
          (order) => {

            if (
              order.id === orderId
            ) {

              return {

                ...order,

                ...backendOrder,

                id:
                  backendOrder.orderId ||
                  orderId,

                status:
                  backendOrder.status ||
                  newStatus,

                customerName:
                  backendOrder.ownerName ||
                  order.customerName,

                mobile:
                  backendOrder.mobileNumber ||
                  order.mobile,

                total:
                  backendOrder.grandTotal ??
                  order.total,

                date:
                  backendOrder.createdAt ||
                  order.date,

                shopName:
                  backendOrder.shopName ||
                  order.shopName,

                deliveryAddress:
                  backendOrder.deliveryAddress ||
                  order.deliveryAddress,

              };

            }

            return order;

          }
        )

      );


      // =====================================================
      // UPDATE SELECTED ORDER
      // =====================================================

      if (
        selectedOrder?.id === orderId
      ) {

        setSelectedOrder((previous) => ({

          ...previous,

          ...backendOrder,

          id:
            backendOrder.orderId ||
            orderId,

          status:
            backendOrder.status ||
            newStatus,

          customerName:
            backendOrder.ownerName ||
            previous.customerName,

          mobile:
            backendOrder.mobileNumber ||
            previous.mobile,

          total:
            backendOrder.grandTotal ??
            previous.total,

          date:
            backendOrder.createdAt ||
            previous.date,

        }));

      }


    } catch (error) {

      console.error(
        "Error updating order status:",
        error
      );


      if (error.response) {

        console.error(
          "Backend response:",
          error.response.data
        );

      }


      alert(
        "Unable to update order status. Please try again."
      );

    }

  };


  // =========================================================
  // DELETE ORDER
  // =========================================================

  const deleteOrder = (orderId) => {

    const order =
      orders.find(
        (item) =>
          item.id === orderId
      );


    if (!order) {

      return;

    }


    const confirmed =
      window.confirm(
        `Are you sure you want to delete Order #${orderId}?`
      );


    if (!confirmed) {

      return;

    }


    /*
     * Delete order from Spring Boot / MySQL first.
     */

    api
      .delete(`/orders/${orderId}`)

      .then(() => {

        setOrders((previousOrders) =>

          previousOrders.filter(
            (item) =>
              item.id !== orderId
          )

        );


        if (
          selectedOrder?.id === orderId
        ) {

          setSelectedOrder(null);

        }

      })

      .catch((error) => {

        console.error(
          "Error deleting order:",
          error
        );

        alert(
          "Unable to delete order. Please try again."
        );

      });

  };


  // =========================================================
  // FILTER ORDERS
  // =========================================================

  const filteredOrders =
    useMemo(() => {

      return orders.filter(
        (order) => {

          const searchText =
            search
              .toLowerCase()
              .trim();


          const orderId =
            String(
              order.id || ""
            ).toLowerCase();


          const customerName =
            String(
              order.customerName ||
              order.ownerName ||
              ""
            ).toLowerCase();


          const mobile =
            String(
              order.mobile ||
              order.mobileNumber ||
              ""
            ).toLowerCase();


          const matchesSearch =

            orderId.includes(
              searchText
            ) ||

            customerName.includes(
              searchText
            ) ||

            mobile.includes(
              searchText
            );


          const currentStatus =
            String(
              order.status ||
              "Pending"
            )
              .trim()
              .toLowerCase();


          let matchesFilter = true;


          if (
            filter === "pending"
          ) {

            matchesFilter =

              currentStatus ===
                "pending" ||

              currentStatus ===
                "order received" ||

              currentStatus ===
                "order_received";

          }


          else if (
            filter === "cancelled"
          ) {

            matchesFilter =

              currentStatus ===
                "cancelled" ||

              currentStatus ===
                "canceled" ||

              currentStatus ===
                "order cancelled";

          }


          else if (
            filter !== "all"
          ) {

            matchesFilter =
              currentStatus ===
              filter;

          }


          return (
            matchesSearch &&
            matchesFilter
          );

        }
      );

    }, [
      orders,
      search,
      filter,
    ]);


  // =========================================================
  // STATISTICS
  // =========================================================

  const totalOrders =
    orders.length;


  const pendingOrders =
    orders.filter(
      (order) => {

        const status =
          String(
            order.status ||
            "Pending"
          )
            .trim()
            .toLowerCase();


        return (

          status === "pending" ||

          status ===
            "order received" ||

          status ===
            "order_received"

        );

      }
    ).length;


  const confirmedOrders =
    orders.filter(
      (order) =>
        String(
          order.status || ""
        )
          .trim()
          .toLowerCase() ===
        "confirmed"
    ).length;


  const deliveredOrders =
    orders.filter(
      (order) =>
        String(
          order.status || ""
        )
          .trim()
          .toLowerCase() ===
        "delivered"
    ).length;


  const cancelledOrders =
    orders.filter(
      (order) => {

        const status =
          String(
            order.status || ""
          )
            .trim()
            .toLowerCase();


        return (

          status ===
            "cancelled" ||

          status ===
            "canceled" ||

          status ===
            "order cancelled"

        );

      }
    ).length;


  const totalOrderValue =
    orders.reduce(
      (total, order) =>

        total +
        Number(
          order.grandTotal ||
          order.totalAmount ||
          order.total ||
          0
        ),

      0
    );


  // =========================================================
  // FORMAT AMOUNT
  // =========================================================

  const formatAmount =
    (amount) => {

      return Number(
        amount || 0
      ).toLocaleString(
        "en-IN",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      );

    };


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate =
    (date) => {

      if (!date) {

        return "—";

      }


      const parsedDate =
        new Date(date);


      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {

        return String(date);

      }


      return parsedDate.toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    };


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="manage-orders-page">


      {/* HEADER */}

      <header className="orders-header">

        <div className="orders-header-left">

          <Link
            to="/admin-dashboard"
            className="back-dashboard"
          >

            <FaArrowLeft />

            <span>
              Dashboard
            </span>

          </Link>


          <div className="orders-title-area">

            <div className="orders-title-icon">

              <FaShoppingCart />

            </div>


            <div>

              <span className="section-label">
                ADMINISTRATION
              </span>


              <h1>
                Manage Orders
              </h1>


              <p>
                View and manage customer orders
                from one place.
              </p>

            </div>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="orders-main">


        {/* STATISTICS */}

        <section className="order-stats">


          <div className="order-stat-card">

            <div className="order-stat-icon total">

              <FaShoppingCart />

            </div>

            <div>

              <span>
                Total Orders
              </span>

              <strong>
                {totalOrders}
              </strong>

            </div>

          </div>


          <div className="order-stat-card">

            <div className="order-stat-icon pending">

              <FaClock />

            </div>

            <div>

              <span>
                Pending
              </span>

              <strong>
                {pendingOrders}
              </strong>

            </div>

          </div>


          <div className="order-stat-card">

            <div className="order-stat-icon confirmed">

              <FaCheckCircle />

            </div>

            <div>

              <span>
                Confirmed
              </span>

              <strong>
                {confirmedOrders}
              </strong>

            </div>

          </div>


          <div className="order-stat-card">

            <div className="order-stat-icon delivered">

              <FaTruck />

            </div>

            <div>

              <span>
                Delivered
              </span>

              <strong>
                {deliveredOrders}
              </strong>

            </div>

          </div>


          <div className="order-stat-card">

            <div className="order-stat-icon cancelled">

              <FaExclamationTriangle />

            </div>

            <div>

              <span>
                Cancelled
              </span>

              <strong>
                {cancelledOrders}
              </strong>

            </div>

          </div>


          <div className="order-stat-card">

            <div className="order-stat-icon value">
              ₹
            </div>

            <div>

              <span>
                Total Order Value
              </span>

              <strong>

                ₹
                {formatAmount(
                  totalOrderValue
                )}

              </strong>

            </div>

          </div>


        </section>


        {/* ORDER LIST */}

        <section className="orders-list-section">


          <div className="list-heading">

            <div>

              <span className="section-label">
                CUSTOMER ORDERS
              </span>


              <h2>
                All Orders
              </h2>


              <p>
                Customer orders will appear here.
              </p>

            </div>


            <div className="order-count">

              {filteredOrders.length}
              {" "}
              Orders

            </div>

          </div>


          {/* SEARCH + FILTER */}

          <div className="orders-toolbar">


            <div className="order-search-box">

              <FaSearch />


              <input
                type="text"
                placeholder="Search order, customer or mobile..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="order-filter-buttons">


              <button
                type="button"
                className={
                  filter === "all"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("all")
                }
              >
                All
              </button>


              <button
                type="button"
                className={
                  filter === "pending"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("pending")
                }
              >
                Pending
              </button>


              <button
                type="button"
                className={
                  filter === "confirmed"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("confirmed")
                }
              >
                Confirmed
              </button>


              <button
                type="button"
                className={
                  filter === "processing"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("processing")
                }
              >
                Processing
              </button>


              <button
                type="button"
                className={
                  filter ===
                  "out for delivery"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(
                    "out for delivery"
                  )
                }
              >
                Out for Delivery
              </button>


              <button
                type="button"
                className={
                  filter === "delivered"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("delivered")
                }
              >
                Delivered
              </button>


              <button
                type="button"
                className={
                  filter === "cancelled"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("cancelled")
                }
              >
                Cancelled
              </button>


            </div>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="empty-orders">

              <div className="empty-order-icon">
                <FaBoxOpen />
              </div>


              <h3>
                Loading Orders...
              </h3>


              <p>
                Please wait while order data
                is loaded.
              </p>

            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            filteredOrders.length === 0 && (

              <div className="empty-orders">

                <div className="empty-order-icon">
                  <FaBoxOpen />
                </div>


                <h3>

                  {orders.length === 0
                    ? "No Customer Orders Yet"
                    : "No Orders Found"}

                </h3>


                <p>

                  {orders.length === 0
                    ? "Customer orders will appear here when customers place orders."
                    : "Try changing your search or status filter."}

                </p>

              </div>

            )}


          {/* TABLE */}

          {!loading &&
            filteredOrders.length > 0 && (

              <div className="orders-table-wrapper">

                <table className="orders-table">

                  <thead>

                    <tr>

                      <th>
                        Order
                      </th>

                      <th>
                        Customer
                      </th>

                      <th>
                        Date
                      </th>

                      <th>
                        Products
                      </th>

                      <th>
                        Total
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredOrders.map(
                      (order) => {

                        const status =
                          getStatus(
                            order.status
                          );


                        const customerName =
                          order.customerName ||
                          order.ownerName ||
                          "Customer";


                        const items =
                          Array.isArray(
                            order.items
                          )
                            ? order.items
                            : [];


                        return (

                          <tr
                            key={
                              order.id
                            }
                          >

                            <td>

                              <strong className="order-id">

                                #
                                {order.id}

                              </strong>

                            </td>


                            <td>

                              <div className="customer-cell">

                                <strong>
                                  {customerName}
                                </strong>


                                <span>

                                  {order.mobile ||
                                    order.mobileNumber ||
                                    "No mobile"}

                                </span>

                              </div>

                            </td>


                            <td>

                              <span className="order-date">

                                {formatDate(
                                  order.date
                                )}

                              </span>

                            </td>


                            <td>

                              <span className="items-count">

                                {items.length ||
                                  order.totalProducts ||
                                  0}

                                {" "}
                                Items

                              </span>

                            </td>


                            <td>

                              <strong className="order-total">

                                ₹
                                {formatAmount(
                                  order.total
                                )}

                              </strong>

                            </td>


                            <td>

                              <select
                                className={`status-select ${status.className}`}
                                value={
                                  status.text
                                }
                                onChange={(e) =>
                                  updateOrderStatus(
                                    order.id,
                                    e.target.value
                                  )
                                }
                              >

                                <option value="Pending">
                                  Pending
                                </option>

                                <option value="Confirmed">
                                  Confirmed
                                </option>

                                <option value="Processing">
                                  Processing
                                </option>

                                <option value="Out for Delivery">
                                  Out for Delivery
                                </option>

                                <option value="Delivered">
                                  Delivered
                                </option>

                                <option value="Cancelled">
                                  Cancelled
                                </option>

                              </select>

                            </td>


                            <td>

                              <div className="order-actions">

                                <button
                                  type="button"
                                  className="view-order-btn"
                                  onClick={() =>
                                    setSelectedOrder(
                                      order
                                    )
                                  }
                                  title="View Order"
                                >

                                  <FaEye />

                                </button>


                                <button
                                  type="button"
                                  className="delete-order-btn"
                                  onClick={() =>
                                    deleteOrder(
                                      order.id
                                    )
                                  }
                                  title="Delete Order"
                                >

                                  <FaTrash />

                                </button>


                              </div>

                            </td>


                          </tr>

                        );

                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}


        </section>

      </main>


      {/* ORDER DETAILS MODAL */}

      {selectedOrder && (

        <div className="order-modal-overlay">

          <div className="order-modal">


            <div className="order-modal-header">

              <div>

                <span className="section-label">
                  ORDER DETAILS
                </span>


                <h2>

                  Order #
                  {selectedOrder.id}

                </h2>

              </div>


              <button
                type="button"
                className="close-order-modal"
                onClick={() =>
                  setSelectedOrder(null)
                }
              >

                <FaTimes />

              </button>

            </div>


            <div className="order-modal-body">


              <div className="detail-section">

                <h3>
                  Customer Information
                </h3>


                <div className="detail-grid">


                  <div>

                    <span>
                      Customer
                    </span>

                    <strong>

                      {selectedOrder.customerName ||
                        selectedOrder.ownerName ||
                        "Customer"}

                    </strong>

                  </div>


                  <div>

                    <span>
                      Shop Name
                    </span>

                    <strong>

                      {selectedOrder.shopName ||
                        "Shop Not Provided"}

                    </strong>

                  </div>


                  <div>

                    <span>
                      Mobile
                    </span>

                    <strong>

                      {selectedOrder.mobile ||
                        selectedOrder.mobileNumber ||
                        "—"}

                    </strong>

                  </div>


                  <div>

                    <span>
                      Order Date
                    </span>

                    <strong>

                      {formatDate(
                        selectedOrder.date
                      )}

                    </strong>

                  </div>


                  <div>

                    <span>
                      Status
                    </span>

                    <strong>

                      {getStatus(
                        selectedOrder.status
                      ).text}

                    </strong>

                  </div>


                </div>

              </div>


              <div className="detail-section">

                <h3>
                  Delivery Address
                </h3>


                <p className="delivery-address">

                  {selectedOrder.deliveryAddress ||
                    selectedOrder.address ||
                    "Address not available"}

                </p>

              </div>


              <div className="detail-section">

                <h3>
                  Ordered Products
                </h3>


                <div className="modal-products">


                  {Array.isArray(
                    selectedOrder.items
                  ) &&
                  selectedOrder.items.length >
                    0 ? (

                    selectedOrder.items.map(
                      (item, index) => {

                        const quantity =
                          Number(
                            item.quantity ||
                            item.qty ||
                            1
                          );


                        const itemPrice =
                          Number(
                            item.price ||
                            0
                          );


                        const itemTotal =
                          Number(
                            item.total ||
                            item.totalAmount ||
                            itemPrice *
                              quantity
                          );


                        return (

                          <div
                            className="modal-product-row"
                            key={
                              item.id ||
                              index
                            }
                          >

                            <div>

                              <strong>

                                {item.name ||
                                  item.productName ||
                                  "Product"}

                              </strong>


                              <span>

                                Quantity:
                                {" "}
                                {quantity}

                              </span>

                            </div>


                            <strong>

                              ₹
                              {formatAmount(
                                itemTotal
                              )}

                            </strong>

                          </div>

                        );

                      }
                    )

                  ) : (

                    <div className="no-order-items">

                      Product details not available.

                    </div>

                  )}


                </div>

              </div>


              <div className="order-total-section">

                <span>
                  Total Amount
                </span>


                <strong>

                  ₹
                  {formatAmount(
                    selectedOrder.total
                  )}

                </strong>

              </div>


            </div>

          </div>

        </div>

      )}


    </div>

  );

}


export default ManageOrders;