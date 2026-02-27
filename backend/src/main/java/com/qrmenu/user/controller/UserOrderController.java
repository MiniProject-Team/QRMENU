package com.qrmenu.user.controller;

import com.qrmenu.shared.model.Order;
import com.qrmenu.user.dto.OrderRequest;
import com.qrmenu.user.service.UserOrderService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/orders")
public class UserOrderController {

    private final UserOrderService service;

    public UserOrderController(UserOrderService service) {
        this.service = service;
    }

    @PostMapping
    public Order placeOrder(@RequestBody OrderRequest request) {
        return service.placeOrder(request);
    }
}