package com.rkchoco.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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

import com.rkchoco.backend.model.Order;
import com.rkchoco.backend.repository.OrderRepository;

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

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }


    // =====================================================
    // CREATE ORDER
    // =====================================================

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody Order order
    ) {

        // =================================================
        // GENERATE ORDER ID
        // =================================================
        //
        // Customer side nunchi orderId vachina,
        // raakapoyina backend automatic ga ID generate chestundi.
        //

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
        // SAVE ORDER TO MYSQL
        // =================================================

        Order savedOrder =
            orderRepository.save(order);


        return ResponseEntity.ok(savedOrder);
    }


    // =====================================================
    // GET CUSTOMER ORDERS
    // =====================================================
    //
    // Customer mobile number tho
    // aa customer orders matrame fetch chestundi.
    //
    // Latest order first lo vastundi.
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
    //
    // Admin side nunchi:
    //
    // Pending
    // Processing
    // Shipped
    // Delivered
    // Cancelled
    //
    // edhi select chesina
    // MySQL lo status update avutundi.
    //
    // Customer Profile / Orders page next API call lo
    // same updated status receive chestayi.
    // =====================================================

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> request
    ) {

        String newStatus =
            request.get("status");


        // =================================================
        // STATUS EMPTY CHECK
        // =================================================

        if (
            newStatus == null ||
            newStatus.trim().isEmpty()
        ) {

            return ResponseEntity
                .badRequest()
                .body("Order status is required.");
        }


        String finalStatus =
            newStatus.trim();


        return orderRepository
            .findByOrderId(orderId)
            .map(order -> {

                // =================================================
                // UPDATE STATUS
                // =================================================

                order.setStatus(finalStatus);


                // =================================================
                // CANCELLED
                // =================================================

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

                }


                // =================================================
                // OTHER STATUS
                // =================================================
                //
                // Pending / Processing / Shipped / Delivered
                // ayithe cancelledAt remove chestham.
                //

                else {

                    order.setCancelledAt(null);
                }


                // =================================================
                // SAVE UPDATED ORDER TO MYSQL
                // =================================================

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
    //
    // Customer side cancel button kosam.
    // =====================================================

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable String orderId
    ) {

        return orderRepository
            .findByOrderId(orderId)
            .map(order -> {

                // =================================================
                // SET CANCELLED STATUS
                // =================================================

                order.setStatus("Cancelled");


                // =================================================
                // CANCELLED DATE / TIME
                // =================================================

                order.setCancelledAt(
                    LocalDateTime
                        .now()
                        .toString()
                );


                // =================================================
                // SAVE TO MYSQL
                // =================================================

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