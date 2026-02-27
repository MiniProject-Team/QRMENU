package com.qrmenu.user.controller;

import com.qrmenu.shared.model.Order;
import com.qrmenu.user.dto.OrderRequest;
import com.qrmenu.user.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ✅ 1. PLACE ORDER
    @PostMapping("/place")
    public Order placeOrder(@RequestBody OrderRequest request) {
        return orderService.placeOrder(request);
    }

    // ✅ 2. ORDER HISTORY BY USER
    @GetMapping("/history/{userId}")
    public List<Order> orderHistory(@PathVariable Long userId) {
        return orderService.getOrderHistory(userId);
    }

    // ✅ 3. TRACK ORDER BY ORDER ID
    @GetMapping("/track/{orderId}")
    public Order trackOrder(@PathVariable Long orderId) {
        return orderService.trackOrder(orderId);
    }

    // ✅ 4. CANCEL ORDER
    @PutMapping("/cancel/{orderId}")
    public Order cancelOrder(@PathVariable Long orderId) {
        return orderService.cancelOrder(orderId);
    }
}