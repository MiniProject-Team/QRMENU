package com.qrmenu.user.controller;

import com.qrmenu.shared.model.Order;
import com.qrmenu.user.dto.OrderRequest;
import com.qrmenu.user.service.UserOrderService;
import com.qrmenu.user.service.OrderStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
public class OrderController {

    private final UserOrderService userOrderService;
    private final OrderStatusService orderStatusService;

    @PostMapping("/place")
    public Order placeOrder(@RequestBody OrderRequest request) {
        return userOrderService.placeOrder(request);
    }

    @GetMapping("/{orderId}")
    public Order getOrderStatus(@PathVariable Long orderId) {
        return orderStatusService.getOrderStatus(orderId);
    }

    @GetMapping("/table/{tableId}")
    public List<Order> getOrdersByTable(@PathVariable Long tableId) {
        return orderStatusService.getOrdersByTable(tableId);
    }

    @PutMapping("/cancel/{orderId}")
    public Order cancelOrder(@PathVariable Long orderId) {
        return userOrderService.cancelOrder(orderId);
    }
}