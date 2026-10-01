package com.rkchoco.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.rkchoco.backend.model.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long> {

    /*
     * FIND ONE BRAND BY NAME
     * Case-insensitive
     */
    Optional<Brand> findByNameIgnoreCase(String name);

    /*
     * FIND ALL BRANDS WITH THE SAME NAME
     * Used to prevent duplicate brand records.
     */
    List<Brand> findAllByNameIgnoreCase(String name);

    /*
     * COUNT UNIQUE BRAND NAMES
     */
    @Query(
        "SELECT COUNT(DISTINCT LOWER(TRIM(b.name))) " +
        "FROM Brand b " +
        "WHERE b.name IS NOT NULL " +
        "AND TRIM(b.name) <> ''"
    )
    long countDistinctBrandNames();
}