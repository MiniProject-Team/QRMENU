package com.qrmenu.user.controller;

import com.qrmenu.shared.model.Order;
import com.qrmenu.shared.model.OrderItem;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/user/orders")
public class UserOrderController {

    private final UserOrderService service;

    public UserOrderController(UserOrderService service) {
        this.service = service;
    }

    @PostMapping("/place/{tableId}")
    public Order placeOrder(@PathVariable Long tableId, @RequestBody List<OrderItem> items) {
        return service.placeOrder(tableId, items);
    }
}