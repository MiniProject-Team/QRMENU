package com.qrmenu.user.service;

import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.shared.model.Order;
import com.qrmenu.shared.model.OrderItem;
import com.qrmenu.shared.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserOrderService {

    private final OrderRepository orderRepository;

    public UserOrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order placeOrder(Long tableId, List<OrderItem> items) {

        Order order = new Order();
        order.setTableId(tableId);
        order.setStatus(OrderStatus.PLACED);
        order.setCreatedAt(LocalDateTime.now());
        order.setItems(items);

        for (OrderItem item : items) {
            item.setOrder(order);
        }

        return orderRepository.save(order);
    }
}