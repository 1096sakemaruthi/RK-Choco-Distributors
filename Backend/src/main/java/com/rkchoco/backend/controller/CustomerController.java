package com.rkchoco.backend.controller;

import java.time.LocalDateTime;
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

import com.rkchoco.backend.model.Customer;
import com.rkchoco.backend.repository.CustomerRepository;

@RestController
@RequestMapping("/api/customers")
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
public class CustomerController {

    private final CustomerRepository customerRepository;

    public CustomerController(
        CustomerRepository customerRepository
    ) {
        this.customerRepository = customerRepository;
    }


    /* =====================================================
       REGISTER CUSTOMER
       ===================================================== */

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(
        @RequestBody Customer customer
    ) {

        if (
            customer.getFullName() == null ||
            customer.getFullName().trim().isEmpty() ||
            customer.getMobileNumber() == null ||
            customer.getMobileNumber().trim().isEmpty() ||
            customer.getEmail() == null ||
            customer.getEmail().trim().isEmpty() ||
            customer.getAddress() == null ||
            customer.getAddress().trim().isEmpty() ||
            customer.getPassword() == null ||
            customer.getPassword().isEmpty()
        ) {

            return ResponseEntity.badRequest()
                .body("Please fill in all customer details.");
        }


        if (
            customerRepository
                .findByEmail(customer.getEmail().trim())
                .isPresent()
        ) {

            return ResponseEntity.badRequest()
                .body("This email is already registered.");
        }


        if (
            customerRepository
                .findByMobileNumber(
                    customer.getMobileNumber().trim()
                )
                .isPresent()
        ) {

            return ResponseEntity.badRequest()
                .body("This mobile number is already registered.");
        }


        customer.setCustomerId(
            "CUS-" + System.currentTimeMillis()
        );


        customer.setFullName(
            customer.getFullName().trim()
        );


        customer.setMobileNumber(
            customer.getMobileNumber().trim()
        );


        customer.setEmail(
            customer.getEmail().trim()
        );


        customer.setAddress(
            customer.getAddress().trim()
        );


        customer.setStatus("active");


        customer.setRegisteredAt(
            LocalDateTime.now().toString()
        );


        Customer savedCustomer =
            customerRepository.save(customer);


        return ResponseEntity.ok(savedCustomer);
    }


    /* =====================================================
       CUSTOMER LOGIN
       ===================================================== */

    @PostMapping("/login")
    public ResponseEntity<?> loginCustomer(
        @RequestBody Customer loginCustomer
    ) {

        if (
            loginCustomer.getEmail() == null ||
            loginCustomer.getEmail().trim().isEmpty() ||
            loginCustomer.getPassword() == null ||
            loginCustomer.getPassword().isEmpty()
        ) {

            return ResponseEntity.badRequest()
                .body("Please enter email and password.");
        }


        Customer customer =
            customerRepository
                .findByEmail(
                    loginCustomer.getEmail().trim()
                )
                .orElse(null);


        if (customer == null) {

            return ResponseEntity
                .badRequest()
                .body(
                    "No registered account found with this email."
                );
        }


        if (
            !customer.getPassword()
                .equals(loginCustomer.getPassword())
        ) {

            return ResponseEntity
                .badRequest()
                .body(
                    "Incorrect email or password."
                );
        }


        if (
            customer.getStatus() != null &&
            customer.getStatus()
                .equalsIgnoreCase("inactive")
        ) {

            return ResponseEntity
                .badRequest()
                .body(
                    "Your account is inactive. Please contact us."
                );
        }


        return ResponseEntity.ok(customer);
    }


    /* =====================================================
       GET CUSTOMER BY MOBILE NUMBER
       ===================================================== */

    @GetMapping("/mobile/{mobileNumber}")
    public ResponseEntity<Customer> getCustomerByMobile(
        @PathVariable String mobileNumber
    ) {

        return customerRepository
            .findByMobileNumber(mobileNumber)
            .map(ResponseEntity::ok)
            .orElseGet(
                () -> ResponseEntity
                    .notFound()
                    .build()
            );
    }


    /* =====================================================
       GET CUSTOMER BY EMAIL
       ===================================================== */

    @GetMapping("/email/{email}")
    public ResponseEntity<Customer> getCustomerByEmail(
        @PathVariable String email
    ) {

        return customerRepository
            .findByEmail(email)
            .map(ResponseEntity::ok)
            .orElseGet(
                () -> ResponseEntity
                    .notFound()
                    .build()
            );
    }


    /* =====================================================
       GET ALL CUSTOMERS
       ===================================================== */

    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {

        return ResponseEntity.ok(
            customerRepository.findAll()
        );
    }


    /* =====================================================
       UPDATE CUSTOMER PROFILE
       ===================================================== */

    @PutMapping("/{customerId}")
    public ResponseEntity<?> updateCustomerProfile(
        @PathVariable String customerId,
        @RequestBody Customer updatedCustomer
    ) {

        return customerRepository
            .findById(customerId)
            .map(existingCustomer -> {

                if (
                    updatedCustomer.getFullName() != null &&
                    !updatedCustomer.getFullName()
                        .trim()
                        .isEmpty()
                ) {

                    existingCustomer.setFullName(
                        updatedCustomer
                            .getFullName()
                            .trim()
                    );
                }


                if (
                    updatedCustomer.getMobileNumber() != null &&
                    !updatedCustomer.getMobileNumber()
                        .trim()
                        .isEmpty()
                ) {

                    existingCustomer.setMobileNumber(
                        updatedCustomer
                            .getMobileNumber()
                            .trim()
                    );
                }


                if (
                    updatedCustomer.getEmail() != null &&
                    !updatedCustomer.getEmail()
                        .trim()
                        .isEmpty()
                ) {

                    existingCustomer.setEmail(
                        updatedCustomer
                            .getEmail()
                            .trim()
                    );
                }


                if (
                    updatedCustomer.getAddress() != null &&
                    !updatedCustomer.getAddress()
                        .trim()
                        .isEmpty()
                ) {

                    existingCustomer.setAddress(
                        updatedCustomer
                            .getAddress()
                            .trim()
                    );
                }


                Customer savedCustomer =
                    customerRepository.save(
                        existingCustomer
                    );


                return ResponseEntity.ok(
                    savedCustomer
                );

            })
            .orElseGet(
                () -> ResponseEntity
                    .notFound()
                    .build()
            );
    }


    /* =====================================================
       UPDATE CUSTOMER STATUS
       ===================================================== */

    @PutMapping("/{customerId}/status")
    public ResponseEntity<Customer> updateCustomerStatus(
        @PathVariable String customerId,
        @RequestBody Customer updatedCustomer
    ) {

        return customerRepository
            .findById(customerId)
            .map(existingCustomer -> {

                existingCustomer.setStatus(
                    updatedCustomer.getStatus()
                );


                Customer savedCustomer =
                    customerRepository.save(
                        existingCustomer
                    );


                return ResponseEntity.ok(
                    savedCustomer
                );

            })
            .orElseGet(
                () -> ResponseEntity
                    .notFound()
                    .build()
            );
    }


    /* =====================================================
       DELETE CUSTOMER
       ===================================================== */

    @DeleteMapping("/{customerId}")
    public ResponseEntity<Void> deleteCustomer(
        @PathVariable String customerId
    ) {

        if (
            !customerRepository.existsById(customerId)
        ) {

            return ResponseEntity
                .notFound()
                .build();
        }


        customerRepository.deleteById(
            customerId
        );


        return ResponseEntity
            .noContent()
            .build();
    }

}