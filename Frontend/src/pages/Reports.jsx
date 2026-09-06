import React, { useEffect, useMemo, useState } from "react";

import {
  FaArrowLeft,
  FaChartBar,
  FaShoppingCart,
  FaRupeeSign,
  FaUsers,
  FaBoxOpen,
  FaClock,
  FaCheckCircle,
  FaTruck,
  FaTimesCircle,
  FaCalendarAlt,
  FaTrophy,
  FaBoxes,
  FaTags,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "../styles/Reports.css";

import api from "../services/api";


function Reports() {

  // =========================================================
  // STATE
  // =========================================================

  const [orders, setOrders] = useState([]);

  const [period, setPeriod] = useState("All Time");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);


  // =========================================================
  // LOAD REAL ORDERS FROM SPRING BOOT / MYSQL
  // =========================================================

  useEffect(() => {

    loadOrders();

  }, []);


  const loadOrders = async () => {

    setLoading(true);

    try {

      const response = await api.get("/orders");


      if (Array.isArray(response.data)) {

        const formattedOrders =
          response.data.map((order) => {

            // ---------------------------------------------
            // PARSE ITEMS
            // ---------------------------------------------

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


            // ---------------------------------------------
            // CUSTOMER NAME
            // ---------------------------------------------

            const customerName =
              order.ownerName ||
              order.customerName ||
              order.customer ||
              "Customer";


            // ---------------------------------------------
            // ORDER ID
            // ---------------------------------------------

            const orderId =
              order.orderId ||
              order.id ||
              "N/A";


            // ---------------------------------------------
            // DATE
            // ---------------------------------------------

            const orderDate =
              order.createdAt ||
              order.orderDate ||
              "";


            // ---------------------------------------------
            // STATUS
            // ---------------------------------------------

            let status =
              String(
                order.status ||
                "Pending"
              ).trim();


            /*
             * Backend may use:
             *
             * Order Received
             *
             * Reports UI uses:
             *
             * Pending
             */

            if (
              status.toLowerCase() ===
                "order received" ||
              status.toLowerCase() ===
                "order_received"
            ) {

              status = "Pending";

            }


            // ---------------------------------------------
            // TOTAL
            // ---------------------------------------------

            const amount =
              Number(
                order.grandTotal ||
                order.totalAmount ||
                order.total ||
                0
              );


            // ---------------------------------------------
            // TOTAL ITEMS / BOXES
            // ---------------------------------------------

            let itemCount = 0;


            if (
              Array.isArray(parsedItems) &&
              parsedItems.length > 0
            ) {

              itemCount =
                parsedItems.reduce(
                  (total, item) =>
                    total +
                    Number(
                      item.quantity ||
                      item.qty ||
                      0
                    ),
                  0
                );

            } else {

              itemCount =
                Number(
                  order.totalBoxes ||
                  order.totalProducts ||
                  0
                );

            }


            return {

              ...order,

              id: orderId,

              customer: customerName,

              date: orderDate,

              status: status,

              amount: amount,

              items: itemCount,

              parsedItems: parsedItems,

            };

          });


        setOrders(formattedOrders);

      } else {

        setOrders([]);

      }

    } catch (error) {

      console.error(
        "Error loading reports:",
        error
      );

      setOrders([]);

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // DATE HELPERS
  // =========================================================

  const getOrderDate = (date) => {

    if (!date) {

      return null;

    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return null;

    }


    return parsedDate;

  };


  // =========================================================
  // PERIOD FILTER
  // =========================================================

  const periodOrders = useMemo(() => {

    if (period === "All Time") {

      return orders;

    }


    const now =
      new Date();


    const today =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );


    return orders.filter((order) => {

      const orderDate =
        getOrderDate(
          order.date
        );


      if (!orderDate) {

        return false;

      }


      const orderDay =
        new Date(
          orderDate.getFullYear(),
          orderDate.getMonth(),
          orderDate.getDate()
        );


      // ---------------------------------------------
      // TODAY
      // ---------------------------------------------

      if (period === "Today") {

        return (
          orderDay.getTime() ===
          today.getTime()
        );

      }


      // ---------------------------------------------
      // THIS WEEK
      // ---------------------------------------------

      if (period === "This Week") {

        const startOfWeek =
          new Date(today);


        const day =
          startOfWeek.getDay();


        const difference =
          day === 0
            ? 6
            : day - 1;


        startOfWeek.setDate(
          startOfWeek.getDate() -
          difference
        );


        return (
          orderDay >=
          startOfWeek
        );

      }


      // ---------------------------------------------
      // THIS MONTH
      // ---------------------------------------------

      if (period === "This Month") {

        return (
          orderDay.getMonth() ===
            today.getMonth() &&
          orderDay.getFullYear() ===
            today.getFullYear()
        );

      }


      return true;

    });

  }, [
    orders,
    period,
  ]);


  // =========================================================
  // SEARCH FILTER
  // =========================================================

  const filteredOrders =
    useMemo(() => {

      const searchValue =
        search
          .toLowerCase()
          .trim();


      return periodOrders.filter(
        (order) => {

          return (

            String(
              order.id || ""
            )
              .toLowerCase()
              .includes(
                searchValue
              ) ||

            String(
              order.customer || ""
            )
              .toLowerCase()
              .includes(
                searchValue
              ) ||

            String(
              order.status || ""
            )
              .toLowerCase()
              .includes(
                searchValue
              )

          );

        }
      );

    }, [
      periodOrders,
      search,
    ]);


  // =========================================================
  // STATISTICS
  // =========================================================

  const totalOrders =
    periodOrders.length;


  const totalSales =
    periodOrders.reduce(
      (total, order) =>
        total +
        Number(
          order.amount || 0
        ),
      0
    );


  const totalItems =
    periodOrders.reduce(
      (total, order) =>
        total +
        Number(
          order.items || 0
        ),
      0
    );


  // =========================================================
  // UNIQUE CUSTOMERS
  // =========================================================

  const totalCustomers =
    new Set(
      periodOrders.map(
        (order) =>
          String(
            order.customer || ""
          )
            .trim()
            .toLowerCase()
      )
      .filter(
        (name) =>
          name &&
          name !== "customer"
      )
    ).size;


  // =========================================================
  // ORDER STATUS COUNTS
  // =========================================================

  const pendingOrders =
    periodOrders.filter(
      (order) =>
        String(
          order.status || ""
        )
          .trim()
          .toLowerCase() ===
        "pending"
    ).length;


  const confirmedOrders =
    periodOrders.filter(
      (order) =>
        String(
          order.status || ""
        )
          .trim()
          .toLowerCase() ===
        "confirmed"
    ).length;


  const deliveredOrders =
    periodOrders.filter(
      (order) =>
        String(
          order.status || ""
        )
          .trim()
          .toLowerCase() ===
        "delivered"
    ).length;


  const cancelledOrders =
    periodOrders.filter(
      (order) => {

        const status =
          String(
            order.status || ""
          )
            .trim()
            .toLowerCase();


        return (
          status === "cancelled" ||
          status === "canceled" ||
          status ===
            "order cancelled"
        );

      }
    ).length;


  // =========================================================
  // BEST SELLING PRODUCTS
  // =========================================================

  const bestProducts =
    useMemo(() => {

      const productMap =
        {};


      periodOrders.forEach(
        (order) => {

          const items =
            Array.isArray(
              order.parsedItems
            )
              ? order.parsedItems
              : [];


          items.forEach(
            (item) => {

              const name =
                item.name ||
                item.productName ||
                "Product";


              const brand =
                item.brand ||
                "Chocolate";


              const quantity =
                Number(
                  item.quantity ||
                  item.qty ||
                  0
                );


              const price =
                Number(
                  item.price ||
                  0
                );


              const value =
                Number(
                  item.total ||
                  item.totalAmount ||
                  price *
                    quantity
                );


              if (
                !productMap[name]
              ) {

                productMap[name] = {

                  name: name,

                  brand: brand,

                  sold: 0,

                  value: 0,

                };

              }


              productMap[name].sold +=
                quantity;


              productMap[name].value +=
                value;

            }
          );

        }
      );


      return Object.values(
        productMap
      )
        .sort(
          (a, b) =>
            b.sold - a.sold
        )
        .slice(0, 5);

    }, [
      periodOrders,
    ]);


  // =========================================================
  // BRAND SALES
  // =========================================================

  const brandSales =
    useMemo(() => {

      const brandMap =
        {};


      periodOrders.forEach(
        (order) => {

          const items =
            Array.isArray(
              order.parsedItems
            )
              ? order.parsedItems
              : [];


          const brandsInOrder =
            new Set();


          items.forEach(
            (item) => {

              const brand =
                item.brand ||
                "Unknown";


              const quantity =
                Number(
                  item.quantity ||
                  item.qty ||
                  0
                );


              const price =
                Number(
                  item.price ||
                  0
                );


              const value =
                Number(
                  item.total ||
                  item.totalAmount ||
                  price *
                    quantity
                );


              if (
                !brandMap[brand]
              ) {

                brandMap[brand] = {

                  brand: brand,

                  orders: 0,

                  value: 0,

                };

              }


              brandMap[brand].value +=
                value;


              brandsInOrder.add(
                brand
              );

            }
          );


          brandsInOrder.forEach(
            (brand) => {

              if (
                brandMap[brand]
              ) {

                brandMap[brand].orders +=
                  1;

              }

            }
          );

        }
      );


      return Object.values(
        brandMap
      )
        .sort(
          (a, b) =>
            b.value - a.value
        )
        .slice(0, 5);

    }, [
      periodOrders,
    ]);


  // =========================================================
  // FORMAT AMOUNT
  // =========================================================

  const formatAmount =
    (amount) => {

      return Number(
        amount || 0
      ).toLocaleString(
        "en-IN"
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


      return parsedDate.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    };


  // =========================================================
  // EXPORT REPORT
  // =========================================================

  const handleExport = () => {

    if (
      filteredOrders.length === 0
    ) {

      alert(
        "No report data available to export."
      );

      return;

    }


    const header =
      "Order ID,Customer,Date,Status,Items,Amount\n";


    const rows =
      filteredOrders
        .map(
          (order) =>
            `"${order.id}","${order.customer}","${formatDate(
              order.date
            )}","${order.status}","${
              order.items
            }","${order.amount}"`
        )
        .join("\n");


    const csv =
      header + rows;


    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const link =
      document.createElement(
        "a"
      );


    link.href =
      url;


    link.download =
      "RK-Choco-Distributor-Report.csv";


    document.body.appendChild(
      link
    );


    link.click();


    document.body.removeChild(
      link
    );


    URL.revokeObjectURL(
      url
    );

  };


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="reports-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="reports-header">

        <div className="reports-header-left">


          <Link
            to="/admin-dashboard"
            className="reports-back-dashboard"
          >

            <FaArrowLeft />

            <span>
              Dashboard
            </span>

          </Link>


          <div className="reports-title-area">


            <div className="reports-title-icon">

              <FaChartBar />

            </div>


            <div>

              <span className="reports-section-label">

                ADMINISTRATION

              </span>


              <h1>

                Reports & Analytics

              </h1>


              <p>

                View your business performance
                and sales reports.

              </p>

            </div>

          </div>

        </div>


        <button
          className="export-report-btn"
          onClick={handleExport}
          disabled={loading}
        >

          <FaChartBar />

          Export Report

        </button>


      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="reports-main">


        {/* ===================================================
            PERIOD
        =================================================== */}

        <div className="reports-period-bar">


          <div>

            <span className="reports-small-label">

              REPORT PERIOD

            </span>


            <h2>

              Business Overview

            </h2>

          </div>


          <div className="period-buttons">


            {[
              "Today",
              "This Week",
              "This Month",
              "All Time",
            ].map(
              (item) => (

                <button
                  key={item}
                  className={
                    period === item
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setPeriod(
                      item
                    )
                  }
                >

                  {item}

                </button>

              )
            )}


          </div>


        </div>


        {/* ===================================================
            MAIN STATISTICS
        =================================================== */}

        <section className="report-stats">


          {/* TOTAL ORDERS */}

          <div className="report-stat-card">


            <div className="report-stat-icon orders">

              <FaShoppingCart />

            </div>


            <div>

              <span>
                Total Orders
              </span>


              <strong>

                {loading
                  ? "..."
                  : totalOrders}

              </strong>

            </div>


          </div>


          {/* TOTAL SALES */}

          <div className="report-stat-card">


            <div className="report-stat-icon sales">

              <FaRupeeSign />

            </div>


            <div>

              <span>
                Total Sales
              </span>


              <strong>

                {loading
                  ? "..."
                  : `₹${formatAmount(
                      totalSales
                    )}`}

              </strong>

            </div>


          </div>


          {/* CUSTOMERS */}

          <div className="report-stat-card">


            <div className="report-stat-icon customers">

              <FaUsers />

            </div>


            <div>

              <span>
                Total Customers
              </span>


              <strong>

                {loading
                  ? "..."
                  : totalCustomers}

              </strong>

            </div>


          </div>


          {/* ITEMS */}

          <div className="report-stat-card">


            <div className="report-stat-icon products">

              <FaBoxOpen />

            </div>


            <div>

              <span>
                Items Sold
              </span>


              <strong>

                {loading
                  ? "..."
                  : totalItems}

              </strong>

            </div>


          </div>


        </section>


        {/* ===================================================
            ORDER STATUS
        =================================================== */}

        <section className="order-status-section">


          <div className="report-section-heading">


            <div>

              <span className="reports-small-label">

                ORDER STATUS

              </span>


              <h2>

                Order Summary

              </h2>


              <p>

                Current order status overview.

              </p>

            </div>


          </div>


          <div className="status-report-grid">


            {/* PENDING */}

            <div className="status-report-card pending">


              <div className="status-report-icon">

                <FaClock />

              </div>


              <div>

                <span>
                  Pending
                </span>


                <strong>

                  {loading
                    ? "..."
                    : pendingOrders}

                </strong>

              </div>


            </div>


            {/* CONFIRMED */}

            <div className="status-report-card confirmed">


              <div className="status-report-icon">

                <FaCheckCircle />

              </div>


              <div>

                <span>
                  Confirmed
                </span>


                <strong>

                  {loading
                    ? "..."
                    : confirmedOrders}

                </strong>

              </div>


            </div>


            {/* DELIVERED */}

            <div className="status-report-card delivered">


              <div className="status-report-icon">

                <FaTruck />

              </div>


              <div>

                <span>
                  Delivered
                </span>


                <strong>

                  {loading
                    ? "..."
                    : deliveredOrders}

                </strong>

              </div>


            </div>


            {/* CANCELLED */}

            <div className="status-report-card cancelled">


              <div className="status-report-icon">

                <FaTimesCircle />

              </div>


              <div>

                <span>
                  Cancelled
                </span>


                <strong>

                  {loading
                    ? "..."
                    : cancelledOrders}

                </strong>

              </div>


            </div>


          </div>


        </section>


        {/* ===================================================
            ORDER PERFORMANCE
        =================================================== */}

        <section className="orders-report-section">


          <div className="report-section-heading">


            <div>

              <span className="reports-small-label">

                SALES REPORT

              </span>


              <h2>

                Order Performance

              </h2>


              <p>

                Detailed customer order information.

              </p>

            </div>


            <span className="report-count">

              {loading
                ? "Loading..."
                : `${filteredOrders.length} Orders`}

            </span>


          </div>


          {/* SEARCH */}

          <div className="report-search-area">


            <div className="report-search">


              <FaChartBar />


              <input
                type="text"
                placeholder="Search order, customer or status..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />


            </div>


            <div className="report-date">


              <FaCalendarAlt />


              <span>

                {period}

              </span>


            </div>


          </div>


          {/* TABLE */}

          <div className="reports-table-wrapper">


            <table className="reports-table">


              <thead>

                <tr>

                  <th>
                    Order ID
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Items
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Total
                  </th>

                </tr>

              </thead>


              <tbody>


                {loading ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="no-report-data"
                    >

                      Loading report data...

                    </td>

                  </tr>

                ) : filteredOrders.length >
                  0 ? (

                  filteredOrders.map(
                    (order) => (

                      <tr
                        key={
                          order.id
                        }
                      >


                        <td>

                          <strong className="report-order-id">

                            {order.id}

                          </strong>

                        </td>


                        <td>

                          <strong className="report-customer">

                            {order.customer}

                          </strong>

                        </td>


                        <td>

                          <span className="report-date-text">

                            {formatDate(
                              order.date
                            )}

                          </span>

                        </td>


                        <td>

                          <span className="report-items">

                            {order.items}
                            {" "}
                            Items

                          </span>

                        </td>


                        <td>

                          <span
                            className={
                              `report-status ${String(
                                order.status ||
                                ""
                              )
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`
                            }
                          >

                            {order.status}

                          </span>

                        </td>


                        <td>

                          <strong className="report-total">

                            ₹
                            {formatAmount(
                              order.amount
                            )}

                          </strong>

                        </td>


                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="no-report-data"
                    >

                      No report data found.

                    </td>

                  </tr>

                )}


              </tbody>


            </table>


          </div>


        </section>


        {/* ===================================================
            LOWER REPORTS
        =================================================== */}

        <section className="lower-report-grid">


          {/* =================================================
              BEST PRODUCTS
          ================================================= */}

          <div className="best-products-card">


            <div className="report-card-heading">


              <div className="report-card-heading-icon">

                <FaTrophy />

              </div>


              <div>

                <span>
                  TOP PRODUCTS
                </span>


                <h3>
                  Best Selling Products
                </h3>

              </div>


            </div>


            <div className="best-product-list">


              {bestProducts.length > 0 ? (

                bestProducts.map(
                  (product, index) => (

                    <div
                      className="best-product-row"
                      key={
                        product.name
                      }
                    >


                      <div className="product-rank">

                        {index + 1}

                      </div>


                      <div className="best-product-info">


                        <strong>

                          {product.name}

                        </strong>


                        <span>

                          {product.brand}

                        </span>


                      </div>


                      <div className="best-product-sales">


                        <strong>

                          {product.sold}

                        </strong>


                        <span>

                          sold

                        </span>


                      </div>


                    </div>

                  )
                )

              ) : (

                <div className="no-report-data">

                  No product sales data available.

                </div>

              )}


            </div>


          </div>


          {/* =================================================
              BRAND SALES
          ================================================= */}

          <div className="brand-sales-card">


            <div className="report-card-heading">


              <div className="report-card-heading-icon">

                <FaTags />

              </div>


              <div>

                <span>

                  BRAND PERFORMANCE

                </span>


                <h3>

                  Brand-wise Sales

                </h3>

              </div>


            </div>


            <div className="brand-sales-list">


              {brandSales.length > 0 ? (

                brandSales.map(
                  (brand) => (

                    <div
                      className="brand-sales-row"
                      key={
                        brand.brand
                      }
                    >


                      <div className="brand-sales-info">


                        <strong>

                          {brand.brand}

                        </strong>


                        <span>

                          {brand.orders}
                          {" "}
                          Orders

                        </span>


                      </div>


                      <strong className="brand-sales-value">

                        ₹
                        {formatAmount(
                          brand.value
                        )}

                      </strong>


                    </div>

                  )
                )

              ) : (

                <div className="no-report-data">

                  No brand sales data available.

                </div>

              )}


            </div>


          </div>


        </section>


        {/* ===================================================
            REPORT SUMMARY
        =================================================== */}

        <section className="report-summary">


          <div className="summary-icon">

            <FaBoxes />

          </div>


          <div>


            <span>

              REPORT SUMMARY

            </span>


            <h3>

              RK Choco Distributors

            </h3>


            <p>

              This report provides an overview of
              orders, sales, products and brand
              performance.

            </p>


          </div>


        </section>


      </main>


    </div>

  );

}


export default Reports;