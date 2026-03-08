package com.qrmenu.user.controller;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qrmenu.shared.model.Order;
import com.qrmenu.user.dto.OrderRequest;
import com.qrmenu.user.dto.OrderResponse;
import com.qrmenu.user.service.OrderStatusService;
import com.qrmenu.user.service.UserOrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user/orders")
@RequiredArgsConstructor
public class OrderController {

    private final UserOrderService userOrderService;
    private final OrderStatusService orderStatusService;

    @PostMapping("/place")
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody OrderRequest request) {
        Order saved = userOrderService.placeOrder(request);
        OrderResponse resp = OrderResponse.from(saved);
        URI location = URI.create(String.format("/api/user/orders/%d", saved.getId()));
        return ResponseEntity.created(location).body(resp);
    }

    @GetMapping("/{orderId}")
    public OrderResponse getOrderStatus(@PathVariable Long orderId) {
        return OrderResponse.from(orderStatusService.getOrderStatus(orderId));
    }

    @GetMapping("/track/{orderId}")
    public OrderResponse trackOrder(@PathVariable Long orderId) {
        return OrderResponse.from(userOrderService.trackOrder(orderId));
    }

    @GetMapping("/table/{tableId}")
    public List<OrderResponse> getOrdersByTable(@PathVariable Long tableId) {
        return orderStatusService.getOrdersByTable(tableId).stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());
    }

    @PutMapping("/cancel/{orderId}")
    public OrderResponse cancelOrder(@PathVariable Long orderId) {
        return OrderResponse.from(userOrderService.cancelOrder(orderId));
    }
}