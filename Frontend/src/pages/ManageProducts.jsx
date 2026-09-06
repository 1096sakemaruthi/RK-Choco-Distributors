import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  FaBoxOpen,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaImage,
  FaArrowLeft,
  FaBoxes,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "../styles/manageproducts.css";



// =========================================================
// BACKEND API URL
// =========================================================

const API_URL = "http://localhost:8080/api/products";



function ManageProducts() {

  // =========================================================
  // EMPTY PRODUCT
  // =========================================================

  const emptyProduct = {
    id: null,
    name: "",
    brand: "",
    price: "",
    stock: "",
    image: "",
  };



  // =========================================================
  // PRODUCTS
  // =========================================================

  const [products, setProducts] = useState([]);



  // =========================================================
  // FORM
  // =========================================================

  const [form, setForm] =
    useState(emptyProduct);



  // =========================================================
  // PAGE STATES
  // =========================================================

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);



  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");



  // =========================================================
  // MESSAGES
  // =========================================================

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");



  // =========================================================
  // LOADING
  // =========================================================

  const [loading, setLoading] =
    useState(true);



  // =========================================================
  // LOAD PRODUCTS FROM SPRING BOOT
  // =========================================================

  useEffect(() => {

    loadProducts();

  }, []);



  // =========================================================
  // GET PRODUCTS
  // =========================================================

  const loadProducts = async () => {

    try {

      setLoading(true);

      const response =
        await axios.get(API_URL);

      setProducts(response.data);

    } catch (err) {

      console.error(
        "Error loading products:",
        err
      );

      showError(
        "Unable to load products. Please make sure Spring Boot is running."
      );

    } finally {

      setLoading(false);

    }
  };



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

    }, 3500);

  };



  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;



    setForm((previous) => ({

      ...previous,

      [name]: value,

    }));

  };



  // =========================================================
  // IMAGE CHANGE
  // =========================================================

  const handleImageChange = (e) => {

    const file =
      e.target.files[0];



    if (!file) {

      return;

    }



    // -------------------------------------------------------
    // CHECK IMAGE
    // -------------------------------------------------------

    if (!file.type.startsWith("image/")) {

      showError(
        "Please select a valid image file."
      );

      return;

    }



    // -------------------------------------------------------
    // FILE SIZE
    // -------------------------------------------------------

    if (file.size > 2 * 1024 * 1024) {

      showError(
        "Image size must be less than 2 MB."
      );

      return;

    }



    // -------------------------------------------------------
    // READ IMAGE
    // -------------------------------------------------------

    const reader =
      new FileReader();



    reader.onload = () => {

      setForm((previous) => ({

        ...previous,

        image: reader.result,

      }));

    };



    reader.readAsDataURL(file);

  };



  // =========================================================
  // ADD PRODUCT BUTTON
  // =========================================================

  const handleAddProduct = () => {

    setEditingId(null);

    setForm(emptyProduct);

    setShowForm(true);

    setError("");

    setMessage("");

  };



  // =========================================================
  // EDIT PRODUCT
  // =========================================================

  const handleEdit = (product) => {

    setEditingId(product.id);



    setForm({

      id: product.id,

      name: product.name || "",

      brand: product.brand || "",

      price: product.price ?? "",

      stock: product.stock ?? "",

      image: product.image || "",

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
  // CANCEL FORM
  // =========================================================

  const handleCancel = () => {

    setForm(emptyProduct);

    setEditingId(null);

    setShowForm(false);

    setError("");

  };



  // =========================================================
  // SAVE / UPDATE PRODUCT
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();



    setError("");

    setMessage("");



    // =======================================================
    // VALIDATION
    // =======================================================

    if (!form.name.trim()) {

      showError(
        "Please enter the product name."
      );

      return;

    }



    if (!form.brand.trim()) {

      showError(
        "Please enter the brand name."
      );

      return;

    }



    if (
      form.price === "" ||
      Number(form.price) <= 0
    ) {

      showError(
        "Please enter a valid product price."
      );

      return;

    }



    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {

      showError(
        "Please enter a valid stock quantity."
      );

      return;

    }



    // =======================================================
    // PRODUCT DATA
    // =======================================================
    //
    // IMPORTANT:
    // Do NOT use toLowerCase() or toUpperCase().
    //
    // User type chesina exact CAPITAL / small letters
    // backend/database ki same way lo velthayi.
    //
    // =======================================================

    const productData = {

      name: form.name,

      brand: form.brand,

      price: Number(form.price),

      stock: Number(form.stock),

      image: form.image || "",

    };



    // =======================================================
    // UPDATE EXISTING PRODUCT
    // =======================================================

    if (editingId !== null) {

      try {

        const response =
          await axios.put(
            `${API_URL}/${editingId}`,
            productData
          );



        // ---------------------------------------------------
        // UPDATE UI WITH DATABASE RESPONSE
        // ---------------------------------------------------

        setProducts((previous) =>

          previous.map((product) =>

            product.id === editingId
              ? response.data
              : product

          )

        );



        showMessage(
          "Product updated successfully."
        );



        handleCancel();



      } catch (err) {

        console.error(
          "Error updating product:",
          err
        );



        showError(
          "Unable to update product. Please try again."
        );

      }



      return;

    }



    // =======================================================
    // ADD NEW PRODUCT
    // =======================================================

    try {

      const response =
        await axios.post(
          API_URL,
          productData
        );



      // -----------------------------------------------------
      // ADD DATABASE PRODUCT TO UI
      // -----------------------------------------------------

      setProducts((previous) => [

        ...previous,

        response.data,

      ]);



      showMessage(
        "Product added successfully."
      );



      handleCancel();



    } catch (err) {

      console.error(
        "Error adding product:",
        err
      );



      showError(
        "Unable to add product. Please try again."
      );

    }

  };



  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  const handleDelete = async (id) => {

    const product =
      products.find(
        (item) =>
          item.id === id
      );



    if (!product) {

      return;

    }



    const confirmDelete =
      window.confirm(

        `Are you sure you want to delete "${product.name}"?`

      );



    if (!confirmDelete) {

      return;

    }



    try {

      await axios.delete(
        `${API_URL}/${id}`
      );



      // -----------------------------------------------------
      // REMOVE FROM UI
      // -----------------------------------------------------

      setProducts((previous) =>

        previous.filter(
          (item) =>
            item.id !== id
        )

      );



      showMessage(
        "Product deleted successfully."
      );



    } catch (err) {

      console.error(
        "Error deleting product:",
        err
      );



      showError(
        "Unable to delete product. Please try again."
      );

    }

  };



  // =========================================================
  // FILTER PRODUCTS
  // =========================================================

  const filteredProducts =
    useMemo(() => {

      return products.filter(
        (product) => {

          const searchText =
            search
              .toLowerCase()
              .trim();



          const productName =
            String(
              product.name || ""
            ).toLowerCase();



          const brandName =
            String(
              product.brand || ""
            ).toLowerCase();



          const matchesSearch =
            productName.includes(
              searchText
            ) ||
            brandName.includes(
              searchText
            );



          const stock =
            Number(
              product.stock || 0
            );



          let matchesFilter =
            true;



          if (
            filter === "available"
          ) {

            matchesFilter =
              stock > 0;

          }



          if (
            filter === "out"
          ) {

            matchesFilter =
              stock === 0;

          }



          if (
            filter === "low"
          ) {

            matchesFilter =
              stock > 0 &&
              stock <= 10;

          }



          return (

            matchesSearch &&
            matchesFilter

          );

        }
      );

    }, [
      products,
      search,
      filter,
    ]);



  // =========================================================
  // STATISTICS
  // =========================================================

  const totalProducts =
    products.length;



  const totalStock =
    products.reduce(

      (total, product) =>

        total +
        Number(
          product.stock || 0
        ),

      0

    );



  const availableProducts =
    products.filter(

      (product) =>

        Number(
          product.stock || 0
        ) > 0

    ).length;



  const outOfStockProducts =
    products.filter(

      (product) =>

        Number(
          product.stock || 0
        ) === 0

    ).length;



  // =========================================================
  // STOCK STATUS
  // =========================================================

  const getStockStatus = (
    stock
  ) => {

    const quantity =
      Number(stock);



    if (
      quantity === 0
    ) {

      return {

        text: "Out of Stock",

        className: "out",

      };

    }



    if (
      quantity <= 10
    ) {

      return {

        text: "Low Stock",

        className: "low",

      };

    }



    return {

      text: "Available",

      className: "available",

    };

  };



  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="manage-products-page">



      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="products-header">



        <div className="products-header-left">



          <Link
            to="/admin-dashboard"
            className="back-dashboard"
          >

            <FaArrowLeft />

            <span>
              Dashboard
            </span>

          </Link>



          <div className="products-title-area">



            <div className="products-title-icon">

              <FaBoxOpen />

            </div>



            <div>

              <span className="section-label">
                ADMINISTRATION
              </span>



              <h1>
                Manage Products
              </h1>



              <p>
                Add, edit, delete and manage
                your chocolate products.
              </p>

            </div>



          </div>



        </div>



        <button
          className="add-product-btn"
          onClick={
            handleAddProduct
          }
        >

          <FaPlus />

          Add New Product

        </button>



      </header>





      {/* =====================================================
          MESSAGES
      ===================================================== */}

      {message && (

        <div className="product-message success">

          <FaCheckCircle />

          <span>
            {message}
          </span>

        </div>

      )}



      {error && (

        <div className="product-message error">

          <FaExclamationTriangle />

          <span>
            {error}
          </span>

        </div>

      )}





      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="products-main">



        {/* ===================================================
            STATISTICS
        =================================================== */}

        <section className="product-stats">



          {/* TOTAL PRODUCTS */}

          <div className="product-stat-card">



            <div className="stat-icon products">

              <FaBoxOpen />

            </div>



            <div>

              <span>
                Total Products
              </span>

              <strong>
                {totalProducts}
              </strong>

            </div>



          </div>





          {/* TOTAL STOCK */}

          <div className="product-stat-card">



            <div className="stat-icon stock">

              <FaBoxes />

            </div>



            <div>

              <span>
                Total Stock
              </span>

              <strong>
                {totalStock}
              </strong>

            </div>



          </div>





          {/* AVAILABLE */}

          <div className="product-stat-card">



            <div className="stat-icon available">

              <FaCheckCircle />

            </div>



            <div>

              <span>
                Available
              </span>

              <strong>
                {availableProducts}
              </strong>

            </div>



          </div>





          {/* OUT OF STOCK */}

          <div className="product-stat-card">



            <div className="stat-icon out">

              <FaExclamationTriangle />

            </div>



            <div>

              <span>
                Out of Stock
              </span>

              <strong>
                {outOfStockProducts}
              </strong>

            </div>



          </div>



        </section>





        {/* ===================================================
            ADD / EDIT FORM
        =================================================== */}

        {showForm && (

          <section className="product-form-section">



            <div className="form-heading">



              <div>

                <span className="section-label">
                  PRODUCT MANAGEMENT
                </span>



                <h2>

                  {editingId !== null
                    ? "Edit Product"
                    : "Add New Product"}

                </h2>



                <p>
                  Enter the product details below.
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
              className="product-form"
              onSubmit={handleSubmit}
            >



              {/* PRODUCT NAME */}

              <div className="form-group">



                <label>

                  Product Name

                  <span>
                    *
                  </span>

                </label>



                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />



              </div>





              {/* BRAND */}

              <div className="form-group">



                <label>

                  Brand

                  <span>
                    *
                  </span>

                </label>



                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                />



              </div>





              {/* PRICE */}

              <div className="form-group">



                <label>

                  Price

                  <span>
                    *
                  </span>

                </label>



                <div className="price-input">



                  <span>
                    ₹
                  </span>



                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                  />



                </div>



              </div>





              {/* STOCK */}

              <div className="form-group">



                <label>

                  Stock Quantity

                  <span>
                    *
                  </span>

                </label>



                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                  placeholder="Enter stock quantity"
                />



              </div>





              {/* IMAGE */}

              <div className="form-group image-form-group">



                <label>
                  Product Image
                </label>



                <label
                  className="image-upload"
                  htmlFor="product-image"
                >

                  <FaImage />



                  <span>

                    {form.image
                      ? "Change Product Image"
                      : "Choose Product Image"}

                  </span>



                  <small>
                    JPG, PNG or WEBP
                  </small>



                </label>



                <input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  hidden
                />



              </div>





              {/* IMAGE PREVIEW */}

              {form.image && (

                <div className="form-image-preview">



                  <img
                    src={form.image}
                    alt="Product preview"
                  />



                  <button
                    type="button"
                    onClick={() =>
                      setForm(
                        (previous) => ({

                          ...previous,

                          image: "",

                        })
                      )
                    }
                  >

                    <FaTimes />

                  </button>



                </div>

              )}





              {/* FORM BUTTONS */}

              <div className="form-actions">



                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    handleCancel
                  }
                >

                  <FaTimes />

                  Cancel

                </button>



                <button
                  type="submit"
                  className="save-product-btn"
                >

                  <FaSave />



                  {editingId !== null
                    ? "Update Product"
                    : "Save Product"}



                </button>



              </div>



            </form>



          </section>

        )}





        {/* ===================================================
            PRODUCT LIST
        =================================================== */}

        <section className="products-list-section">



          <div className="list-heading">



            <div>



              <span className="section-label">
                INVENTORY
              </span>



              <h2>
                Your Products
              </h2>



              <p>
                Manage all chocolate products
                from one place.
              </p>



            </div>



            <div className="product-count">

              {filteredProducts.length}
              {" "}
              Products

            </div>



          </div>





          {/* =================================================
              SEARCH + FILTER
          ================================================= */}

          <div className="products-toolbar">



            <div className="search-box">



              <FaSearch />



              <input
                type="text"
                placeholder="Search product or brand..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />



            </div>





            <div className="filter-buttons">



              <button
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
                className={
                  filter === "available"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("available")
                }
              >

                Available

              </button>



              <button
                className={
                  filter === "low"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("low")
                }
              >

                Low Stock

              </button>



              <button
                className={
                  filter === "out"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter("out")
                }
              >

                Out of Stock

              </button>



            </div>



          </div>





          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (

            <div className="empty-products">

              <div className="empty-icon">

                <FaBoxOpen />

              </div>



              <h3>
                Loading Products...
              </h3>



              <p>
                Getting products from the database.
              </p>



            </div>

          )}





          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            filteredProducts.length === 0 && (

              <div className="empty-products">



                <div className="empty-icon">

                  <FaBoxOpen />

                </div>



                <h3>

                  {products.length === 0
                    ? "No Products Added Yet"
                    : "No Products Found"}

                </h3>



                <p>

                  {products.length === 0
                    ? "Start adding your chocolate products to manage your inventory."
                    : "Try changing your search or filter."}

                </p>



                {products.length === 0 && (

                  <button
                    className="empty-add-btn"
                    onClick={
                      handleAddProduct
                    }
                  >

                    <FaPlus />

                    Add Your First Product

                  </button>

                )}



              </div>

            )}





          {/* =================================================
              PRODUCT GRID
          ================================================= */}

          {!loading &&
            filteredProducts.length > 0 && (

              <div className="product-grid">



                {filteredProducts.map(
                  (product) => {



                    const stockStatus =
                      getStockStatus(
                        product.stock
                      );



                    return (

                      <article
                        className="product-card"
                        key={product.id}
                      >



                        {/* IMAGE */}

                        <div className="product-image">



                          {product.image ? (

                            <img
                              src={
                                product.image
                              }
                              alt={
                                product.name
                              }
                            />

                          ) : (

                            <div className="no-product-image">

                              <FaBoxOpen />

                              <span>
                                No Image
                              </span>

                            </div>

                          )}



                          <span
                            className={
                              `stock-badge ${stockStatus.className}`
                            }
                          >

                            {
                              stockStatus.text
                            }

                          </span>



                        </div>





                        {/* DETAILS */}

                        <div className="product-details">



                          <span className="product-brand">

                            {
                              product.brand
                            }

                          </span>



                          <h3>

                            {
                              product.name
                            }

                          </h3>



                          <div className="product-info">



                            <div>

                              <span>
                                Price
                              </span>



                              <strong>

                                ₹
                                {Number(
                                  product.price
                                ).toLocaleString(
                                  "en-IN",
                                  {
                                    minimumFractionDigits: 2,
                                  }
                                )}

                              </strong>

                            </div>



                            <div>

                              <span>
                                Stock
                              </span>



                              <strong>

                                {
                                  product.stock
                                }

                              </strong>

                            </div>



                          </div>





                          {/* ACTIONS */}

                          <div className="product-actions">



                            <button
                              className="edit-btn"
                              onClick={() =>
                                handleEdit(
                                  product
                                )
                              }
                            >

                              <FaEdit />

                              Edit

                            </button>



                            <button
                              className="delete-btn"
                              onClick={() =>
                                handleDelete(
                                  product.id
                                )
                              }
                            >

                              <FaTrash />

                              Delete

                            </button>



                          </div>



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



export default ManageProducts;