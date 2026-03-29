package com.qrmenu.kitchen.dto;

import java.util.List;

public class KitchenOrderDTO {

    private Long orderId;
    private String status;
    private String createdAt;
    private String startTime;
    private String orderStartTime;
    private Long tableId;
    private String tableNumber;
    private Integer totalTime;
    private Integer totalTimeMinutes;
    private List<String> items;

    // ===== GETTERS =====

    public Long getOrderId() {
        return orderId;
    }

    public String getStatus() {
        return status;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public String getStartTime() {
        return startTime;
    }

    public Long getTableId() {
        return tableId;
    }

    public String getOrderStartTime() {
        return orderStartTime;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public Integer getTotalTime() {
        return totalTime;
    }

    public Integer getTotalTimeMinutes() {
        return totalTimeMinutes;
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

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }

    public void setOrderStartTime(String orderStartTime) {
        this.orderStartTime = orderStartTime;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public void setTotalTime(Integer totalTime) {
        this.totalTime = totalTime;
    }

    public void setTotalTimeMinutes(Integer totalTimeMinutes) {
        this.totalTimeMinutes = totalTimeMinutes;
    }

    public void setItems(List<String> items) {
        this.items = items;
    }
}
