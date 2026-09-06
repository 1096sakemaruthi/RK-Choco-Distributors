import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowRight,
  FaCheckCircle,
  FaStore,
  FaTags,
  FaHeadset,
  FaAward,
  FaShoppingBag,
  FaTimes,
} from "react-icons/fa";

import "../styles/Home.css";


/* =====================================================
   BRANDS
===================================================== */

const brands = [
  {
    name: "Cadbury",
    image: "/images/cadbury.jpg",
    description:
      "Cadbury offers a wide range of delicious chocolates loved by customers across India. We supply Cadbury products to retail shops and business partners.",
  },

  {
    name: "KitKat",
    image: "/images/kitkat.jpg",
    description:
      "KitKat is a popular chocolate wafer brand known for its crispy wafer and smooth chocolate coating.",
  },

  {
    name: "5 Star",
    image: "/images/5star.png",
    description:
      "Cadbury 5 Star is a delicious caramel chocolate enjoyed by chocolate lovers across India.",
  },

  {
    name: "Munch",
    image: "/images/munch.jpg",
    description:
      "Nestlé Munch is a crispy wafer chocolate that is popular among kids and adults.",
  },

  {
    name: "Oreo",
    image: "/images/oreo.jpg",
    description:
      "Oreo is a famous chocolate sandwich cookie loved by customers of all ages.",
  },
];


/* =====================================================
   STATISTICS
===================================================== */

const statistics = [
  {
    value: "500+",
    title: "Retail Shops",
    icon: <FaStore />,
    details:
      "We proudly supply chocolates to 500+ retail shops with reliable distribution and regular order support.",
  },

  {
    value: "20+",
    title: "Chocolate Brands",
    icon: <FaTags />,
    details:
      "We distribute products from 20+ popular chocolate and confectionery brands.",
  },

  {
    value: "24/7",
    title: "Customer Support",
    icon: <FaHeadset />,
    details:
      "Our support team helps retailers and customers with orders, products and enquiries.",
  },

  {
    value: "100%",
    title: "Quality Service",
    icon: <FaAward />,
    details:
      "We focus on trusted brands, quality products and dependable distribution service.",
  },
];


function Home() {
  const [selectedItem, setSelectedItem] = useState(null);


  /* OPEN DETAILS */

  const openDetails = (item) => {
    setSelectedItem(item);
  };


  /* CLOSE DETAILS */

  const closeDetails = () => {
    setSelectedItem(null);
  };


  return (
    <main className="home-page">


      {/* =================================================
          HERO SECTION
      ================================================= */}

      <section className="hero-section">

        {/* LEFT SIDE */}

        <div className="hero-content">

          <div className="premium-badge">
            PREMIUM CHOCOLATE DISTRIBUTOR
          </div>


          <h1 className="hero-title">

            <span>
              INDIA'S TRUSTED
            </span>

            <span className="gold-text">
              CHOCOLATE
            </span>

            <span>
              DISTRIBUTOR
            </span>

          </h1>


          <p className="hero-description">
            We deliver premium chocolates to retail stores,
            supermarkets and wholesale partners with quality,
            trust and fast delivery.
          </p>


          {/* BUTTONS */}

          <div className="hero-buttons">

            <Link
              to="/products"
              className="primary-button"
            >
              <FaShoppingBag />

              Shop Now

              <FaArrowRight />
            </Link>


            {/* =================================================
                OUR BRANDS
                ONLY CHANGE:
                NOW GOES TO BRANDS PAGE
            ================================================= */}

            <Link
              to="/brands"
              className="secondary-button"
            >
              <FaTags />

              Our Brands
            </Link>

          </div>


          {/* FEATURES */}

          <div className="hero-features">

            <span>
              <FaCheckCircle />
              Trusted Brands
            </span>

            <span>
              <FaCheckCircle />
              Fast Delivery
            </span>

            <span>
              <FaCheckCircle />
              Quality Products
            </span>

          </div>

        </div>


        {/* RIGHT SIDE HERO IMAGE */}

        <div className="hero-image-container">

          <img
            src="/images/hero.png"
            alt="RK Choco Distributors"
            className="hero-image"
          />

        </div>

      </section>



      {/* =================================================
          STATISTICS
      ================================================= */}

      <section className="statistics-section">

        <div className="statistics-container">

          {statistics.map(
            (item, index) => (

              <button
                type="button"
                className="stat-card"
                key={index}
                onClick={() =>
                  openDetails(item)
                }
              >

                <div className="stat-icon">
                  {item.icon}
                </div>


                <div className="stat-content">

                  <h3>
                    {item.value}
                  </h3>

                  <p>
                    {item.title}
                  </p>

                </div>

              </button>

            )
          )}

        </div>

      </section>



      {/* =================================================
          TRUSTED BRANDS
      ================================================= */}

      <section
        className="trusted-brands-section"
        id="trusted-brands"
      >

        <div className="brands-heading">

          <h2 className="popular-brands-title">
            MOST POPULAR BRANDS
          </h2>

          <p>
            Bringing your favourite chocolate brands
            closer to every shop.
          </p>

        </div>



        <div className="brands-container">

          {brands.map(
            (brand, index) => (

              <div
                className="brand-card"
                key={index}
                onClick={() =>
                  openDetails(brand)
                }
              >

                {/* LOGO */}

                <div className="brand-image-container">

                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="brand-image"
                  />

                </div>


                {/* BRAND NAME */}

                <h3>
                  {brand.name}
                </h3>


                {/* VIEW PRODUCTS */}

                <Link
                  to={`/products?brand=${encodeURIComponent(
                    brand.name
                  )}`}
                  className="view-products-button"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >

                  View Products

                  <FaArrowRight />

                </Link>

              </div>

            )
          )}

        </div>

      </section>



      {/* =================================================
          DETAILS POPUP
      ================================================= */}

      {selectedItem && (

        <div
          className="details-overlay"
          onClick={closeDetails}
        >

          <div
            className="details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              className="close-details"
              onClick={closeDetails}
            >
              <FaTimes />
            </button>


            {/* BRAND IMAGE */}

            {selectedItem.image && (

              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="modal-brand-image"
              />

            )}


            {/* STAT ICON */}

            {!selectedItem.image && (

              <div className="modal-icon">
                {selectedItem.icon}
              </div>

            )}


            {/* TITLE */}

            <h2>
              {selectedItem.name ||
                selectedItem.title}
            </h2>


            {/* VALUE */}

            {selectedItem.value && (

              <div className="modal-value">
                {selectedItem.value}
              </div>

            )}


            {/* DESCRIPTION */}

            <p>
              {selectedItem.description ||
                selectedItem.details}
            </p>


            {/* CLOSE / SHOP */}

            <Link
              to={
                selectedItem.name
                  ? `/products?brand=${encodeURIComponent(
                      selectedItem.name
                    )}`
                  : "/products"
              }
              className="modal-shop-button"
              onClick={closeDetails}
            >

              <FaShoppingBag />

              View Products

              <FaArrowRight />

            </Link>

          </div>

        </div>

      )}

    </main>
  );
}


export default Home;