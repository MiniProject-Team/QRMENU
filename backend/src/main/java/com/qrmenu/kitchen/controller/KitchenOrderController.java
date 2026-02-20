package com.qrmenu.kitchen.controller;

import com.qrmenu.kitchen.dto.KitchenOrderDTO;
import com.qrmenu.kitchen.service.KitchenOrderService;
import com.qrmenu.shared.enums.OrderStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kitchen/orders")
public class KitchenOrderController {

    private final KitchenOrderService service;

    public KitchenOrderController(KitchenOrderService service) {
        this.service = service;
    }

    @GetMapping
    public List<KitchenOrderDTO> getOrders() {
        return service.getActiveOrders();
    }

    @PutMapping("/accept/{id}")
    public KitchenOrderDTO acceptOrder(@PathVariable Long id) {
        return service.updateStatus(id, OrderStatus.ACCEPTED);
    }

    @PutMapping("/cooking/{id}")
    public KitchenOrderDTO cookingOrder(@PathVariable Long id) {
        return service.updateStatus(id, OrderStatus.COOKING);
    }

    @PutMapping("/ready/{id}")
    public KitchenOrderDTO readyOrder(@PathVariable Long id) {
        return service.updateStatus(id, OrderStatus.READY);
    }

    @PutMapping("/served/{id}")
    public KitchenOrderDTO servedOrder(@PathVariable Long id) {
        return service.updateStatus(id, OrderStatus.SERVED);
    }
}