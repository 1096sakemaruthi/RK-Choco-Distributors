package com.rkchoco.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin")
public class Admin {

    /* =====================================================
       ADMIN ID
       ===================================================== */

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* =====================================================
       USERNAME
       ===================================================== */

    @Column(nullable = false, unique = true)
    private String username;

    /* =====================================================
       EMAIL
       ===================================================== */

    @Column(nullable = false, unique = true)
    private String email;

    /* =====================================================
       PASSWORD
       ===================================================== */

    @Column(nullable = false)
    private String password;

    /* =====================================================
       STATUS
       ===================================================== */

    private String status;

    /* =====================================================
       DEFAULT CONSTRUCTOR
       ===================================================== */

    public Admin() {
    }

    /* =====================================================
       ID
       ===================================================== */

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    /* =====================================================
       USERNAME
       ===================================================== */

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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
}