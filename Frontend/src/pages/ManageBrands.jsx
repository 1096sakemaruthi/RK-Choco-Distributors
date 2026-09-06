import React, { useEffect, useMemo, useState } from "react";

import {
  FaTags,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaImage,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "../styles/managebrands.css";

const API_URL = "http://localhost:8080/api/brands";

function ManageBrands() {

  const emptyBrand = {
    id: null,
    name: "",
    description: "",
    image: "",
  };

  const [brands, setBrands] = useState([]);

  const [form, setForm] = useState(emptyBrand);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);


  // =========================================================
  // LOAD BRANDS FROM DATABASE
  // =========================================================

  const loadBrands = async () => {

    try {

      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load brands");
      }

      const data = await response.json();

      setBrands(data);

    } catch (err) {

      console.error(err);

      showError(
        "Unable to load brands. Please check the backend."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadBrands();

  }, []);


  // =========================================================
  // SUCCESS MESSAGE
  // =========================================================

  const showMessage = (text) => {

    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);

  };


  // =========================================================
  // ERROR MESSAGE
  // =========================================================

  const showError = (text) => {

    setError(text);

    setTimeout(() => {
      setError("");
    }, 3000);

  };


  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // =========================================================
  // IMAGE CHANGE
  // =========================================================

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {

      showError(
        "Please select a valid image file."
      );

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {

      setForm((previous) => ({
        ...previous,
        image: reader.result,
      }));

    };

    reader.readAsDataURL(file);

  };


  // =========================================================
  // ADD BRAND BUTTON
  // =========================================================

  const handleAddBrand = () => {

    setEditingId(null);

    setForm({
      ...emptyBrand,
    });

    setShowForm(true);

    setError("");

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // =========================================================
  // EDIT BRAND
  // =========================================================

  const handleEdit = (brand) => {

    setEditingId(brand.id);

    setForm({
      id: brand.id,
      name: brand.name || "",
      description: brand.description || "",
      image: brand.image || "",
    });

    setShowForm(true);

    setError("");

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // =========================================================
  // CANCEL
  // =========================================================

  const handleCancel = () => {

    setForm({
      ...emptyBrand,
    });

    setEditingId(null);

    setShowForm(false);

    setError("");

  };


  // =========================================================
  // SAVE / UPDATE BRAND
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setMessage("");


    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    if (!form.name.trim()) {

      showError(
        "Please enter the brand name."
      );

      return;
    }


    if (!form.description.trim()) {

      showError(
        "Please enter the brand description."
      );

      return;
    }


    // =========================================================
    // UPDATE EXISTING BRAND
    // =========================================================

    if (editingId !== null) {

      try {

        const response = await fetch(
          `${API_URL}/${editingId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              name: form.name.trim(),
              description: form.description.trim(),
              image: form.image,
            }),
          }
        );


        if (!response.ok) {

          throw new Error(
            "Failed to update brand"
          );

        }


        const updatedBrand =
          await response.json();


        setBrands((previous) =>
          previous.map((brand) =>
            brand.id === editingId
              ? updatedBrand
              : brand
          )
        );


        showMessage(
          "Brand updated successfully."
        );


        handleCancel();


      } catch (err) {

        console.error(err);

        showError(
          "Unable to update brand."
        );

      }

      return;
    }


    // =========================================================
    // ADD NEW BRAND
    // =========================================================

    try {

      const response = await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim(),
            image: form.image,
          }),
        }
      );


      if (!response.ok) {

        throw new Error(
          "Failed to add brand"
        );

      }


      const newBrand =
        await response.json();


      setBrands((previous) => [
        ...previous,
        newBrand,
      ]);


      showMessage(
        "Brand added successfully."
      );


      handleCancel();


    } catch (err) {

      console.error(err);

      showError(
        "Unable to add brand."
      );

    }

  };


  // =========================================================
  // DELETE BRAND
  // =========================================================

  const handleDelete = async (id) => {

    const brand = brands.find(
      (item) => item.id === id
    );


    if (!brand) {
      return;
    }


    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete "${brand.name}"?`
      );


    if (!confirmDelete) {
      return;
    }


    try {

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );


      if (!response.ok) {

        throw new Error(
          "Failed to delete brand"
        );

      }


      setBrands((previous) =>
        previous.filter(
          (item) => item.id !== id
        )
      );


      showMessage(
        "Brand deleted successfully."
      );


    } catch (err) {

      console.error(err);

      showError(
        "Unable to delete brand."
      );

    }

  };


  // =========================================================
  // SEARCH
  // =========================================================

  const filteredBrands = useMemo(() => {

    const searchText =
      search.toLowerCase().trim();


    return brands.filter((brand) => {

      return (
        (brand.name || "")
          .toLowerCase()
          .includes(searchText)
        ||
        (brand.description || "")
          .toLowerCase()
          .includes(searchText)
      );

    });

  }, [brands, search]);


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="manage-brands-page">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="brands-header">

        <div className="brands-header-left">

          <Link
            to="/admin-dashboard"
            className="back-dashboard"
          >
            <FaArrowLeft />

            <span>
              Dashboard
            </span>
          </Link>


          <div className="brands-title-area">

            <div className="brands-title-icon">
              <FaTags />
            </div>


            <div>

              <span className="section-label">
                ADMINISTRATION
              </span>


              <h1>
                Manage Brands
              </h1>


              <p>
                Add, edit, delete and manage your
                chocolate brands.
              </p>

            </div>

          </div>

        </div>


        <button
          className="add-brand-btn"
          onClick={handleAddBrand}
        >

          <FaPlus />

          Add New Brand

        </button>

      </header>


      {/* =====================================================
          MESSAGES
      ===================================================== */}

      {message && (

        <div className="brand-message success">

          <FaCheckCircle />

          <span>
            {message}
          </span>

        </div>

      )}


      {error && (

        <div className="brand-message error">

          <FaExclamationTriangle />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="brands-main">


        {/* ===================================================
            STATISTICS
        =================================================== */}

        <section className="brand-stats">


          <div className="brand-stat-card">

            <div className="brand-stat-icon brands">
              <FaTags />
            </div>


            <div>

              <span>
                Total Brands
              </span>

              <strong>
                {brands.length}
              </strong>

            </div>

          </div>


          <div className="brand-stat-card">

            <div className="brand-stat-icon active">
              <FaCheckCircle />
            </div>


            <div>

              <span>
                Active Brands
              </span>

              <strong>
                {brands.length}
              </strong>

            </div>

          </div>


        </section>


        {/* ===================================================
            ADD / EDIT FORM
        =================================================== */}

        {showForm && (

          <section className="brand-form-section">


            <div className="form-heading">

              <div>

                <span className="section-label">
                  BRAND MANAGEMENT
                </span>


                <h2>

                  {editingId !== null
                    ? "Edit Brand"
                    : "Add New Brand"}

                </h2>


                <p>
                  Enter the brand details below.
                </p>

              </div>


              <button
                className="close-form-btn"
                onClick={handleCancel}
                type="button"
              >
                <FaTimes />
              </button>

            </div>


            <form
              className="brand-form"
              onSubmit={handleSubmit}
            >


              {/* BRAND NAME */}

              <div className="form-group">

                <label>

                  Brand Name

                  <span>
                    *
                  </span>

                </label>


                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                />

              </div>


              {/* DESCRIPTION */}

              <div className="form-group">

                <label>

                  Description

                  <span>
                    *
                  </span>

                </label>


                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter brand description"
                  rows="5"
                />

              </div>


              {/* IMAGE */}

              <div className="form-group image-form-group">

                <label>
                  Brand Logo
                </label>


                <label
                  className="image-upload"
                  htmlFor="brand-image"
                >

                  <FaImage />


                  <span>

                    {form.image
                      ? "Change Brand Logo"
                      : "Choose Brand Logo"}

                  </span>


                  <small>
                    JPG, PNG or WEBP
                  </small>

                </label>


                <input
                  id="brand-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />

              </div>


              {/* IMAGE PREVIEW */}

              {form.image && (

                <div className="form-image-preview">

                  <img
                    src={form.image}
                    alt="Brand preview"
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setForm((previous) => ({
                        ...previous,
                        image: "",
                      }))
                    }
                  >

                    <FaTimes />

                  </button>

                </div>

              )}


              {/* ACTIONS */}

              <div className="form-actions">


                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >

                  <FaTimes />

                  Cancel

                </button>


                <button
                  type="submit"
                  className="save-brand-btn"
                >

                  <FaSave />


                  {editingId !== null
                    ? "Update Brand"
                    : "Save Brand"}

                </button>


              </div>


            </form>


          </section>

        )}


        {/* ===================================================
            BRAND LIST
        =================================================== */}

        <section className="brands-list-section">


          <div className="list-heading">

            <div>

              <span className="section-label">
                BRAND INVENTORY
              </span>


              <h2>
                Your Brands
              </h2>


              <p>
                Manage all chocolate brands
                from one place.
              </p>

            </div>


            <div className="brand-count">

              {filteredBrands.length}
              {" "}
              Brands

            </div>

          </div>


          {/* SEARCH */}

          <div className="brands-toolbar">

            <div className="search-box">

              <FaSearch />


              <input
                type="text"
                placeholder="Search brand..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="empty-brands">

              <div className="empty-icon">
                <FaTags />
              </div>

              <h3>
                Loading Brands...
              </h3>

              <p>
                Please wait while brands are loaded.
              </p>

            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            filteredBrands.length === 0 && (

              <div className="empty-brands">

                <div className="empty-icon">
                  <FaTags />
                </div>


                <h3>

                  {brands.length === 0
                    ? "No Brands Added Yet"
                    : "No Brands Found"}

                </h3>


                <p>

                  {brands.length === 0
                    ? "Start adding your chocolate brands to manage your brand inventory."
                    : "Try changing your search."}

                </p>


                {brands.length === 0 && (

                  <button
                    className="empty-add-btn"
                    onClick={handleAddBrand}
                  >

                    <FaPlus />

                    Add Your First Brand

                  </button>

                )}

              </div>

            )}


          {/* BRAND GRID */}

          {!loading &&
            filteredBrands.length > 0 && (

              <div className="brand-grid">

                {filteredBrands.map((brand) => (

                  <article
                    className="brand-card"
                    key={brand.id}
                  >


                    {/* IMAGE */}

                    <div className="brand-image">

                      {brand.image ? (

                        <img
                          src={brand.image}
                          alt={brand.name}
                        />

                      ) : (

                        <div className="no-brand-image">

                          <FaTags />

                          <span>
                            No Logo
                          </span>

                        </div>

                      )}

                    </div>


                    {/* DETAILS */}

                    <div className="brand-details">

                      <h3>
                        {brand.name}
                      </h3>


                      <p>
                        {brand.description}
                      </p>


                      {/* ACTIONS */}

                      <div className="brand-actions">


                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(brand)
                          }
                        >

                          <FaEdit />

                          Edit

                        </button>


                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(brand.id)
                          }
                        >

                          <FaTrash />

                          Delete

                        </button>


                      </div>


                    </div>


                  </article>

                ))}

              </div>

            )}


        </section>


      </main>


    </div>

  );

}

export default ManageBrands;