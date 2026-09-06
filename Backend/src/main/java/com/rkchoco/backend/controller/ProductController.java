package com.rkchoco.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rkchoco.backend.model.Product;
import com.rkchoco.backend.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // =========================================================
    // GET ALL PRODUCTS
    // =========================================================

    @GetMapping
    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }

    // =========================================================
    // GET PRODUCT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable Long id) {

        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================================================
    // ADD NEW PRODUCT
    // =========================================================

    @PostMapping
    public Product addProduct(
            @RequestBody Product product) {

        return productRepository.save(product);
    }

    // =========================================================
    // UPDATE PRODUCT
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product updatedProduct) {

        return productRepository.findById(id)
                .map(existingProduct -> {

                    existingProduct.setName(
                            updatedProduct.getName()
                    );

                    existingProduct.setBrand(
                            updatedProduct.getBrand()
                    );

                    existingProduct.setPrice(
                            updatedProduct.getPrice()
                    );

                    existingProduct.setStock(
                            updatedProduct.getStock()
                    );

                    existingProduct.setImage(
                            updatedProduct.getImage()
                    );

                    Product savedProduct =
                            productRepository.save(existingProduct);

                    return ResponseEntity.ok(savedProduct);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id) {

        if (!productRepository.existsById(id)) {

            return ResponseEntity.notFound().build();
        }

        productRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}