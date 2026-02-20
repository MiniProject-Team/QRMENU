package com.qrmenu.user.controller;

import com.qrmenu.shared.model.Order;
import com.qrmenu.user.dto.OrderRequest;
import com.qrmenu.user.service.UserOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
public class UserOrderController {

    private final UserOrderService service;

    @PostMapping
    public Order place(@RequestBody OrderRequest request) {
        return service.placeOrder(request);
    }

    @GetMapping("/{id}")
    public Order get(@PathVariable Long id) {
        return service.getOrder(id);
    }

    @PutMapping("/cancel/{id}")
    public void cancel(@PathVariable Long id) {
        service.cancelOrder(id);
    }
}