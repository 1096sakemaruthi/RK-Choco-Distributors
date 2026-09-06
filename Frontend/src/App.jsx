import React from "react";

import {
  Routes,
  Route,
} from "react-router-dom";

// =================================================
// CUSTOMER PAGES
// =================================================

import Home from "./pages/Home";
import Products from "./pages/Products";
import Brands from "./pages/Brands";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/PlaceOrder";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";

// =================================================
// ADMIN PAGES
// =================================================

import AdminLogin from "./pages/AdminLogin";
import AdminForgotPassword from "./pages/AdminForgotPassword";
import AdminResetPassword from "./pages/AdminResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import ManageProducts from "./pages/ManageProducts";
import ManageBrands from "./pages/ManageBrands";
import ManageCustomers from "./pages/ManageCustomers";
import ManageOrders from "./pages/ManageOrders";
import Reports from "./pages/Reports";

// =================================================
// COMPONENTS
// =================================================

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// =================================================
// APP
// =================================================

function App() {
  return (
    <Routes>

      {/* =================================================
          CUSTOMER HOME
      ================================================= */}

      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        }
      />


      {/* =================================================
          CUSTOMER LOGIN
      ================================================= */}

      <Route
        path="/login"
        element={<Login />}
      />


      {/* =================================================
          CUSTOMER REGISTER
      ================================================= */}

      <Route
        path="/register"
        element={<Register />}
      />


      {/* =================================================
          CUSTOMER FORGOT PASSWORD
      ================================================= */}

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />


      {/* =================================================
          CUSTOMER RESET PASSWORD
      ================================================= */}

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* =================================================
          CUSTOMER PROFILE
          NO FOOTER
      ================================================= */}

      <Route
        path="/profile"
        element={
          <>
            <Navbar />
            <Profile />
          </>
        }
      />


      {/* =================================================
          CUSTOMER PRODUCTS
      ================================================= */}

      <Route
        path="/products"
        element={<Products />}
      />


      {/* =================================================
          CUSTOMER BRANDS
      ================================================= */}

      <Route
        path="/brands"
        element={<Brands />}
      />


      {/* =================================================
          CUSTOMER CART
      ================================================= */}

      <Route
        path="/cart"
        element={<Cart />}
      />


      {/* =================================================
          CUSTOMER PLACE ORDER
      ================================================= */}

      <Route
        path="/place-order"
        element={<PlaceOrder />}
      />


      {/* =================================================
          CUSTOMER ORDER SUCCESS
      ================================================= */}

      <Route
        path="/order-success"
        element={<OrderSuccess />}
      />


      {/* =================================================
          CUSTOMER ORDERS
      ================================================= */}

      <Route
        path="/orders"
        element={<Orders />}
      />


      {/* =================================================
          CUSTOMER ORDER DETAILS / ORDER ID
          SUPPORTS:
          /orders/ORD-123456
      ================================================= */}

      <Route
        path="/orders/:orderId"
        element={<Orders />}
      />


      {/* =================================================
          ADMIN LOGIN
      ================================================= */}

      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />


      {/* =================================================
          ADMIN FORGOT PASSWORD
      ================================================= */}

      <Route
        path="/admin-forgot-password"
        element={<AdminForgotPassword />}
      />


      {/* =================================================
          ADMIN RESET PASSWORD
      ================================================= */}

      <Route
        path="/admin-reset-password"
        element={<AdminResetPassword />}
      />


      {/* =================================================
          ADMIN DASHBOARD
      ================================================= */}

      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />


      {/* =================================================
          ADMIN MANAGE PRODUCTS
      ================================================= */}

      <Route
        path="/manage-products"
        element={<ManageProducts />}
      />


      {/* =================================================
          ADMIN MANAGE BRANDS
      ================================================= */}

      <Route
        path="/manage-brands"
        element={<ManageBrands />}
      />


      {/* =================================================
          ADMIN MANAGE CUSTOMERS
      ================================================= */}

      <Route
        path="/manage-customers"
        element={<ManageCustomers />}
      />


      {/* =================================================
          ADMIN MANAGE ORDERS
      ================================================= */}

      <Route
        path="/manage-orders"
        element={<ManageOrders />}
      />


      {/* =================================================
          ADMIN REPORTS
      ================================================= */}

      <Route
        path="/reports"
        element={<Reports />}
      />

    </Routes>
  );
}

export default App;