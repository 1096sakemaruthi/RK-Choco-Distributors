package com.rkchoco.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@RequestMapping("/api/brands")
@CrossOrigin(origins = "http://localhost:5173")
public class BrandController {

    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;

    public BrandController(
            BrandRepository brandRepository,
            ProductRepository productRepository) {

        this.brandRepository = brandRepository;
        this.productRepository = productRepository;
    }

    /*
     * =====================================================
     * GET ALL BRANDS
     * =====================================================
     */
    @GetMapping
    public List<Brand> getAllBrands() {

        return brandRepository.findAll();
    }

    /*
     * =====================================================
     * GET BRAND BY ID
     * =====================================================
     */
    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(
            @PathVariable Long id) {

        return brandRepository
                .findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    /*
     * =====================================================
     * ADD BRAND
     * =====================================================
     *
     * If the same brand already exists,
     * update that existing brand instead of
     * creating a duplicate.
     */
    @PostMapping
    public Brand addBrand(
            @RequestBody Brand brand) {

        String brandName =
                brand.getName() == null
                        ? ""
                        : brand.getName().trim();

        /*
         * Check whether the brand already exists.
         */
        Brand existingBrand =
                brandRepository
                        .findByNameIgnoreCase(
                                brandName
                        )
                        .orElse(null);

        /*
         * Existing brand found:
         * update it instead of creating duplicate.
         */
        if (existingBrand != null) {

            existingBrand.setName(
                    brandName
            );

            existingBrand.setDescription(
                    brand.getDescription()
            );

            existingBrand.setImage(
                    brand.getImage()
            );

            return brandRepository.save(
                    existingBrand
            );
        }

        /*
         * New brand.
         */
        brand.setName(brandName);

        return brandRepository.save(
                brand
        );
    }

    /*
     * =====================================================
     * UPDATE BRAND
     * =====================================================
     *
     * Important:
     * When brand name changes,
     * all products using the old brand
     * will also get the new brand name.
     */
    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Brand> updateBrand(
            @PathVariable Long id,
            @RequestBody Brand updatedBrand) {

        return brandRepository
                .findById(id)
                .map(existingBrand -> {

                    String oldBrandName =
                            existingBrand.getName();

                    String newBrandName =
                            updatedBrand.getName() == null
                                    ? ""
                                    : updatedBrand
                                            .getName()
                                            .trim();

                    /*
                     * Update all products when
                     * the brand name changes.
                     */
                    if (oldBrandName != null &&
                            !oldBrandName
                                    .trim()
                                    .equalsIgnoreCase(
                                            newBrandName
                                    )) {

                        List<Product> products =
                                productRepository
                                        .findByBrandIgnoreCase(
                                                oldBrandName
                                        );

                        for (Product product :
                                products) {

                            product.setBrand(
                                    newBrandName
                            );
                        }

                        productRepository.saveAll(
                                products
                        );
                    }

                    /*
                     * Update existing brand itself.
                     */
                    existingBrand.setName(
                            newBrandName
                    );

                    existingBrand.setDescription(
                            updatedBrand.getDescription()
                    );

                    existingBrand.setImage(
                            updatedBrand.getImage()
                    );

                    Brand savedBrand =
                            brandRepository.save(
                                    existingBrand
                            );

                    return ResponseEntity.ok(
                            savedBrand
                    );
                })
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    /*
     * =====================================================
     * DELETE BRAND
     * =====================================================
     *
     * Brand is deleted from Manage Brands /
     * Customer Brands.
     *
     * Products are NOT deleted.
     * Their brand field is cleared so that
     * old brand data does not remain.
     */
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteBrand(
            @PathVariable Long id) {

        Brand existingBrand =
                brandRepository
                        .findById(id)
                        .orElse(null);

        if (existingBrand == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        String brandName =
                existingBrand.getName();

        /*
         * Find products using this brand.
         */
        if (brandName != null &&
                !brandName.trim().isEmpty()) {

            List<Product> products =
                    productRepository
                            .findByBrandIgnoreCase(
                                    brandName
                            );

            /*
             * Keep products, but remove
             * the deleted brand reference.
             */
            for (Product product :
                    products) {

                product.setBrand("");
            }

            productRepository.saveAll(
                    products
            );
        }

        /*
         * Delete the brand.
         */
        brandRepository.delete(
                existingBrand
        );

        return ResponseEntity
                .noContent()
                .build();
    }

    /*
     * =====================================================
     * BRAND COUNT
     * =====================================================
     */
    @GetMapping("/count")
    public long getBrandCount() {

        return brandRepository
                .countDistinctBrandNames();
    }
}