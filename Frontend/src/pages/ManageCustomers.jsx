import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaUsers,
  FaSearch,
  FaArrowLeft,
  FaUserCheck,
  FaStore,
  FaUserTimes,
  FaPhone,
  FaEnvelope,
  FaBan,
  FaTrash,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "../styles/managecustomers.css";

import api from "../services/api";


function ManageCustomers() {

  // =========================================================
  // STATE
  // =========================================================

  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);


  // =========================================================
  // LOAD CUSTOMERS FROM SPRING BOOT / MYSQL
  // =========================================================

  useEffect(() => {

    loadCustomers();

  }, []);


  const loadCustomers = () => {

    setLoading(true);

    api
      .get("/customers")
      .then((response) => {

        if (Array.isArray(response.data)) {

          setCustomers(response.data);

        } else {

          setCustomers([]);

        }

      })
      .catch((error) => {

        console.error(
          "Error loading customers:",
          error
        );

        setCustomers([]);

      })
      .finally(() => {

        setLoading(false);

      });

  };


  // =========================================================
  // CUSTOMER STATUS
  // =========================================================

  const getCustomerStatus = (customer) => {

    if (
      customer.status === "inactive" ||
      customer.status === "Inactive"
    ) {

      return "inactive";

    }

    return "active";

  };


  // =========================================================
  // CUSTOMER SHOP NAME
  // =========================================================

  const getShopName = (customer) => {

    return (
      customer.shopName ||
      customer.shop ||
      customer.shop_name ||
      "Shop Not Provided"
    );

  };


  // =========================================================
  // CUSTOMER PHONE
  // =========================================================

  const getPhone = (customer) => {

    return (
      customer.mobileNumber ||
      customer.phone ||
      customer.mobile ||
      customer.phoneNumber ||
      "Not Provided"
    );

  };


  // =========================================================
  // CUSTOMER NAME
  // =========================================================

  const getCustomerName = (customer) => {

    return (
      customer.fullName ||
      customer.name ||
      customer.customerName ||
      "Customer"
    );

  };


  // =========================================================
  // CUSTOMER EMAIL
  // =========================================================

  const getEmail = (customer) => {

    return customer.email || "Not Provided";

  };


  // =========================================================
  // MAKE CUSTOMER INACTIVE / ACTIVE
  // =========================================================

  const handleToggleStatus = (customerId) => {

    const customer =
      customers.find(
        (item) =>
          item.customerId === customerId
      );


    if (!customer) {
      return;
    }


    const currentStatus =
      getCustomerStatus(customer);


    const newStatus =
      currentStatus === "active"
        ? "inactive"
        : "active";


    api
      .put(
        `/customers/${customerId}/status`,
        {
          status: newStatus,
        }
      )
      .then((response) => {

        setCustomers((previousCustomers) =>
          previousCustomers.map(
            (item) =>
              item.customerId === customerId
                ? response.data
                : item
          )
        );

      })
      .catch((error) => {

        console.error(
          "Error updating customer status:",
          error
        );

        alert(
          "Unable to update customer status."
        );

      });

  };


  // =========================================================
  // DELETE CUSTOMER
  // =========================================================

  const handleDeleteCustomer = (customerId) => {

    const customer =
      customers.find(
        (item) =>
          item.customerId === customerId
      );


    if (!customer) {
      return;
    }


    const customerName =
      getCustomerName(customer);


    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete ${customerName}?`
      );


    if (!confirmDelete) {
      return;
    }


    api
      .delete(
        `/customers/${customerId}`
      )
      .then(() => {

        setCustomers((previousCustomers) =>
          previousCustomers.filter(
            (item) =>
              item.customerId !== customerId
          )
        );

      })
      .catch((error) => {

        console.error(
          "Error deleting customer:",
          error
        );

        alert(
          "Unable to delete customer."
        );

      });

  };


  // =========================================================
  // FILTER CUSTOMERS
  // =========================================================

  const filteredCustomers = useMemo(() => {

    return customers.filter((customer) => {

      const searchText =
        search.toLowerCase().trim();


      const name =
        getCustomerName(customer)
          .toLowerCase();


      const shop =
        getShopName(customer)
          .toLowerCase();


      const phone =
        getPhone(customer)
          .toLowerCase();


      const email =
        getEmail(customer)
          .toLowerCase();


      const matchesSearch =
        name.includes(searchText) ||
        shop.includes(searchText) ||
        phone.includes(searchText) ||
        email.includes(searchText);


      const status =
        getCustomerStatus(customer);


      let matchesFilter = true;


      if (filter === "active") {

        matchesFilter =
          status === "active";

      }


      if (filter === "inactive") {

        matchesFilter =
          status === "inactive";

      }


      return (
        matchesSearch &&
        matchesFilter
      );

    });

  }, [customers, search, filter]);


  // =========================================================
  // STATISTICS
  // =========================================================

  const totalCustomers =
    customers.length;


  const activeCustomers =
    customers.filter(
      (customer) =>
        getCustomerStatus(customer) === "active"
    ).length;


  const inactiveCustomers =
    customers.filter(
      (customer) =>
        getCustomerStatus(customer) === "inactive"
    ).length;


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="manage-customers-page">


      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="customers-header">

        <div className="customers-header-left">


          {/* DASHBOARD BACK LINK */}

          <Link
            to="/admin-dashboard"
            className="back-dashboard"
          >

            <FaArrowLeft />

            <span>
              Dashboard
            </span>

          </Link>


          {/* TITLE */}

          <div className="customers-title-area">

            <div className="customers-title-icon">

              <FaUsers />

            </div>


            <div>

              <span className="section-label">
                ADMINISTRATION
              </span>


              <h1>
                Manage Customers
              </h1>


              <p>
                View and manage your registered
                shop customers.
              </p>

            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="customers-main">


        {/* ===================================================
            STATISTICS
        =================================================== */}

        <section className="customer-stats">


          {/* TOTAL CUSTOMERS */}

          <div className="customer-stat-card">

            <div className="stat-icon customers">

              <FaUsers />

            </div>


            <div>

              <span>
                Total Customers
              </span>

              <strong>
                {totalCustomers}
              </strong>

            </div>

          </div>


          {/* ACTIVE CUSTOMERS */}

          <div className="customer-stat-card">

            <div className="stat-icon active">

              <FaUserCheck />

            </div>


            <div>

              <span>
                Active Customers
              </span>

              <strong>
                {activeCustomers}
              </strong>

            </div>

          </div>


          {/* INACTIVE */}

          <div className="customer-stat-card">

            <div className="stat-icon inactive">

              <FaUserTimes />

            </div>


            <div>

              <span>
                Inactive
              </span>

              <strong>
                {inactiveCustomers}
              </strong>

            </div>

          </div>


        </section>


        {/* ===================================================
            CUSTOMER DATABASE
        =================================================== */}

        <section className="customers-list-section">


          <div className="list-heading">


            <div>

              <span className="section-label">
                CUSTOMER DATABASE
              </span>


              <h2>
                Your Customers
              </h2>


              <p>
                View all registered shop customers
                from one place.
              </p>

            </div>


            <div className="customer-count">

              {filteredCustomers.length}
              {" "}
              Customers

            </div>


          </div>


          {/* =================================================
              SEARCH + FILTER
          ================================================= */}

          <div className="customers-toolbar">


            <div className="search-box">

              <FaSearch />


              <input
                type="text"
                placeholder="Search customer, phone..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            <div className="filter-buttons">


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
                  filter === "active"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("active")
                }
              >

                Active

              </button>


              <button
                type="button"
                className={
                  filter === "inactive"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("inactive")
                }
              >

                Inactive

              </button>


            </div>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (

            <div className="empty-customers">

              <div className="empty-icon">

                <FaUsers />

              </div>

              <h3>
                Loading Customers...
              </h3>

              <p>
                Please wait while customer data is loaded.
              </p>

            </div>

          )}


          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!loading &&
            filteredCustomers.length === 0 && (

              <div className="empty-customers">


                <div className="empty-icon">

                  <FaUsers />

                </div>


                <h3>

                  {customers.length === 0
                    ? "No Customers Added Yet"
                    : "No Customers Found"}

                </h3>


                <p>

                  {customers.length === 0
                    ? "Registered shop customers will automatically appear here."
                    : "Try changing your search or filter."}

                </p>


              </div>

            )}


          {/* =================================================
              CUSTOMER GRID
          ================================================= */}

          {!loading &&
            filteredCustomers.length > 0 && (

              <div className="customer-grid">


                {filteredCustomers.map(
                  (customer, index) => {

                    const status =
                      getCustomerStatus(customer);


                    return (

                      <article
                        className="customer-card"
                        key={
                          customer.customerId ||
                          customer.email ||
                          index
                        }
                      >


                        {/* CUSTOMER CARD HEADER */}

                        <div className="customer-card-header">


                          <div className="customer-avatar">

                            <FaUsers />

                          </div>


                          <span
                            className={`customer-status ${status}`}
                          >

                            {status === "active"
                              ? "Active"
                              : "Inactive"}

                          </span>


                        </div>


                        {/* CUSTOMER DETAILS */}

                        <div className="customer-details">


                          <span className="customer-label">
                            CUSTOMER
                          </span>


                          <h3>
                            {getCustomerName(
                              customer
                            )}
                          </h3>


                          {/* PHONE */}

                          <div className="customer-detail-row">

                            <FaPhone />

                            <span>
                              {getPhone(
                                customer
                              )}
                            </span>

                          </div>


                          {/* EMAIL */}

                          {customer.email && (

                            <div className="customer-detail-row">

                              <FaEnvelope />

                              <span>
                                {customer.email}
                              </span>

                            </div>

                          )}


                        </div>


                        {/* CUSTOMER ACTION BUTTONS */}

                        <div className="customer-actions">


                          {/* MAKE INACTIVE / ACTIVE */}

                          <button
                            type="button"
                            className={
                              status === "active"
                                ? "customer-action-btn inactive-btn"
                                : "customer-action-btn active-btn"
                            }
                            onClick={() =>
                              handleToggleStatus(
                                customer.customerId
                              )
                            }
                          >

                            {status === "active" ? (
                              <>
                                <FaBan />

                                <span>
                                  Make Inactive
                                </span>
                              </>
                            ) : (
                              <>
                                <FaUserCheck />

                                <span>
                                  Make Active
                                </span>
                              </>
                            )}

                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            className="customer-action-btn delete-btn"
                            onClick={() =>
                              handleDeleteCustomer(
                                customer.customerId
                              )
                            }
                          >

                            <FaTrash />

                            <span>
                              Delete
                            </span>

                          </button>


                        </div>


                      </article>

                    );

                  }

                )}

              </div>

            )}


        </section>


      </main>


    </div>

  );

}


export default ManageCustomers;