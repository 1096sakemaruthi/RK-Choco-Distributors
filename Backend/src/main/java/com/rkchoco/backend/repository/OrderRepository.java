package com.rkchoco.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rkchoco.backend.model.Order;

public interface OrderRepository
        extends JpaRepository<Order, String> {

    /*
     * =====================================================
     * FIND ONE ORDER
     * =====================================================
     */
    Optional<Order> findByOrderId(String orderId);


    /*
     * =====================================================
     * CUSTOMER ORDERS
     * =====================================================
     *
     * Customer mobile number based orders fetch chestundi.
     *
     * Latest order first lo vastundi.
     */
    List<Order> findAllByMobileNumberOrderByCreatedAtDesc(
            String mobileNumber
    );
}