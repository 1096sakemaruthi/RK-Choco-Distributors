import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowLeft,
  FaInfoCircle,
  FaTimes,
  FaShoppingBag,
} from "react-icons/fa";

import "../styles/Brands.css";


/* =====================================================
   BRANDS PAGE
===================================================== */

function Brands() {

  const [brandProducts, setBrandProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /* =====================================================
     LOAD BRANDS FROM BACKEND
  ===================================================== */

  useEffect(() => {

    const fetchBrands = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:8080/api/brands"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load brands."
          );
        }

        const data = await response.json();

        setBrandProducts(data);

      } catch (err) {

        console.error(
          "Error loading brands:",
          err
        );

        setError(
          "Unable to load brands. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchBrands();

  }, []);


  /* =====================================================
     BRANDS PAGE
  ===================================================== */

  return (

    <main className="brands-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <section className="brands-page-header">

        <Link
          to="/"
          className="brands-back-home"
        >
          <FaArrowLeft />
          Back to Home
        </Link>


        <h1>
          Our Chocolate Collection
        </h1>


        <p>
          Discover delicious chocolates from popular
          brands. Explore each product to know more
          about it.
        </p>

      </section>


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (

        <div className="brands-loading">

          <p>
            Loading chocolate brands...
          </p>

        </div>

      )}


      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (

        <div className="brands-error">

          <p>
            {error}
          </p>

        </div>

      )}


      {/* =================================================
          NO BRANDS
      ================================================= */}

      {!loading &&
        !error &&
        brandProducts.length === 0 && (

          <div className="brands-empty">

            <p>
              No chocolate brands available.
            </p>

          </div>

        )}


      {/* =================================================
          BRANDS / PRODUCTS
      ================================================= */}

      {!loading &&
        !error &&
        brandProducts.length > 0 && (

          <section className="brands-products-container">

            {brandProducts.map((product) => (

              <article
                className="brand-product-card"
                key={product.id}
              >


                {/* IMAGE */}

                <div className="brand-product-image-box">

                  {product.image ? (

                    <img
                      src={product.image}
                      alt={product.name}
                      className="brand-product-image"
                    />

                  ) : (

                    <div className="brand-product-no-image">
                      No Image
                    </div>

                  )}

                </div>


                {/* INFORMATION */}

                <div className="brand-product-info">


                  <span className="brand-product-name">

                    {product.name}

                  </span>


                  <h2>

                    {product.name}

                  </h2>


                  <p>

                    {product.description}

                  </p>


                  {/* DETAILS */}

                  <button
                    type="button"
                    className="brand-details-button"
                    onClick={() =>
                      setSelectedProduct(product)
                    }
                  >

                    <FaInfoCircle />

                    Details

                  </button>


                </div>

              </article>

            ))}

          </section>

        )}


      {/* =================================================
          DETAILS MODAL
      ================================================= */}

      {selectedProduct && (

        <div
          className="brand-details-overlay"
          onClick={() =>
            setSelectedProduct(null)
          }
        >


          <div
            className="brand-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* =================================================
                TOP RIGHT CLOSE ONLY
            ================================================= */}

            <button
              type="button"
              className="brand-modal-close"
              onClick={() =>
                setSelectedProduct(null)
              }
            >

              <FaTimes />

            </button>


            {/* IMAGE */}

            {selectedProduct.image && (

              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="brand-modal-image"
              />

            )}


            {/* BRAND */}

            <span className="brand-modal-brand">

              {selectedProduct.name}

            </span>


            {/* NAME */}

            <h2>

              {selectedProduct.name}

            </h2>


            {/* DESCRIPTION */}

            <p>

              {selectedProduct.description}

            </p>


            {/* =================================================
                BUY PRODUCT
                GO TO PRODUCTS PAGE
            ================================================= */}

            <Link
              to={`/products?brand=${encodeURIComponent(
                selectedProduct.name
              )}`}
              className="brand-modal-buy-button"
              onClick={() =>
                setSelectedProduct(null)
              }
            >

              <FaShoppingBag />

              Buy Product

            </Link>


          </div>

        </div>

      )}

    </main>

  );
}


export default Brands;