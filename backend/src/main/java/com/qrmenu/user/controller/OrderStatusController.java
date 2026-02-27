package com.qrmenu.user.controller;

import com.qrmenu.shared.model.Order;
import com.qrmenu.user.service.OrderStatusService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/orders")
public class OrderStatusController {

    private final OrderStatusService orderStatusService;

    public OrderStatusController(OrderStatusService orderStatusService) {
        this.orderStatusService = orderStatusService;
    }

    // ✅ Get order status by order ID
    @GetMapping("/{orderId}")
    public Order getOrderStatus(@PathVariable Long orderId) {
        return orderStatusService.getOrderStatus(orderId);
    }

    // ✅ Get all orders of table
    @GetMapping("/table/{tableId}")
    public List<Order> getOrdersByTable(@PathVariable Long tableId) {
        return orderStatusService.getOrdersByTable(tableId);
    }
}