package com.qrmenu.kitchen.dto;

import java.util.List;

public class KitchenOrderDTO {

    private Long orderId;
    private String status;
    private Long tableId;
    private String tableNumber;
    private List<String> items;

    // ===== GETTERS =====

    public Long getOrderId() {
        return orderId;
    }

    public String getStatus() {
        return status;
    }

    public Long getTableId() {
        return tableId;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public List<String> getItems() {
        return items;
    }

    // ===== SETTERS =====

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public void setItems(List<String> items) {
        this.items = items;
    }
}