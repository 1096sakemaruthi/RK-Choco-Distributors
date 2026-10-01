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
     * FIND OR CREATE BRAND
     * =====================================================
     */
    private Brand findOrCreateBrand(Product product) {

        if (product == null ||
                product.getBrand() == null ||
                product.getBrand().trim().isEmpty()) {

            return null;
        }

        String brandName =
                product.getBrand().trim();

        /*
         * Find existing brand without case-sensitive
         * duplicate creation.
         */
        Brand brand =
                brandRepository
                        .findByNameIgnoreCase(brandName)
                        .orElse(null);

        /*
         * If brand does not exist, create it.
         */
        if (brand == null) {

            brand = new Brand();

            brand.setName(brandName);

            brand.setDescription(
                    product.getDescription() == null
                            ? ""
                            : product.getDescription()
            );

            brand.setImage(
                    product.getImage() == null
                            ? ""
                            : product.getImage()
            );

            return brandRepository.save(brand);
        }

        return brand;
    }

    /*
     * =====================================================
     * UPDATE BRAND FROM PRODUCT
     * =====================================================
     *
     * When a product is edited:
     *
     * Product description
     *        ↓
     * Brand description
     *
     * Product image
     *        ↓
     * Brand image
     *
     * Only the existing related brand is updated.
     */
    private void syncBrandFromProduct(Product product) {

        Brand brand = findOrCreateBrand(product);

        if (brand == null) {
            return;
        }

        /*
         * Update description from product.
         */
        brand.setDescription(
                product.getDescription() == null
                        ? ""
                        : product.getDescription()
        );

        /*
         * Update image from product when available.
         */
        if (product.getImage() != null &&
                !product.getImage().trim().isEmpty()) {

            brand.setImage(
                    product.getImage()
            );
        }

        brandRepository.save(brand);
    }

    /*
     * =====================================================
     * CREATE PRODUCT
     * =====================================================
     */
    @PostMapping
    public Product addProduct(
            @RequestBody Product product) {

        /*
         * Save product first.
         */
        Product savedProduct =
                productRepository.save(product);

        /*
         * Create brand if required,
         * or use the existing brand.
         */
        syncBrandFromProduct(savedProduct);

        return savedProduct;
    }

    /*
     * =====================================================
     * UPDATE PRODUCT
     * =====================================================
     */
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product updatedProduct) {

        return productRepository.findById(id)
                .map(existingProduct -> {

                    /*
                     * Store old brand before changing it.
                     */
                    String oldBrand =
                            existingProduct.getBrand();

                    /*
                     * Update product fields.
                     */
                    existingProduct.setName(
                            updatedProduct.getName()
                    );

                    existingProduct.setBrand(
                            updatedProduct.getBrand()
                    );

                    existingProduct.setDescription(
                            updatedProduct.getDescription()
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
                     * Create/reuse the new brand and
                     * synchronize product description.
                     */
                    syncBrandFromProduct(
                            savedProduct
                    );

                    /*
                     * If the product changed from one brand
                     * to another, check whether the old brand
                     * is still being used.
                     *
                     * If no product uses it anymore, remove
                     * the old automatically synchronized brand.
                     */
                    String newBrand =
                            savedProduct.getBrand();

                    if (oldBrand != null &&
                            !oldBrand.trim().isEmpty() &&
                            (newBrand == null ||
                             !oldBrand.trim()
                                    .equalsIgnoreCase(
                                            newBrand.trim()
                                    ))) {

                        deleteBrandIfUnused(
                                oldBrand
                        );
                    }

                    return ResponseEntity.ok(
                            savedProduct
                    );
                })
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    /*
     * =====================================================
     * DELETE PRODUCT
     * =====================================================
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id) {

        Product existingProduct =
                productRepository.findById(id)
                        .orElse(null);

        if (existingProduct == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        /*
         * Store brand before deleting product.
         */
        String brandName =
                existingProduct.getBrand();

        /*
         * Delete product.
         */
        productRepository.deleteById(id);

        /*
         * If no product uses this brand anymore,
         * remove the brand from Manage Brands.
         */
        deleteBrandIfUnused(
                brandName
        );

        return ResponseEntity
                .noContent()
                .build();
    }

    /*
     * =====================================================
     * DELETE BRAND IF NO PRODUCT USES IT
     * =====================================================
     */
    private void deleteBrandIfUnused(
            String brandName) {

        if (brandName == null ||
                brandName.trim().isEmpty()) {

            return;
        }

        String cleanBrandName =
                brandName.trim();

        long productCount =
                productRepository
                        .countByBrandIgnoreCase(
                                cleanBrandName
                        );

        /*
         * Do not delete a brand that is still
         * being used by another product.
         */
        if (productCount > 0) {
            return;
        }

        /*
         * Delete the brand only when it exists.
         */
        brandRepository
                .findByNameIgnoreCase(
                        cleanBrandName
                )
                .ifPresent(
                        brandRepository::delete
                );
    }
}