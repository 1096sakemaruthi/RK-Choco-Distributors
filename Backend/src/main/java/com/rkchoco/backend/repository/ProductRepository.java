package com.rkchoco.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rkchoco.backend.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}