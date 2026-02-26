package com.qrmenu.user.service;
import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.shared.model.Order;
import com.qrmenu.shared.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OrderService {

    private final OrderRepository repo;

    public OrderService(OrderRepository repo) {
        this.repo = repo;
    }

    public Order placeOrder(Long tableId) {
        Order o = new Order();
        o.setTableId(tableId);
        o.setStatus(OrderStatus.PLACED);
        o.setCreatedAt(LocalDateTime.now());
        return repo.save(o);
    }
}