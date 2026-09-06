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

import com.rkchoco.backend.model.Brand;
import com.rkchoco.backend.repository.BrandRepository;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "http://localhost:5173")
public class BrandController {

    private final BrandRepository brandRepository;

    public BrandController(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    // =========================================================
    // GET ALL BRANDS
    // =========================================================

    @GetMapping
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    // =========================================================
    // GET BRAND BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable Long id) {

        return brandRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================================================
    // ADD BRAND
    // =========================================================

    @PostMapping
    public Brand addBrand(@RequestBody Brand brand) {

        return brandRepository.save(brand);
    }

    // =========================================================
    // UPDATE BRAND
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Brand> updateBrand(
            @PathVariable Long id,
            @RequestBody Brand updatedBrand) {

        return brandRepository.findById(id)
                .map(existingBrand -> {

                    existingBrand.setName(updatedBrand.getName());
                    existingBrand.setDescription(updatedBrand.getDescription());
                    existingBrand.setImage(updatedBrand.getImage());

                    Brand savedBrand =
                            brandRepository.save(existingBrand);

                    return ResponseEntity.ok(savedBrand);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================================================
    // DELETE BRAND
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable Long id) {

        if (!brandRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        brandRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    // =========================================================
    // BRAND COUNT
    // =========================================================

    @GetMapping("/count")
    public long getBrandCount() {

        return brandRepository.count();
    }
}