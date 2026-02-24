package com.qrmenu.user.service;

import com.qrmenu.shared.model.Order;
import com.qrmenu.shared.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderStatusService {

    private final OrderRepository orderRepository;

    public OrderStatusService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Get order status by order ID
    public Order getOrderStatus(Long orderId) {
        return orderRepository.findById(orderId).orElseThrow();
    }

    // Get orders by table
   public List<Order> getOrdersByTable(Long tableId) {
    return orderRepository.findByTableId(tableId);
}
}