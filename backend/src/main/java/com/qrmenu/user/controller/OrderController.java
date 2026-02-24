package com.qrmenu.user.controller;

import com.qrmenu.shared.model.Order;
import com.qrmenu.user.service.OrderService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/order")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping("/place/{tableId}")
    public Order placeOrder(@PathVariable Long tableId) {
        return service.placeOrder(tableId);
    }
}