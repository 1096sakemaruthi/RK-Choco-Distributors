import {
  FaHome,
  FaShoppingBag,
  FaTags,
  FaClipboardList,
  FaUser,
  FaUserPlus,
  FaQuestionCircle,
  FaLock,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaArrowRight,
} from "react-icons/fa";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      {/* ================= COMPANY ================= */}

      <div className="footer-container">

        <div className="footer-brand">

          <h2>
            RK Choco
          </h2>

          <p className="footer-tagline">
            Premium Chocolate Distributor
          </p>

          <p className="footer-description">
            Delivering quality chocolates to shops
            with trust, care and fast service.
          </p>


          {/* SOCIAL ICONS */}

          <div className="footer-social">

            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>

            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>

            <a href="#" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>

          </div>

        </div>


        {/* ================= QUICK LINKS ================= */}

        <div className="footer-column">

          <h3>
            Quick Links
          </h3>

          <a href="/">
            <FaHome />
            <span>Home</span>
          </a>

          <a href="/products">
            <FaShoppingBag />
            <span>Products</span>
          </a>

          <a href="/brands">
            <FaTags />
            <span>Brands</span>
          </a>

          <a href="/orders">
            <FaClipboardList />
            <span>Orders</span>
          </a>

        </div>


        {/* ================= ACCOUNT ================= */}

        <div className="footer-column">

          <h3>
            Account
          </h3>

          <a href="/login">
            <FaUser />
            <span>Login</span>
          </a>

          <a href="/register">
            <FaUserPlus />
            <span>Register</span>
          </a>

          <a href="#">
            <FaQuestionCircle />
            <span>Help Center</span>
          </a>

          <a href="#">
            <FaLock />
            <span>Privacy Policy</span>
          </a>

        </div>


        {/* ================= CONTACT ================= */}

        <div className="footer-column footer-contact">

          <h3>
            Contact Us
          </h3>

          <p>
            <FaPhoneAlt />
            <span>
              +91 8885676414
            </span>
          </p>

          <p>
            <FaEnvelope />
            <span>
              rkchoco@example.com
            </span>
          </p>

          <p>
            <FaMapMarkerAlt />
            <span>
              Andhra Pradesh, India
            </span>
          </p>

        </div>

      </div>


      {/* ================= BOTTOM ================= */}

      <div className="footer-bottom">

        <p>
          © 2026 RK Choco Distributors.
          All Rights Reserved.
        </p>

        <a href="/products">
          Explore Products
          <FaArrowRight />
        </a>

      </div>

    </footer>
  );
}

export default Footer;