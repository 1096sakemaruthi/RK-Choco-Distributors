import React, { useEffect, useState } from "react";

import {
  FaUserCircle,
  FaIdCard,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCalendarAlt,
  FaSignOutAlt,
  FaBoxOpen,
  FaClock,
  FaTruck,
  FaTimesCircle,
  FaEye,
  FaShoppingBag,
  FaSpinner,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/Profile.css";


function Profile() {

  const navigate = useNavigate();


  // =========================================================
  // GET LOGGED-IN CUSTOMER
  // =========================================================

  const getLoggedInCustomer = () => {

    try {

      const savedCustomer =
        localStorage.getItem("loggedInUser");

      if (!savedCustomer) {
        return null;
      }

      return JSON.parse(savedCustomer);

    } catch (error) {

      console.error(
        "Invalid loggedInUser data:",
        error
      );

      return null;

    }

  };


  const [customer, setCustomer] =
    useState(getLoggedInCustomer());


  // =========================================================
  // EDIT PROFILE STATES
  // =========================================================

  const [isEditing, setIsEditing] =
    useState(false);

  const [editForm, setEditForm] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    address: "",
  });

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [profileMessage, setProfileMessage] =
    useState("");

  const [profileError, setProfileError] =
    useState("");


  // =========================================================
  // ORDER STATES
  // =========================================================

  const [orders, setOrders] =
    useState([]);

  const [selectedFilter, setSelectedFilter] =
    useState("All");

  const [ordersLoading, setOrdersLoading] =
    useState(true);


  // =========================================================
  // CHECK LOGIN
  // =========================================================

  useEffect(() => {

    if (!customer) {

      navigate("/login");

    }

  }, [customer, navigate]);


  // =========================================================
  // SET EDIT FORM
  // =========================================================

  useEffect(() => {

    if (!customer) {
      return;
    }

    setEditForm({
      fullName: customer.fullName || "",
      mobileNumber: customer.mobileNumber || "",
      email: customer.email || "",
      address: customer.address || "",
    });

  }, [customer]);


  // =========================================================
  // LOAD CUSTOMER ORDERS
  // =========================================================

  useEffect(() => {

    if (
      !customer ||
      !customer.mobileNumber
    ) {

      setOrders([]);
      setOrdersLoading(false);

      return;

    }


    const loadCustomerOrders =
      async () => {

        try {

          setOrdersLoading(true);

          const response =
            await axios.get(
              `https://cdms-backend-80mn.onrender.com/api/orders/customer/${customer.mobileNumber}`
            );


          if (
            Array.isArray(response.data)
          ) {

            setOrders(response.data);

          } else {

            setOrders([]);

          }

        } catch (error) {

          console.error(
            "Unable to load customer orders:",
            error
          );

          setOrders([]);

        } finally {

          setOrdersLoading(false);

        }

      };


    loadCustomerOrders();

  }, [customer]);


  // =========================================================
  // EDIT PROFILE
  // =========================================================

  const handleEditProfile = () => {

    setProfileMessage("");
    setProfileError("");

    setEditForm({
      fullName: customer.fullName || "",
      mobileNumber:
        customer.mobileNumber || "",
      email: customer.email || "",
      address: customer.address || "",
    });

    setIsEditing(true);

  };


  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancelEdit = () => {

    setIsEditing(false);

    setProfileMessage("");
    setProfileError("");

    setEditForm({
      fullName: customer.fullName || "",
      mobileNumber:
        customer.mobileNumber || "",
      email: customer.email || "",
      address: customer.address || "",
    });

  };


  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleEditChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSaveProfile = async (
    event
  ) => {

    event.preventDefault();


    setProfileMessage("");
    setProfileError("");


    // -------------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------------

    if (
      !editForm.fullName.trim()
    ) {

      setProfileError(
        "Full name is required."
      );

      return;

    }


    if (
      !editForm.mobileNumber.trim()
    ) {

      setProfileError(
        "Mobile number is required."
      );

      return;

    }


    if (
      !editForm.email.trim()
    ) {

      setProfileError(
        "Email address is required."
      );

      return;

    }


    if (
      !editForm.address.trim()
    ) {

      setProfileError(
        "Address is required."
      );

      return;

    }


    try {

      setSavingProfile(true);


      // =====================================================
      // UPDATE CUSTOMER IN BACKEND
      // =====================================================

      const response =
        await axios.put(
          `https://cdms-backend-80mn.onrender.com/api/customers/${customer.customerId}`,
          {
            ...customer,
            fullName:
              editForm.fullName.trim(),
            mobileNumber:
              editForm.mobileNumber.trim(),
            email:
              editForm.email.trim(),
            address:
              editForm.address.trim(),
          }
        );


      // =====================================================
      // USE BACKEND RESPONSE IF AVAILABLE
      // =====================================================

      const updatedCustomer =
        response.data &&
        typeof response.data === "object"
          ? {
              ...customer,
              ...response.data,
            }
          : {
              ...customer,
              ...editForm,
            };


      // =====================================================
      // UPDATE STATE
      // =====================================================

      setCustomer(updatedCustomer);


      // =====================================================
      // UPDATE LOCAL STORAGE
      // =====================================================

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(
          updatedCustomer
        )
      );


      // =====================================================
      // SUCCESS
      // =====================================================

      setIsEditing(false);

      setProfileMessage(
        "Profile updated successfully."
      );


      // Remove message after 3 seconds
      setTimeout(() => {

        setProfileMessage("");

      }, 3000);


    } catch (error) {

      console.error(
        "Profile update failed:",
        error
      );


      setProfileError(
        error?.response?.data?.message ||
        "Unable to update profile. Please try again."
      );

    } finally {

      setSavingProfile(false);

    }

  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "loggedInUser"
    );

    localStorage.removeItem(
      "registeredUser"
    );

    navigate("/");

  };


  // =========================================================
  // ORDER STATUS NORMALIZER
  // =========================================================

  const getOrderStatus = (order) => {

    const status =
      order?.status ||
      order?.orderStatus ||
      "Pending";


    return status
      .toString()
      .trim()
      .toLowerCase();

  };


  // =========================================================
  // STATUS LABEL
  // =========================================================

  const getStatusLabel = (order) => {

    const status =
      getOrderStatus(order);


    if (
      status === "delivered" ||
      status === "complete" ||
      status === "completed"
    ) {

      return "Delivered";

    }


    if (
      status === "cancelled" ||
      status === "canceled"
    ) {

      return "Cancelled";

    }


    if (
      status === "shipped" ||
      status === "out for delivery"
    ) {

      return "Shipped";

    }


    if (
      status === "processing" ||
      status === "confirmed"
    ) {

      return "Processing";

    }


    return "Pending";

  };


  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (order) => {

    const label =
      getStatusLabel(order);


    if (label === "Delivered") {
      return "delivered";
    }

    if (label === "Cancelled") {
      return "cancelled";
    }

    if (label === "Shipped") {
      return "shipped";
    }

    if (label === "Processing") {
      return "processing";
    }

    return "pending";

  };


  // =========================================================
  // ORDER DATE
  // =========================================================

  const getOrderDate = (order) => {

    const date =
      order?.orderDate ||
      order?.createdAt ||
      order?.createdDate ||
      order?.date;


    if (!date) {

      return "Date not available";

    }


    try {

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

    } catch {

      return String(date);

    }

  };


  // =========================================================
  // ORDER ID
  // =========================================================

  const getOrderId = (order) => {

    return (
      order?.orderId ||
      order?.id ||
      order?.orderNumber ||
      "Order"
    );

  };


  // =========================================================
  // ORDER TOTAL
  // =========================================================

  const getOrderTotal = (order) => {

    const total =
      order?.totalAmount ??
      order?.total ??
      order?.grandTotal ??
      order?.amount ??
      0;


    const numericTotal =
      Number(total);


    if (
      Number.isNaN(numericTotal)
    ) {

      return String(total);

    }


    return `₹${numericTotal.toLocaleString(
      "en-IN"
    )}`;

  };


  // =========================================================
  // PRODUCT COUNT
  // =========================================================

  const getProductCount = (order) => {

    if (
      Array.isArray(
        order?.items
      )
    ) {

      return order.items.length;

    }


    if (
      Array.isArray(
        order?.orderItems
      )
    ) {

      return order.orderItems.length;

    }


    if (
      Array.isArray(
        order?.products
      )
    ) {

      return order.products.length;

    }


    return (
      order?.totalItems ||
      order?.quantity ||
      0
    );

  };


  // =========================================================
  // FILTER ORDERS
  // =========================================================

  const filteredOrders =
    selectedFilter === "All"
      ? orders
      : orders.filter(
          (order) =>
            getStatusLabel(order) ===
            selectedFilter
        );


  // =========================================================
  // ORDER COUNTS
  // =========================================================

  const totalOrders =
    orders.length;


  const pendingOrders =
    orders.filter(
      (order) =>
        getStatusLabel(order) ===
        "Pending"
    ).length;


  const processingOrders =
    orders.filter(
      (order) =>
        getStatusLabel(order) ===
        "Processing"
    ).length;


  const shippedOrders =
    orders.filter(
      (order) =>
        getStatusLabel(order) ===
        "Shipped"
    ).length;


  const deliveredOrders =
    orders.filter(
      (order) =>
        getStatusLabel(order) ===
        "Delivered"
    ).length;


  const cancelledOrders =
    orders.filter(
      (order) =>
        getStatusLabel(order) ===
        "Cancelled"
    ).length;


  // =========================================================
  // VIEW ORDER DETAILS
  // =========================================================

  const handleViewOrder = (order) => {

    const orderId =
      order?.orderId ||
      order?.id ||
      order?.orderNumber;


    if (!orderId) {

      navigate("/orders");

      return;

    }


    navigate(
      `/orders/${orderId}`
    );

  };


  // =========================================================
  // CUSTOMER NOT AVAILABLE
  // =========================================================

  if (!customer) {

    return null;

  }


  // =========================================================
  // UI
  // =========================================================

  return (

    <main className="customer-profile-page">


      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}

      <section className="customer-profile-header">


        <div className="customer-profile-header-left">

          <div className="customer-profile-icon">

            <FaUserCircle />

          </div>


          <div>

            <h1>
              My Profile
            </h1>

            <p>
              Welcome back,{" "}
              {customer.fullName ||
                "Customer"}
            </p>

          </div>

        </div>


        {/* ===================================================
            EDIT PROFILE BUTTON
        =================================================== */}

        {!isEditing && (

          <button
            type="button"
            className="profile-edit-top-btn"
            onClick={
              handleEditProfile
            }
          >

            <FaEdit />

            <span>
              Edit Profile
            </span>

          </button>

        )}

      </section>



      {/* =====================================================
          PROFILE CARD
      ===================================================== */}

      <section className="customer-profile-card">


        {/* ===================================================
            PERSONAL DETAILS
        =================================================== */}

        <div className="profile-section-title">

          <FaUser />

          <h2>
            Personal Details
          </h2>

        </div>


        <div className="profile-details-grid">


          {/* CUSTOMER ID */}

          <div className="profile-detail">

            <div className="profile-detail-icon">
              <FaIdCard />
            </div>

            <div>

              <span>
                Customer ID
              </span>

              <strong>
                {customer.customerId ||
                  "Not Available"}
              </strong>

            </div>

          </div>


          {/* FULL NAME */}

          <div className="profile-detail">

            <div className="profile-detail-icon">
              <FaUser />
            </div>

            <div>

              <span>
                Full Name
              </span>

              <strong>
                {customer.fullName ||
                  "Not Available"}
              </strong>

            </div>

          </div>


          {/* MOBILE */}

          <div className="profile-detail">

            <div className="profile-detail-icon">
              <FaPhone />
            </div>

            <div>

              <span>
                Mobile Number
              </span>

              <strong>
                {customer.mobileNumber ||
                  "Not Available"}
              </strong>

            </div>

          </div>


          {/* EMAIL */}

          <div className="profile-detail">

            <div className="profile-detail-icon">
              <FaEnvelope />
            </div>

            <div>

              <span>
                Email Address
              </span>

              <strong>
                {customer.email ||
                  "Not Available"}
              </strong>

            </div>

          </div>


          {/* ADDRESS */}

          <div className="profile-detail profile-address">

            <div className="profile-detail-icon">
              <FaMapMarkerAlt />
            </div>

            <div>

              <span>
                Address
              </span>

              <strong>
                {customer.address ||
                  "Not Available"}
              </strong>

            </div>

          </div>


          {/* STATUS */}

          <div className="profile-detail">

            <div className="profile-detail-icon">
              <FaCheckCircle />
            </div>

            <div>

              <span>
                Account Status
              </span>

              <strong className="profile-active">
                {customer.status ||
                  "Active"}
              </strong>

            </div>

          </div>


          {/* REGISTERED DATE */}

          <div className="profile-detail">

            <div className="profile-detail-icon">
              <FaCalendarAlt />
            </div>

            <div>

              <span>
                Registered At
              </span>

              <strong>
                {customer.registeredAt ||
                  "Not Available"}
              </strong>

            </div>

          </div>

        </div>



        {/* ===================================================
            EDIT PROFILE SECTION
        =================================================== */}

        {isEditing && (

          <div className="profile-edit-section">


            <div className="profile-section-title">

              <FaEdit />

              <h2>
                Edit Profile
              </h2>

            </div>


            <form
              onSubmit={
                handleSaveProfile
              }
            >


              <div className="profile-edit-grid">


                {/* FULL NAME */}

                <div className="profile-edit-field">

                  <label>
                    Full Name
                  </label>

                  <div className="profile-edit-input-wrapper">

                    <FaUser />

                    <input
                      type="text"
                      name="fullName"
                      value={
                        editForm.fullName
                      }
                      onChange={
                        handleEditChange
                      }
                      placeholder="Enter full name"
                    />

                  </div>

                </div>


                {/* MOBILE */}

                <div className="profile-edit-field">

                  <label>
                    Mobile Number
                  </label>

                  <div className="profile-edit-input-wrapper">

                    <FaPhone />

                    <input
                      type="tel"
                      name="mobileNumber"
                      value={
                        editForm.mobileNumber
                      }
                      onChange={
                        handleEditChange
                      }
                      placeholder="Enter mobile number"
                    />

                  </div>

                </div>


                {/* EMAIL */}

                <div className="profile-edit-field">

                  <label>
                    Email Address
                  </label>

                  <div className="profile-edit-input-wrapper">

                    <FaEnvelope />

                    <input
                      type="email"
                      name="email"
                      value={
                        editForm.email
                      }
                      onChange={
                        handleEditChange
                      }
                      placeholder="Enter email address"
                    />

                  </div>

                </div>


                {/* ADDRESS */}

                <div className="profile-edit-field full-width">

                  <label>
                    Address
                  </label>

                  <div className="profile-edit-input-wrapper">

                    <FaMapMarkerAlt />

                    <textarea
                      name="address"
                      value={
                        editForm.address
                      }
                      onChange={
                        handleEditChange
                      }
                      placeholder="Enter address"
                    />

                  </div>

                </div>


              </div>


              {/* =================================================
                  EDIT ACTIONS
              ================================================= */}

              <div className="profile-edit-actions">


                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={
                    handleCancelEdit
                  }
                  disabled={
                    savingProfile
                  }
                >

                  <FaTimes />

                  <span>
                    Cancel
                  </span>

                </button>


                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={
                    savingProfile
                  }
                >

                  {savingProfile ? (

                    <>

                      <span className="profile-button-spinner"></span>

                      <span>
                        Saving...
                      </span>

                    </>

                  ) : (

                    <>

                      <FaSave />

                      <span>
                        Save Changes
                      </span>

                    </>

                  )}

                </button>


              </div>


            </form>


          </div>

        )}



        {/* ===================================================
            SUCCESS MESSAGE
        =================================================== */}

        {profileMessage && (

          <div className="profile-success-message">

            <FaCheckCircle />

            <span>
              {profileMessage}
            </span>

          </div>

        )}



        {/* ===================================================
            ERROR MESSAGE
        =================================================== */}

        {profileError && (

          <div className="profile-error-message">

            <FaTimesCircle />

            <span>
              {profileError}
            </span>

          </div>

        )}



        {/* ===================================================
            ORDER OVERVIEW
        =================================================== */}

        <div className="profile-orders-overview">


          <div className="profile-section-title">

            <FaShoppingBag />

            <h2>
              Order Overview
            </h2>

          </div>


          <div className="profile-order-stats">


            {/* TOTAL */}

            <div className="profile-order-stat">

              <div className="profile-order-stat-icon total">

                <FaBoxOpen />

              </div>

              <strong>
                {totalOrders}
              </strong>

              <span>
                Total Orders
              </span>

            </div>


            {/* PENDING */}

            <div className="profile-order-stat">

              <div className="profile-order-stat-icon pending">

                <FaClock />

              </div>

              <strong>
                {pendingOrders}
              </strong>

              <span>
                Pending
              </span>

            </div>


            {/* PROCESSING */}

            <div className="profile-order-stat">

              <div className="profile-order-stat-icon processing">

                <FaSpinner />

              </div>

              <strong>
                {processingOrders}
              </strong>

              <span>
                Processing
              </span>

            </div>


            {/* SHIPPED */}

            <div className="profile-order-stat">

              <div className="profile-order-stat-icon shipped">

                <FaTruck />

              </div>

              <strong>
                {shippedOrders}
              </strong>

              <span>
                Shipped
              </span>

            </div>


            {/* DELIVERED */}

            <div className="profile-order-stat">

              <div className="profile-order-stat-icon delivered">

                <FaCheckCircle />

              </div>

              <strong>
                {deliveredOrders}
              </strong>

              <span>
                Delivered
              </span>

            </div>


            {/* CANCELLED */}

            <div className="profile-order-stat">

              <div className="profile-order-stat-icon cancelled">

                <FaTimesCircle />

              </div>

              <strong>
                {cancelledOrders}
              </strong>

              <span>
                Cancelled
              </span>

            </div>


          </div>

        </div>



        {/* ===================================================
            MY ORDERS
        =================================================== */}

        <div className="profile-my-orders">


          <div className="profile-section-title">

            <FaBoxOpen />

            <h2>
              My Orders
            </h2>

          </div>


          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="profile-order-filters">

            {[
              "All",
              "Pending",
              "Processing",
              "Shipped",
              "Delivered",
              "Cancelled",
            ].map((filter) => (

              <button
                key={filter}
                type="button"
                className={`profile-order-filter-btn ${
                  selectedFilter === filter
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedFilter(
                    filter
                  )
                }
              >

                {filter}

              </button>

            ))}

          </div>



          {/* =================================================
              LOADING
          ================================================= */}

          {ordersLoading && (

            <div className="profile-orders-loading">

              <div className="profile-loading-spinner"></div>

              <span>
                Loading your orders...
              </span>

            </div>

          )}



          {/* =================================================
              NO ORDERS
          ================================================= */}

          {!ordersLoading &&
            filteredOrders.length === 0 && (

              <div className="profile-empty-orders">


                <div className="profile-empty-orders-icon">

                  <FaShoppingBag />

                </div>


                <h3>
                  No Orders Found
                </h3>


                <p>

                  {selectedFilter === "All"
                    ? "You have not placed any orders yet."
                    : `You have no ${selectedFilter.toLowerCase()} orders.`}

                </p>


                {selectedFilter === "All" && (

                  <button
                    type="button"
                    className="profile-shopping-btn"
                    onClick={() =>
                      navigate(
                        "/products"
                      )
                    }
                  >

                    <FaShoppingBag />

                    Start Shopping

                  </button>

                )}

              </div>

            )}



          {/* =================================================
              ORDER LIST
          ================================================= */}

          {!ordersLoading &&
            filteredOrders.length > 0 && (

              <div className="profile-orders-list">

                {filteredOrders.map(
                  (
                    order,
                    index
                  ) => {

                    const status =
                      getStatusLabel(
                        order
                      );

                    const statusClass =
                      getStatusClass(
                        order
                      );


                    return (

                      <div
                        className="profile-order-card"
                        key={
                          order?.orderId ||
                          order?.id ||
                          index
                        }
                      >


                        {/* LEFT */}

                        <div className="profile-order-left">


                          <div className="profile-order-icon">

                            <FaBoxOpen />

                          </div>


                          <div className="profile-order-info">

                            <h3>
                              #
                              {getOrderId(
                                order
                              )}
                            </h3>


                            <p>
                              Ordered on{" "}
                              {getOrderDate(
                                order
                              )}
                            </p>


                            <p>

                              <FaShoppingBag />

                              {" "}

                              {getProductCount(
                                order
                              )}

                              {" "}

                              {getProductCount(
                                order
                              ) === 1
                                ? "Product"
                                : "Products"}

                            </p>

                          </div>

                        </div>



                        {/* RIGHT */}

                        <div className="profile-order-right">


                          <div
                            className={`profile-order-status ${statusClass}`}
                          >

                            {status ===
                              "Delivered" && (
                              <FaCheckCircle />
                            )}

                            {status ===
                              "Cancelled" && (
                              <FaTimesCircle />
                            )}

                            {status ===
                              "Shipped" && (
                              <FaTruck />
                            )}

                            {status ===
                              "Processing" && (
                              <FaSpinner />
                            )}

                            {status ===
                              "Pending" && (
                              <FaClock />
                            )}

                            <span>
                              {status}
                            </span>

                          </div>


                          <div className="profile-order-price">

                            {getOrderTotal(
                              order
                            )}

                          </div>


                          <button
                            type="button"
                            className="profile-view-order-btn"
                            onClick={() =>
                              handleViewOrder(
                                order
                              )
                            }
                          >

                            <FaEye />

                            <span>
                              View Details
                            </span>

                          </button>


                        </div>


                      </div>

                    );

                  }
                )}

              </div>

            )}

        </div>



        {/* ===================================================
            LOGOUT
        =================================================== */}

        <div className="profile-logout-area">

          <button
            type="button"
            className="profile-logout-btn"
            onClick={
              handleLogout
            }
          >

            <FaSignOutAlt />

            <span>
              Logout
            </span>

          </button>

        </div>


      </section>

    </main>

  );

}


export default Profile;