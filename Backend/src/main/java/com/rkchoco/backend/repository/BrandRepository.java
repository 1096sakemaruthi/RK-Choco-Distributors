package com.rkchoco.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rkchoco.backend.model.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long> {
}