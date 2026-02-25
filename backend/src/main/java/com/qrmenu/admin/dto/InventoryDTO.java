package com.qrmenu.admin.dto;

import lombok.Data;

@Data
public class InventoryDTO {
    private Long id;
    private Long menuItemId;
    private String itemName;
    private Integer quantity;
    private Integer lowStockThreshold;
    private Boolean available;
}