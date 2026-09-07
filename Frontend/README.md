# 🍫 RK Choco Distributors

## Chocolate Distribution Management System

A full-stack web application developed for managing chocolate distribution business operations through a modern Customer Portal and Admin Portal.

---

## 📌 Project Overview

**RK Choco Distributors** is a Chocolate Distribution Management System developed using **React.js, Spring Boot, and MySQL**.

The system helps customers browse chocolates, place orders, manage their profiles, and track their orders.

The Admin Portal allows administrators to manage products, brands, customers, orders, dashboard statistics, and reports.

---

## ✨ Features

### 👤 Customer Portal

- Customer Registration
- Customer Login
- Customer Profile Management
- Browse Products
- Browse Brands
- Shopping Cart
- Place Orders
- Order Success
- View Orders
- View Order Details
- Cancel Orders
- Track Order Status
- Forgot Password
- OTP Verification
- Reset Password

### 🛠️ Admin Portal

- Admin Login
- Admin Dashboard
- Dashboard Statistics
- Product Management
- Add Products
- Edit Products
- Delete Products
- Brand Management
- Add Brands
- Edit Brands
- Delete Brands
- Customer Management
- View Customers
- Update Customer Information
- Manage Customer Status
- Delete Customers
- Order Management
- View Orders
- View Order Details
- Update Order Status
- Delete Orders
- Reports
- Admin Forgot Password
- Admin Password Reset

---

## 🧰 Technologies Used

### Frontend

- React.js
- Vite
- React Router
- Axios
- React Icons
- HTML5
- CSS3
- JavaScript

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- REST API
- Maven
- Spring Mail

### Database

- MySQL

---

## 🏗️ System Architecture

```text
                 ┌─────────────────────┐
                 │      Customer       │
                 │       / Admin       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   React Frontend    │
                 │       + Vite        │
                 └──────────┬──────────┘
                            │
                       REST API
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Spring Boot       │
                 │      Backend        │
                 └──────────┬──────────┘
                            │
                       JPA / Hibernate
                            │
                            ▼
                 ┌─────────────────────┐
                 │       MySQL         │
                 │      Database       │
                 └─────────────────────┘