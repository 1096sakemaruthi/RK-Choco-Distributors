package com.rkchoco.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String brand;

    private double price;

    private int stock;

    @Lob
    private String image;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public Product() {
    }

    // =========================================================
    // GET ID
    // =========================================================

    public Long getId() {
        return id;
    }

    // =========================================================
    // SET ID
    // =========================================================

    public void setId(Long id) {
        this.id = id;
    }

    // =========================================================
    // GET NAME
    // =========================================================

    public String getName() {
        return name;
    }

    // =========================================================
    // SET NAME
    // =========================================================

    public void setName(String name) {
        this.name = name;
    }

    // =========================================================
    // GET BRAND
    // =========================================================

    public String getBrand() {
        return brand;
    }

    // =========================================================
    // SET BRAND
    // =========================================================

    public void setBrand(String brand) {
        this.brand = brand;
    }

    // =========================================================
    // GET PRICE
    // =========================================================

    public double getPrice() {
        return price;
    }

    // =========================================================
    // SET PRICE
    // =========================================================

    public void setPrice(double price) {
        this.price = price;
    }

    // =========================================================
    // GET STOCK
    // =========================================================

    public int getStock() {
        return stock;
    }

    // =========================================================
    // SET STOCK
    // =========================================================

    public void setStock(int stock) {
        this.stock = stock;
    }

    // =========================================================
    // GET IMAGE
    // =========================================================

    public String getImage() {
        return image;
    }

    // =========================================================
    // SET IMAGE
    // =========================================================

    public void setImage(String image) {
        this.image = image;
    }
}