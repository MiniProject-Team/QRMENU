package com.qrmenu.user.service;

import com.qrmenu.shared.model.Order;
import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.shared.repository.OrderRepository;
import com.qrmenu.user.dto.OrderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    // PLACE ORDER
    public Order placeOrder(OrderRequest request) {
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setTableId(request.getTableId());
        order.setStatus(OrderStatus.PLACED);
        order.setCreatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    // ORDER HISTORY
    public List<Order> getOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    // TRACK ORDER
    public Order trackOrder(Long orderId) {
        return orderRepository.findById(orderId).orElseThrow();
    }

    // CANCEL ORDER
    public Order cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }
}