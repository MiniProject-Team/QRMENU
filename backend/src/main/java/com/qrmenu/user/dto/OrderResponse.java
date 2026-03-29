package com.qrmenu.user.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.shared.model.Order;

import lombok.Data;

@Data
public class OrderResponse {
    private Long id;
    private Long tableId;
    private Double totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer totalTime;
    private LocalDateTime startTime;
    private Integer totalTimeMinutes;
    private LocalDateTime orderStartTime;
    private List<OrderItemResponse> items;

    public static OrderResponse from(Order order) {
        if (order == null) return null;
        OrderResponse r = new OrderResponse();
        r.setId(order.getId());
        r.setTableId(order.getTableId());
        r.setTotalAmount(order.getTotalAmount());
        r.setStatus(order.getStatus());
        r.setCreatedAt(order.getCreatedAt());
        r.setUpdatedAt(order.getUpdatedAt());
        r.setTotalTime(order.getTotalTimeMinutes());
        r.setStartTime(order.getOrderStartTime());
        r.setTotalTimeMinutes(order.getTotalTimeMinutes());
        r.setOrderStartTime(order.getOrderStartTime());
        r.setItems(order.getItems() == null
                ? List.of()
                : order.getItems().stream().map(OrderItemResponse::from).collect(Collectors.toList()));
        return r;
    }
}
