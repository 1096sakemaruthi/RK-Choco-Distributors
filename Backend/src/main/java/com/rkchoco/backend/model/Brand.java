package com.rkchoco.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "brands")
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @Lob
    private String image;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public Brand() {
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
    // GET DESCRIPTION
    // =========================================================

    public String getDescription() {
        return description;
    }

    // =========================================================
    // SET DESCRIPTION
    // =========================================================

    public void setDescription(String description) {
        this.description = description;
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