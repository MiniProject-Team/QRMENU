package com.qrmenu.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long orderId;
    private Long tableId;
    private String status;
    private Double totalAmount;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private Long menuItemId;
        private String itemName;
        private int quantity;
        private double price;
    }
}
