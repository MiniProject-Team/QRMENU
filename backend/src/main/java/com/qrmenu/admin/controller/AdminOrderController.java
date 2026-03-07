package com.qrmenu.admin.controller;

import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.shared.model.Order;
import com.qrmenu.user.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{orderId}")
    public Order getOrder(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

    @PutMapping("/status/{orderId}")
    public Order updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        return orderService.updateOrderStatus(orderId, status);
    }
}
