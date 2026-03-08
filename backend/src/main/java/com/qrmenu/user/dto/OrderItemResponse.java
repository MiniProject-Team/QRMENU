package com.qrmenu.user.dto;

import com.qrmenu.shared.model.OrderItem;
import lombok.Data;

@Data
public class OrderItemResponse {
    private Long id;
    private Long menuItemId;
    private String itemName;
    private int quantity;
    private double price;
    private double subtotal;

    public static OrderItemResponse from(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(item.getId());
        response.setMenuItemId(item.getMenuItemId());
        response.setItemName("Item " + item.getMenuItemId());
        response.setQuantity(item.getQuantity());
        response.setPrice(item.getPrice());
        response.setSubtotal(item.getPrice() * item.getQuantity());
        return response;
    }
}
