package com.qrmenu.user.controller;

import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.shared.model.Order;
import com.qrmenu.user.dto.OrderRequest;
import com.qrmenu.user.service.OrderStatusService;
import com.qrmenu.user.service.UserOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
public class OrderController {

    private final UserOrderService userOrderService;
    private final OrderStatusService orderStatusService;

    // POST /api/user/orders  → place order
    @PostMapping
    public Order placeOrder(@RequestBody OrderRequest request) {
        return userOrderService.placeOrder(request);
    }

    // GET /api/user/orders/{tableId} → order history for table
    @GetMapping("/{tableId}")
    public List<Order> getOrdersByTable(@PathVariable Long tableId) {
        return orderStatusService.getOrdersByTable(tableId);
    }

    // GET /api/user/orders/status/{orderId} → track specific order
    @GetMapping("/status/{orderId}")
    public Order getOrderStatus(@PathVariable Long orderId) {
        return orderStatusService.getOrderStatus(orderId);
    }

    // PUT /api/user/orders/cancel/{orderId} → cancel order
    @PutMapping("/cancel/{orderId}")
    public Order cancelOrder(@PathVariable Long orderId) {
        Order order = orderStatusService.getOrderStatus(orderId);
        order.setStatus(OrderStatus.CANCELLED);
        return orderStatusService.save(order);
    }
}