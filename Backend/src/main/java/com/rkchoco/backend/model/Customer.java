package com.rkchoco.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "customers")
public class Customer {

    /* =====================================================
       CUSTOMER ID
       ===================================================== */

    @Id
    @Column(name = "customer_id", nullable = false, unique = true)
    private String customerId;

    /* =====================================================
       CUSTOMER DETAILS
       ===================================================== */

    private String fullName;

    private String mobileNumber;

    private String email;

    @Column(length = 1000)
    private String address;

    /* =====================================================
       PASSWORD
       ===================================================== */

    private String password;

    /* =====================================================
       STATUS
       ===================================================== */

    private String status;

    /* =====================================================
       REGISTERED AT
       ===================================================== */

    private String registeredAt;

    /* =====================================================
       DEFAULT CONSTRUCTOR
       ===================================================== */

    public Customer() {
    }

    /* =====================================================
       CUSTOMER ID
       ===================================================== */

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    /* =====================================================
       FULL NAME
       ===================================================== */

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    /* =====================================================
       MOBILE NUMBER
       ===================================================== */

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    /* =====================================================
       EMAIL
       ===================================================== */

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    /* =====================================================
       ADDRESS
       ===================================================== */

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    /* =====================================================
       PASSWORD
       ===================================================== */

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    /* =====================================================
       STATUS
       ===================================================== */

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    /* =====================================================
       REGISTERED AT
       ===================================================== */

    public String getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(String registeredAt) {
        this.registeredAt = registeredAt;
    }
}