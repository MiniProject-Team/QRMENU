package com.qrmenu.kitchen.service;

import com.qrmenu.kitchen.dto.KitchenOrderDTO;
import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.shared.model.Order;
import com.qrmenu.shared.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KitchenOrderService {

    private final OrderRepository orderRepository;

    public KitchenOrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<KitchenOrderDTO> getActiveOrders() {
        List<Order> orders = orderRepository.findAll();

        return orders.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public KitchenOrderDTO updateStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        Order saved = orderRepository.save(order);

        return convertToDTO(saved);
    }

    private KitchenOrderDTO convertToDTO(Order order) {
        KitchenOrderDTO dto = new KitchenOrderDTO();
        dto.setId(order.getId());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }
}