package com.qrmenu.user.service;

import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.shared.model.*;
import com.qrmenu.shared.repository.*;
import com.qrmenu.user.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserOrderService {

    private final OrderRepository orderRepo;
    private final TableRepository tableRepo;
    private final MenuRepository menuRepo;

    public Order placeOrder(OrderRequest request) {

        TableEntity table = tableRepo.findById(request.getTableId())
                .orElseThrow();

        Order order = new Order();
        order.setTableEntity(table);
        order.setStatus(OrderStatus.PLACED);
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();

        for (OrderItemRequest itemRequest : request.getItems()) {

            MenuItem item = menuRepo.findById(itemRequest.getItemId())
                    .orElseThrow();

            OrderItem orderItem = new OrderItem();
            orderItem.setMenuItem(item);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setOrder(order);

            orderItems.add(orderItem);
        }

        order.setItems(orderItems);

        return orderRepo.save(order);
    }

    public Order getOrder(Long orderId) {
        return orderRepo.findById(orderId).orElseThrow();
    }

    public void cancelOrder(Long orderId) {
        Order order = orderRepo.findById(orderId).orElseThrow();
        order.setStatus(OrderStatus.CANCELLED);
        orderRepo.save(order);
    }
}