package com.qrmenu.kitchen.dto;

import com.qrmenu.shared.enums.OrderStatus;

public class OrderStatusUpdateRequest {

    private OrderStatus status;

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}