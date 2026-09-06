import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaTrash,
  FaShoppingCart,
} from "react-icons/fa";

import "../styles/Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  /* =====================================================
     LOAD CART
  ===================================================== */

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("cartItems") || "[]"
    );

    setCartItems(savedCart);
  }, []);

  /* =====================================================
     SAVE CART
  ===================================================== */

  const saveCart = (updatedCart) => {
    setCartItems(updatedCart);

    localStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );
  };

  /* =====================================================
     INCREASE QUANTITY
  ===================================================== */

  const increaseQuantity = (productName) => {
    const updatedCart = cartItems.map((item) =>
      item.name === productName
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    saveCart(updatedCart);
  };

  /* =====================================================
     DECREASE QUANTITY
  ===================================================== */

  const decreaseQuantity = (productName) => {
    const updatedCart = cartItems
      .map((item) =>
        item.name === productName
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  };

  /* =====================================================
     REMOVE PRODUCT
  ===================================================== */

  const removeProduct = (productName) => {
    const updatedCart = cartItems.filter(
      (item) => item.name !== productName
    );

    saveCart(updatedCart);
  };

  /* =====================================================
     TOTAL BOXES
  ===================================================== */

  const totalBoxes = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  /* =====================================================
     GRAND TOTAL
  ===================================================== */

  const grandTotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  /* =====================================================
     PLACE ORDER
  ===================================================== */

  const goToPlaceOrder = () => {
    if (cartItems.length === 0) {
      return;
    }

    navigate("/place-order");
  };

  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">

        <section className="empty-cart">

          <FaShoppingCart
            className="empty-cart-icon"
          />

          <h1>
            Your Shopping Cart
          </h1>

          <p>
            Your cart is currently empty.
          </p>

          <Link
            to="/products"
            className="continue-shopping-button"
          >
            <FaArrowLeft />
            Continue Shopping
          </Link>

        </section>

      </main>
    );
  }

  /* =====================================================
     CART PAGE
  ===================================================== */

  return (
    <main className="cart-page">

      {/* HEADER */}

      <section className="cart-header">

        <Link
          to="/products"
          className="cart-back"
        >
          <FaArrowLeft />
          Continue Shopping
        </Link>

        <h1>
          🛒 Your Shopping Cart
        </h1>

        <p>
          Review your selected chocolate
          products before placing your order.
        </p>

      </section>

      {/* CART ITEMS */}

      <section className="cart-container">

        <div className="cart-items">

          {cartItems.map((item) => {

            const itemTotal =
              item.price * item.quantity;

            return (
              <article
                className="cart-item"
                key={item.name}
              >

                {/* IMAGE */}

                <div className="cart-item-image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                </div>

                {/* DETAILS */}

                <div className="cart-item-details">

                  <span className="cart-item-brand">
                    {item.brand}
                  </span>

                  <h2>
                    {item.name}
                  </h2>

                  <p>
                    ₹{item.price} / Box
                  </p>

                  {/* QUANTITY */}

                  <div className="cart-quantity-row">

                    <span>
                      Quantity:
                    </span>

                    <div className="cart-quantity-control">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(
                            item.name
                          )
                        }
                      >
                        <FaMinus />
                      </button>

                      <strong>
                        {item.quantity}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(
                            item.name
                          )
                        }
                      >
                        <FaPlus />
                      </button>

                    </div>

                  </div>

                </div>

                {/* TOTAL */}

                <div className="cart-item-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹{itemTotal}
                  </strong>

                  <button
                    type="button"
                    className="remove-cart-item"
                    onClick={() =>
                      removeProduct(
                        item.name
                      )
                    }
                  >
                    <FaTrash />
                    Remove
                  </button>

                </div>

              </article>
            );
          })}

        </div>

        {/* SUMMARY */}

        <aside className="cart-summary">

          <h2>
            Order Summary
          </h2>

          <div className="summary-line">

            <span>
              Total Boxes
            </span>

            <strong>
              {totalBoxes}
            </strong>

          </div>

          <div className="summary-line">

            <span>
              Grand Total
            </span>

            <strong className="grand-total">
              ₹{grandTotal}
            </strong>

          </div>

          {/* PLACE ORDER */}

          <button
            type="button"
            className="place-order-button"
            onClick={goToPlaceOrder}
          >
            Place Order
          </button>

          {/* CONTINUE SHOPPING */}

          <Link
            to="/products"
            className="summary-shopping-button"
          >
            <FaShoppingCart />
            Continue Shopping
          </Link>

        </aside>

      </section>

    </main>
  );
}

export default Cart;