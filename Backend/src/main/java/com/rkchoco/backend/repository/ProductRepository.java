package com.rkchoco.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rkchoco.backend.model.Product;

public interface ProductRepository
        extends JpaRepository<Product, Long> {

    /*
     * =====================================================
     * FIND PRODUCTS BY BRAND
     * =====================================================
     *
     * Used when:
     *
     * 1. Brand name is edited
     * 2. Products using that brand need to be updated
     */
    List<Product> findByBrandIgnoreCase(String brand);

    /*
     * =====================================================
     * CHECK WHETHER A BRAND IS STILL USED
     * =====================================================
     *
     * Used before deleting an automatically created brand.
     *
     * If count is 0:
     * No product is using that brand.
     */
    long countByBrandIgnoreCase(String brand);
}