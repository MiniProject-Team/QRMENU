package com.qrmenu.kitchen.controller;

import com.qrmenu.kitchen.dto.KitchenOrderDTO;
import com.qrmenu.kitchen.service.KitchenOrderService;
import com.qrmenu.shared.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kitchen/orders")
@RequiredArgsConstructor
public class KitchenOrderController {

    private final KitchenOrderService service;

    @GetMapping("/active")
    public List<KitchenOrderDTO> getActiveOrders() {
        return service.getActiveOrders();
    }

    @PutMapping("/accept/{id}")
    public Order accept(@PathVariable Long id) {
        return service.acceptOrder(id);
    }

    @PutMapping("/cooking/{id}")
    public Order cooking(@PathVariable Long id) {
        return service.cookingOrder(id);
    }

    @PutMapping("/ready/{id}")
    public Order ready(@PathVariable Long id) {
        return service.readyOrder(id);
    }

    @PutMapping("/served/{id}")
    public Order served(@PathVariable Long id) {
        return service.servedOrder(id);
    }
}