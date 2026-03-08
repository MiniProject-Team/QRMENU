package com.qrmenu.kitchen.controller;

import com.qrmenu.kitchen.dto.KitchenOrderDTO;
import com.qrmenu.kitchen.service.KitchenOrderService;
import com.qrmenu.user.dto.OrderResponse;
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
    public OrderResponse accept(@PathVariable Long id) {
        return OrderResponse.from(service.acceptOrder(id));
    }

    @PutMapping("/cooking/{id}")
    public OrderResponse cooking(@PathVariable Long id) {
        return OrderResponse.from(service.cookingOrder(id));
    }

    @PutMapping("/ready/{id}")
    public OrderResponse ready(@PathVariable Long id) {
        return OrderResponse.from(service.readyOrder(id));
    }

    @PutMapping("/served/{id}")
    public OrderResponse served(@PathVariable Long id) {
        return OrderResponse.from(service.servedOrder(id));
    }

    @PutMapping("/cancel/{id}")
    public OrderResponse cancel(@PathVariable Long id) {
        return OrderResponse.from(service.cancelOrder(id));
    }
}
