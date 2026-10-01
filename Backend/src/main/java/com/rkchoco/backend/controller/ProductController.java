package com.rkchoco.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rkchoco.backend.model.Brand;
import com.rkchoco.backend.model.Product;
import com.rkchoco.backend.repository.BrandRepository;
import com.rkchoco.backend.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;

    public ProductController(
            ProductRepository productRepository,
            BrandRepository brandRepository) {

        this.productRepository = productRepository;
        this.brandRepository = brandRepository;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable Long id) {

        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /*
     * =====================================================
     * CREATE BRAND IF IT DOES NOT ALREADY EXIST
     * =====================================================
     */
    private void syncBrand(Product product) {

        if (product == null ||
                product.getBrand() == null ||
                product.getBrand().trim().isEmpty()) {

            return;
        }

        String brandName =
                product.getBrand().trim();

        /*
         * Case-insensitive duplicate check.
         *
         * Cadbury
         * cadbury
         * CADBURY
         *
         * These will be treated as the same brand.
         */
        boolean brandExists =
                brandRepository
                        .findByNameIgnoreCase(brandName)
                        .isPresent();

        if (brandExists) {
            return;
        }

        Brand brand = new Brand();

        brand.setName(brandName);

        /*
         * Product currently does not have a
         * description field.
         *
         * Therefore we keep brand description empty
         * instead of inventing product information.
         */
        brand.setDescription("");

        /*
         * Use the product image for the automatically
         * created brand image when available.
         */
        brand.setImage(
                product.getImage() == null
                        ? ""
                        : product.getImage()
        );

        brandRepository.save(brand);
    }

    @PostMapping
    public Product addProduct(
            @RequestBody Product product) {

        /*
         * Save product first.
         */
        Product savedProduct =
                productRepository.save(product);

        /*
         * Automatically create the brand
         * if it does not exist.
         */
        syncBrand(savedProduct);

        return savedProduct;
    }

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
                            productRepository.save(
                                    existingProduct
                            );

                    /*
                     * If the edited product uses a new brand,
                     * automatically create that brand.
                     *
                     * Existing old brands are NOT deleted.
                     */
                    syncBrand(savedProduct);

                    return ResponseEntity.ok(
                            savedProduct
                    );
                })
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id) {

        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        productRepository.deleteById(id);

        /*
         * Brand is intentionally NOT deleted.
         *
         * A brand may have other products or may have
         * been manually created from Manage Brands.
         */
        return ResponseEntity.noContent().build();
    }
}