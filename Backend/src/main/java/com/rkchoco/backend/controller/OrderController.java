package com.rkchoco.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rkchoco.backend.model.Order;
import com.rkchoco.backend.model.Product;
import com.rkchoco.backend.repository.OrderRepository;
import com.rkchoco.backend.repository.ProductRepository;

@RestController
@RequestMapping("/api/orders")
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
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    public OrderController(
            OrderRepository orderRepository,
            ProductRepository productRepository
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    // =====================================================
    // CREATE ORDER
    // =====================================================

    @PostMapping
    @Transactional
    public ResponseEntity<?> createOrder(
            @RequestBody Order order
    ) {

        // =================================================
        // GENERATE ORDER ID
        // =================================================

        if (
            order.getOrderId() == null ||
            order.getOrderId().trim().isEmpty()
        ) {

            String orderId =
                "ORD-" +
                System.currentTimeMillis() +
                "-" +
                UUID.randomUUID()
                    .toString()
                    .substring(0, 4)
                    .toUpperCase();

            order.setOrderId(orderId);
        }

        // =================================================
        // DEFAULT STATUS
        // =================================================

        if (
            order.getStatus() == null ||
            order.getStatus().trim().isEmpty()
        ) {

            order.setStatus("Pending");
        }

        // =================================================
        // CREATED DATE / TIME
        // =================================================

        if (
            order.getCreatedAt() == null ||
            order.getCreatedAt().trim().isEmpty()
        ) {

            order.setCreatedAt(
                LocalDateTime.now().toString()
            );
        }

        // =================================================
        // CHECK AND DEDUCT PRODUCT STOCK
        // =================================================

        try {

            if (
                order.getItems() == null ||
                order.getItems().trim().isEmpty()
            ) {

                return ResponseEntity
                    .badRequest()
                    .body(
                        "Order items are required."
                    );
            }

            JsonNode itemsNode =
                objectMapper.readTree(
                    order.getItems()
                );

            if (
                !itemsNode.isArray() ||
                itemsNode.size() == 0
            ) {

                return ResponseEntity
                    .badRequest()
                    .body(
                        "Order items are empty."
                    );
            }

            // =================================================
            // FIRST CHECK ALL STOCK
            // =================================================

            for (JsonNode item : itemsNode) {

                Long productId =
                    getProductId(item);

                int quantity =
                    getQuantity(item);

                if (productId == null) {

                    return ResponseEntity
                        .badRequest()
                        .body(
                            "Product ID is missing in order items."
                        );
                }

                if (quantity <= 0) {

                    return ResponseEntity
                        .badRequest()
                        .body(
                            "Invalid product quantity."
                        );
                }

                Product product =
                    productRepository
                        .findById(productId)
                        .orElse(null);

                if (product == null) {

                    return ResponseEntity
                        .badRequest()
                        .body(
                            "Product not found: " +
                            productId
                        );
                }

                // =================================================
                // STOCK CHECK
                // =================================================

                if (
                    product.getStock() < quantity
                ) {

                    return ResponseEntity
                        .badRequest()
                        .body(
                            "Insufficient stock for product: " +
                            product.getName() +
                            ". Available stock: " +
                            product.getStock()
                        );
                }
            }

            // =================================================
            // SAVE ORDER
            // =================================================

            Order savedOrder =
                orderRepository.save(order);

            // =================================================
            // DEDUCT STOCK
            // =================================================

            for (JsonNode item : itemsNode) {

                Long productId =
                    getProductId(item);

                int quantity =
                    getQuantity(item);

                Product product =
                    productRepository
                        .findById(productId)
                        .orElse(null);

                if (product != null) {

                    int newStock =
                        product.getStock() - quantity;

                    product.setStock(newStock);

                    productRepository.save(product);
                }
            }

            return ResponseEntity.ok(
                savedOrder
            );

        } catch (Exception e) {

            return ResponseEntity
                .badRequest()
                .body(
                    "Unable to process order items."
                );
        }
    }

    // =====================================================
    // GET PRODUCT ID FROM ORDER ITEM
    // =====================================================

    private Long getProductId(
            JsonNode item
    ) {

        JsonNode idNode =
            item.get("id");

        if (
            idNode == null ||
            idNode.isNull()
        ) {

            idNode =
                item.get("productId");
        }

        if (
            idNode == null ||
            idNode.isNull()
        ) {

            return null;
        }

        try {

            return idNode.asLong();

        } catch (Exception e) {

            return null;
        }
    }

    // =====================================================
    // GET QUANTITY FROM ORDER ITEM
    // =====================================================

    private int getQuantity(
            JsonNode item
    ) {

        JsonNode quantityNode =
            item.get("quantity");

        if (
            quantityNode == null ||
            quantityNode.isNull()
        ) {

            return 0;
        }

        try {

            return quantityNode.asInt();

        } catch (Exception e) {

            return 0;
        }
    }

    // =====================================================
    // GET CUSTOMER ORDERS
    // =====================================================

    @GetMapping("/customer/{mobileNumber}")
    public ResponseEntity<List<Order>> getCustomerOrders(
            @PathVariable String mobileNumber
    ) {

        List<Order> orders =
            orderRepository
                .findAllByMobileNumberOrderByCreatedAtDesc(
                    mobileNumber
                );

        return ResponseEntity.ok(orders);
    }

    // =====================================================
    // GET ALL ORDERS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {

        return ResponseEntity.ok(
            orderRepository.findAll()
        );
    }

    // =====================================================
    // GET ONE ORDER
    // =====================================================

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrder(
            @PathVariable String orderId
    ) {

        return orderRepository
            .findByOrderId(orderId)
            .map(ResponseEntity::ok)
            .orElseGet(
                () -> ResponseEntity
                    .notFound()
                    .build()
            );
    }

    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> request
    ) {

        String newStatus =
            request.get("status");

        if (
            newStatus == null ||
            newStatus.trim().isEmpty()
        ) {

            return ResponseEntity
                .badRequest()
                .body(
                    "Order status is required."
                );
        }

        String finalStatus =
            newStatus.trim();

        return orderRepository
            .findByOrderId(orderId)
            .map(order -> {

                order.setStatus(finalStatus);

                if (
                    finalStatus.equalsIgnoreCase(
                        "Cancelled"
                    )
                ) {

                    order.setCancelledAt(
                        LocalDateTime
                            .now()
                            .toString()
                    );

                } else {

                    order.setCancelledAt(null);
                }

                Order updatedOrder =
                    orderRepository.save(order);

                return ResponseEntity.ok(
                    updatedOrder
                );

            })
            .orElseGet(
                () -> ResponseEntity
                    .notFound()
                    .build()
            );
    }

    // =====================================================
    // CANCEL ORDER
    // =====================================================

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable String orderId
    ) {

        return orderRepository
            .findByOrderId(orderId)
            .map(order -> {

                order.setStatus("Cancelled");

                order.setCancelledAt(
                    LocalDateTime
                        .now()
                        .toString()
                );

                Order updatedOrder =
                    orderRepository.save(order);

                return ResponseEntity.ok(
                    updatedOrder
                );

            })
            .orElseGet(
                () -> ResponseEntity
                    .notFound()
                    .build()
            );
    }

    // =====================================================
    // DELETE ORDER
    // =====================================================

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(
            @PathVariable String orderId
    ) {

        return orderRepository
            .findByOrderId(orderId)
            .map(order -> {

                orderRepository.delete(order);

                return ResponseEntity
                    .noContent()
                    .<Void>build();

            })
            .orElseGet(
                () -> ResponseEntity
                    .notFound()
                    .build()
            );
    }
}