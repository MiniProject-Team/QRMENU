package com.qrmenu.user.service;

import com.qrmenu.shared.model.Order;
import com.qrmenu.shared.model.OrderItem;
import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.user.dto.OrderRequest;
import com.qrmenu.user.dto.OrderItemRequest;
import com.qrmenu.shared.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserOrderService {

    private final OrderRepository orderRepository;

    public UserOrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order placeOrder(OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setTableId(request.getTableId());
        order.setStatus(OrderStatus.PLACED);
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> items = new ArrayList<>();

        for (OrderItemRequest itemReq : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setMenuItemId(itemReq.getItemId());
            item.setQuantity(itemReq.getQuantity());
            item.setOrder(order);
            items.add(item);
        }

        order.setItems(items);

        return orderRepository.save(order);
    }
}
