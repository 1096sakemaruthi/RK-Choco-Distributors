import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaSearch,
  FaShoppingCart,
  FaInfoCircle,
  FaMinus,
  FaPlus,
  FaTimes,
  FaTag,
  FaSyncAlt,
} from "react-icons/fa";

import "../styles/Products.css";
import api from "../services/api";

/* =====================================================
   IMAGE MAP
===================================================== */

const productImages = {
  "5 Star": "/images/5star.png",
  "Cadbury Dairy Milk": "/images/cadbury.jpg",
  "Nestlé KitKat": "/images/kitkat.jpg",
  "Nestlé Munch": "/images/munch.jpg",
  Oreo: "/images/oreo.jpg",
  "Oreo Original": "/images/oreo.jpg",
  Mars: "/images/mars.jpg",
  Snickers: "/images/snickers.jpg",
  "Hershey's": "/images/hersheys.jpg",
  Twix: "/images/twix.jpg",
  "Kinder Bueno": "/images/bueno.jpg",
  "Dark Chocolate": "/images/dark-chocolate.jpg",
  "Reese's": "/images/reeses.jpg",
  "Hershey's Kisses": "/images/kisses.jpg",
  Kisses: "/images/kisses.jpg",
  Moms: "/images/moms.jpg",
  "Milky Way": "/images/milkyway.jpg",
  Galaxy: "/images/galaxy.jpg",
  "M&M's": "/images/mms.jpg",
  Milka: "/images/milka.jpg",
  Crunch: "/images/crunch.jpg",
  Dove: "/images/dove.jpg",
  Ghirardelli: "/images/ghirardelli.jpg",
  Bounty: "/images/bounty.jpg",
  "Cadbury Perk": "/images/perk.jpg",
  Perk: "/images/perk.jpg",
  "Dairy Milk Silk": "/images/silk.jpg",
  Silk: "/images/silk.jpg",
  Feastables: "/images/feastables.jpg",
  "100 Grand": "/images/100grand.jpg",
};

/* =====================================================
   DEFAULT IMAGE
===================================================== */

const defaultImage = "/images/cadbury.jpg";

/* =====================================================
   GET IMAGE FROM PRODUCT NAME
   Case-insensitive matching
===================================================== */

const getMappedProductImage = (productName) => {
  if (!productName) {
    return defaultImage;
  }

  const enteredName = String(productName)
    .trim()
    .toLowerCase();

  const matchedKey = Object.keys(productImages).find(
    (key) =>
      key.trim().toLowerCase() === enteredName
  );

  if (matchedKey) {
    return productImages[matchedKey];
  }

  return defaultImage;
};

/* =====================================================
   BRANDS
===================================================== */

const brands = [
  "All",
  "Cadbury",
  "KitKat",
  "5 Star",
  "Munch",
  "Oreo",
  "Mars",
  "Snickers",
  "Hershey's",
  "Twix",
  "Kinder Bueno",
  "Dark Chocolate",
  "Reese's",
  "Kisses",
  "Moms",
  "Milky Way",
  "Galaxy",
  "M&M's",
  "Milka",
  "Crunch",
  "Dove",
  "Ghirardelli",
  "Bounty",
  "Perk",
  "Silk",
  "Feastables",
  "100 Grand",
];

/* =====================================================
   PRODUCTS COMPONENT
===================================================== */

function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /* =====================================================
     STATES
  ===================================================== */

  const [products, setProducts] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [selectedBrand, setSelectedBrand] =
    useState("All");

  const [quantities, setQuantities] = useState({});

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =====================================================
     GET BRAND FROM URL
  ===================================================== */

  useEffect(() => {
    const brandFromUrl = searchParams.get("brand");

    if (brandFromUrl) {
      setSelectedBrand(brandFromUrl);
    } else {
      setSelectedBrand("All");
    }
  }, [searchParams]);

  /* =====================================================
     FETCH PRODUCTS FROM SPRING BOOT
  ===================================================== */

  const loadProducts = () => {
    setLoading(true);
    setError("");

    api
      .get("/products")
      .then((response) => {
        const data = response.data;

        const formattedProducts = data.map((product) => {
          /*
           * IMPORTANT:
           *
           * Admin side lo upload chesina image
           * database nunchi vachina product.image lo untundi.
           *
           * Kabatti first priority:
           * product.image
           *
           * Second priority:
           * product name based built-in image
           *
           * Third priority:
           * default Dairy Milk image
           */

          const backendImage =
            product.image &&
            String(product.image).trim() !== ""
              ? product.image
              : "";

          const mappedImage =
            getMappedProductImage(product.name);

          return {
            ...product,

            image:
              backendImage ||
              mappedImage ||
              defaultImage,

            description:
              product.description ||
              `${product.name} chocolate from ${product.brand}.`,

            price: Number(product.price) || 0,

            stock: Number(product.stock) || 0,
          };
        });

        setProducts(formattedProducts);

        /* =================================================
           RESET QUANTITIES
        ================================================= */

        const initialQuantities = {};

        formattedProducts.forEach((product) => {
          initialQuantities[product.id] = 1;
        });

        setQuantities(initialQuantities);

        setLoading(false);
      })
      .catch((err) => {
        console.error(
          "Error fetching products:",
          err
        );

        setError(
          "Unable to connect to CDMS Backend."
        );

        setLoading(false);
      });
  };

  /* =====================================================
     LOAD PRODUCTS
  ===================================================== */

  useEffect(() => {
    loadProducts();
  }, []);

  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      /*
       * IMPORTANT:
       *
       * Display name/brand original ga untayi.
       * Search kosam matrame lowercase chestunnam.
       *
       * Database lo save ayina:
       * Dove
       * dove
       * DOVE
       *
       * exact ga preserve avutayi.
       */

      const matchesBrand =
        selectedBrand === "All" ||
        product.brand === selectedBrand;

      const search =
        searchText.trim().toLowerCase();

      const productName =
        String(product.name || "").toLowerCase();

      const brandName =
        String(product.brand || "").toLowerCase();

      const matchesSearch =
        productName.includes(search) ||
        brandName.includes(search);

      return (
        matchesBrand &&
        matchesSearch
      );
    });
  }, [
    products,
    searchText,
    selectedBrand,
  ]);

  /* =====================================================
     GET QUANTITY
  ===================================================== */

  const getQuantity = (productId) => {
    return quantities[productId] || 1;
  };

  /* =====================================================
     INCREASE QUANTITY
  ===================================================== */

  const increaseQuantity = (product) => {
    const currentQuantity =
      getQuantity(product.id);

    if (
      currentQuantity >= product.stock
    ) {
      return;
    }

    setQuantities((previous) => ({
      ...previous,

      [product.id]:
        currentQuantity + 1,
    }));
  };

  /* =====================================================
     DECREASE QUANTITY
  ===================================================== */

  const decreaseQuantity = (productId) => {
    const currentQuantity =
      getQuantity(productId);

    if (currentQuantity <= 1) {
      return;
    }

    setQuantities((previous) => ({
      ...previous,

      [productId]:
        currentQuantity - 1,
    }));
  };

  /* =====================================================
     TOTAL
  ===================================================== */

  const getTotal = (product) => {
    return (
      product.price *
      getQuantity(product.id)
    );
  };

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const addToCart = (product) => {
    const quantity =
      getQuantity(product.id);

    if (product.stock <= 0) {
      alert(
        "This product is out of stock."
      );
      return;
    }

    if (quantity > product.stock) {
      alert(
        `Only ${product.stock} boxes are available.`
      );
      return;
    }

    const existingCart =
      JSON.parse(
        localStorage.getItem(
          "cartItems"
        ) || "[]"
      );

    const existingProduct =
      existingCart.find(
        (item) =>
          item.id === product.id
      );

    let updatedCart;

    if (existingProduct) {
      const newQuantity =
        existingProduct.quantity +
        quantity;

      if (
        newQuantity > product.stock
      ) {
        alert(
          `Only ${product.stock} boxes are available.`
        );
        return;
      }

      updatedCart =
        existingCart.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    newQuantity,
                }
              : item
        );
    } else {
      updatedCart = [
        ...existingCart,

        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          stock: product.stock,
          image: product.image,
          description:
            product.description,
          quantity: quantity,
        },
      ];
    }

    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );

    navigate("/cart");
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="products-page">

        <section className="products-header">

          <Link
            to="/"
            className="back-home"
          >
            <FaArrowLeft />
            Back to Home
          </Link>

          <span className="products-small-title">
            OUR PRODUCTS
          </span>

          <h1>
            Chocolate Products
          </h1>

          <p>
            Loading products...
          </p>

        </section>

      </main>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <main className="products-page">

        <section className="products-header">

          <Link
            to="/"
            className="back-home"
          >
            <FaArrowLeft />
            Back to Home
          </Link>

          <span className="products-small-title">
            OUR PRODUCTS
          </span>

          <h1>
            Chocolate Products
          </h1>

          <p
            style={{
              color: "red",
              fontWeight: "600",
            }}
          >
            {error}
          </p>

          <p>
            Please make sure Spring Boot
            backend is running on port 8080.
          </p>

          <button
            type="button"
            onClick={loadProducts}
            style={{
              marginTop: "15px",
              padding: "10px 18px",
              cursor: "pointer",
            }}
          >
            <FaSyncAlt />
            {" "}Try Again
          </button>

        </section>

      </main>
    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <main className="products-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="products-header">

        <Link
          to="/"
          className="back-home"
        >
          <FaArrowLeft />
          Back to Home
        </Link>

        <span className="products-small-title">
          OUR PRODUCTS
        </span>

        <h1>
          Chocolate Products
        </h1>

        <p>
          Choose from our wide collection
          of trusted chocolate brands.
        </p>

      </section>

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <section className="products-tools">

        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Search chocolates..."
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
          />

        </div>

        <div className="brand-filter">

          {brands.map((brand) => (

            <button
              type="button"
              key={brand}
              className={
                selectedBrand === brand
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() => {
                setSelectedBrand(brand);

                if (brand === "All") {
                  navigate("/products");
                } else {
                  navigate(
                    `/products?brand=${encodeURIComponent(
                      brand
                    )}`
                  );
                }
              }}
            >
              {brand}
            </button>

          ))}

        </div>

      </section>

      {/* =================================================
          PRODUCT COUNT
      ================================================= */}

      <div className="products-count">

        Showing{" "}

        <strong>
          {filteredProducts.length}
        </strong>

        {" "}products

      </div>

      {/* =================================================
          PRODUCTS
      ================================================= */}

      <section className="products-container">

        {filteredProducts.length === 0 ? (

          <div className="no-products">

            <h2>
              No products found
            </h2>

            <p>
              Try another chocolate or brand.
            </p>

          </div>

        ) : (

          filteredProducts.map((product) => {

            const quantity =
              getQuantity(product.id);

            return (

              <article
                className="product-card"
                key={product.id}
              >

                {/* =================================================
                    IMAGE
                ================================================= */}

                <div className="product-image-box">

                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(event) => {
                      /*
                       * If uploaded image has any problem,
                       * try built-in image based on product name.
                       */

                      const mappedImage =
                        getMappedProductImage(
                          product.name
                        );

                      if (
                        event.currentTarget.src.endsWith(
                          mappedImage
                        )
                      ) {
                        event.currentTarget.src =
                          defaultImage;
                      } else {
                        event.currentTarget.src =
                          mappedImage;
                      }
                    }}
                  />

                </div>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="product-info">

                  <span className="product-brand">
                    {product.brand}
                  </span>

                  <h2>
                    {product.name}
                  </h2>

                  <p className="product-description">
                    {product.description}
                  </p>

                  {/* =================================================
                      PRICE
                  ================================================= */}

                  <div className="price-row">

                    <div>

                      <strong className="product-price">
                        ₹{product.price}
                      </strong>

                      <span className="per-box">
                        / Box
                      </span>

                    </div>

                  </div>

                  {/* =================================================
                      BOX INFO
                  ================================================= */}

                  <div className="box-info">
                    📦 1 Box = 10 Pieces
                  </div>

                  {/* =================================================
                      STOCK
                  ================================================= */}

                  <div
                    className="box-info"
                    style={{
                      color:
                        product.stock > 0
                          ? "green"
                          : "red",
                    }}
                  >
                    📦 Stock: {product.stock}
                  </div>

                  {/* =================================================
                      QUANTITY
                  ================================================= */}

                  <div className="quantity-row">

                    <span>
                      Quantity
                    </span>

                    <div className="quantity-control">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(
                            product.id
                          )
                        }
                        disabled={
                          quantity <= 1
                        }
                        aria-label="Decrease quantity"
                      >
                        <FaMinus />
                      </button>

                      <strong>
                        {quantity}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(
                            product
                          )
                        }
                        disabled={
                          product.stock <= 0 ||
                          quantity >=
                            product.stock
                        }
                        aria-label="Increase quantity"
                      >
                        <FaPlus />
                      </button>

                    </div>

                  </div>

                  {/* =================================================
                      TOTAL
                  ================================================= */}

                  <div className="total-row">

                    <span>
                      Total
                    </span>

                    <strong>
                      ₹{getTotal(product)}
                    </strong>

                  </div>

                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <div className="product-actions">

                    <button
                      type="button"
                      className="details-button"
                      onClick={() =>
                        setSelectedProduct(
                          product
                        )
                      }
                    >
                      <FaInfoCircle />
                      Details
                    </button>

                    <button
                      type="button"
                      className="add-cart-button"
                      onClick={() =>
                        addToCart(product)
                      }
                      disabled={
                        product.stock <= 0
                      }
                    >
                      <FaShoppingCart />

                      {product.stock <= 0
                        ? "Out of Stock"
                        : "Add to Cart"}

                    </button>

                  </div>

                </div>

              </article>

            );
          })

        )}

      </section>

      {/* =================================================
          PRODUCT DETAILS MODAL
      ================================================= */}

      {selectedProduct && (

        <div
          className="product-modal-overlay"
          onClick={() =>
            setSelectedProduct(null)
          }
        >

          <div
            className="product-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =================================================
                CLOSE
            ================================================= */}

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setSelectedProduct(null)
              }
            >
              <FaTimes />
            </button>

            {/* =================================================
                IMAGE
            ================================================= */}

            <img
              src={
                selectedProduct.image
              }
              alt={
                selectedProduct.name
              }
              className="modal-product-image"
              onError={(event) => {
                const mappedImage =
                  getMappedProductImage(
                    selectedProduct.name
                  );

                if (
                  event.currentTarget.src.endsWith(
                    mappedImage
                  )
                ) {
                  event.currentTarget.src =
                    defaultImage;
                } else {
                  event.currentTarget.src =
                    mappedImage;
                }
              }}
            />

            <span className="modal-brand">
              {selectedProduct.brand}
            </span>

            <h2>
              {selectedProduct.name}
            </h2>

            <p>
              {
                selectedProduct.description
              }
            </p>

            <div className="modal-price">

              <FaTag />

              ₹
              {selectedProduct.price}
              {" "} / Box

            </div>

            <div className="modal-box-info">
              📦 1 Box = 10 Pieces
            </div>

            <div className="modal-box-info">
              📦 Available Stock:{" "}
              {selectedProduct.stock}
            </div>

            <Link
              to={`/products?brand=${encodeURIComponent(
                selectedProduct.brand
              )}`}
              className="modal-products-link"
              onClick={() =>
                setSelectedProduct(null)
              }
            >
              <FaShoppingCart />
              View Brand Products
            </Link>

          </div>

        </div>

      )}

    </main>
  );
}

export default Products;