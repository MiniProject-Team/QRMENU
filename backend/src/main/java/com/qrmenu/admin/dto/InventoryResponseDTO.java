package com.qrmenu.admin.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InventoryResponseDTO {
    private Long id;
    private Long menuItemId;
    private String itemName;
    private Integer quantity;
    private Integer lowStockThreshold;
    private Boolean available;
    private Boolean lowStock;
}