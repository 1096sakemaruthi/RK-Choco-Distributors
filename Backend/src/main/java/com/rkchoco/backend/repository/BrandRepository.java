package com.rkchoco.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.rkchoco.backend.model.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long> {

    Optional<Brand> findByNameIgnoreCase(String name);

    @Query(
        "SELECT COUNT(DISTINCT LOWER(TRIM(b.name))) " +
        "FROM Brand b " +
        "WHERE b.name IS NOT NULL AND TRIM(b.name) <> ''"
    )
    long countDistinctBrandNames();
}