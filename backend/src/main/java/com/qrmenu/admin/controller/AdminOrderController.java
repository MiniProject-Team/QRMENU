package com.qrmenu.admin.controller;

import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.user.dto.OrderResponse;
import com.qrmenu.user.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public List<OrderResponse> getOrders(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return orderService.getOrders(from, to).stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/all")
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders().stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrder(@PathVariable Long orderId) {
        return OrderResponse.from(orderService.getOrderById(orderId));
    }

    @PutMapping("/status/{orderId}")
    public OrderResponse updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        return OrderResponse.from(orderService.updateOrderStatus(orderId, status));
    }
}
