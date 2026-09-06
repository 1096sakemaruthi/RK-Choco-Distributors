package com.rkchoco.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {

    // =====================================================
    // ORDER ID
    // =====================================================

    @Id
    @Column(name = "order_id", nullable = false, unique = true)
    private String orderId;


    // =====================================================
    // USER ID
    // =====================================================

    @Column(name = "user_id")
    private String userId;


    // =====================================================
    // SHOP DETAILS
    // =====================================================

    private String shopName;

    private String ownerName;

    private String mobileNumber;


    // =====================================================
    // DELIVERY ADDRESS
    // =====================================================

    @Column(length = 1000)
    private String deliveryAddress;


    // =====================================================
    // ORDER SUMMARY
    // =====================================================

    private Integer totalProducts;

    private Integer totalBoxes;

    private Double grandTotal;


    // =====================================================
    // ORDER DATE / TIME
    // =====================================================

    private String orderDate;

    private String orderTime;

    private String createdAt;

    private String deliveryDate;


    // =====================================================
    // ORDER ITEMS
    // =====================================================
    //
    // IMPORTANT:
    // @Lob allows large text/JSON data.
    // This fixes:
    // Data too long for column 'items'
    //
    // =====================================================

    @Lob
    @Column(name = "items", columnDefinition = "LONGTEXT")
    private String items;


    // =====================================================
    // ORDER STATUS
    // =====================================================

    private String status;


    // =====================================================
    // CANCELLED DATE / TIME
    // =====================================================

    private String cancelledAt;


    // =====================================================
    // DEFAULT CONSTRUCTOR
    // =====================================================

    public Order() {
    }


    // =====================================================
    // ORDER ID
    // =====================================================

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }


    // =====================================================
    // USER ID
    // =====================================================

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }


    // =====================================================
    // SHOP NAME
    // =====================================================

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }


    // =====================================================
    // OWNER NAME
    // =====================================================

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }


    // =====================================================
    // MOBILE NUMBER
    // =====================================================

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }


    // =====================================================
    // DELIVERY ADDRESS
    // =====================================================

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }


    // =====================================================
    // TOTAL PRODUCTS
    // =====================================================

    public Integer getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Integer totalProducts) {
        this.totalProducts = totalProducts;
    }


    // =====================================================
    // TOTAL BOXES
    // =====================================================

    public Integer getTotalBoxes() {
        return totalBoxes;
    }

    public void setTotalBoxes(Integer totalBoxes) {
        this.totalBoxes = totalBoxes;
    }


    // =====================================================
    // GRAND TOTAL
    // =====================================================

    public Double getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(Double grandTotal) {
        this.grandTotal = grandTotal;
    }


    // =====================================================
    // ORDER DATE
    // =====================================================

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }


    // =====================================================
    // ORDER TIME
    // =====================================================

    public String getOrderTime() {
        return orderTime;
    }

    public void setOrderTime(String orderTime) {
        this.orderTime = orderTime;
    }


    // =====================================================
    // CREATED AT
    // =====================================================

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }


    // =====================================================
    // DELIVERY DATE
    // =====================================================

    public String getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(String deliveryDate) {
        this.deliveryDate = deliveryDate;
    }


    // =====================================================
    // ITEMS
    // =====================================================

    public String getItems() {
        return items;
    }

    public void setItems(String items) {
        this.items = items;
    }


    // =====================================================
    // STATUS
    // =====================================================

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    // =====================================================
    // CANCELLED AT
    // =====================================================

    public String getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(String cancelledAt) {
        this.cancelledAt = cancelledAt;
    }
}