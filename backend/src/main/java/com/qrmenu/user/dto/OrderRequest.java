package com.qrmenu.user.dto;

import java.util.List;

public class OrderRequest {

    private Long userId;
    private Long tableId;
    private List<OrderItemRequest> items; // 👈 ADD THIS

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getTableId() {
        return tableId;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
}