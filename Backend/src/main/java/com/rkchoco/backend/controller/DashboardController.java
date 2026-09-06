package com.rkchoco.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rkchoco.backend.repository.CustomerRepository;
import com.rkchoco.backend.repository.ProductRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:5176",
        "http://127.0.0.1:5177",
        "http://127.0.0.1:5178"
    }
)
public class DashboardController {

    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public DashboardController(
        ProductRepository productRepository,
        CustomerRepository customerRepository
    ) {
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {

        long totalProducts = productRepository.count();

        long totalCustomers = customerRepository.count();

        Long totalOrders = ((Number) entityManager
            .createNativeQuery("SELECT COUNT(*) FROM orders")
            .getSingleResult())
            .longValue();

        Long totalBrands = ((Number) entityManager
            .createNativeQuery(
                "SELECT COUNT(DISTINCT brand) FROM product"
            )
            .getSingleResult())
            .longValue();

        Map<String, Long> stats = new HashMap<>();

        stats.put("totalProducts", totalProducts);
        stats.put("totalCustomers", totalCustomers);
        stats.put("totalOrders", totalOrders);
        stats.put("totalBrands", totalBrands);

        return ResponseEntity.ok(stats);
    }
}