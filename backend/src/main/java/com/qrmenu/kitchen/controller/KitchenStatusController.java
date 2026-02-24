package com.qrmenu.kitchen.controller;

import com.qrmenu.shared.model.Order;
import com.qrmenu.shared.enums.OrderStatus; // MUST be enums
import com.qrmenu.shared.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kitchen/order")
@CrossOrigin("*")
public class KitchenStatusController {

    private final OrderRepository orderRepository;

    public KitchenStatusController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PutMapping("/status/{orderId}")
    public Order updateStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(status);
        return orderRepository.save(order);
    }
}