package com.qrmenu.user.service;

import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.shared.model.Order;
import com.qrmenu.shared.model.OrderItem;
import com.qrmenu.shared.repository.OrderRepository;
import com.qrmenu.user.dto.OrderRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserOrderService {

    private final OrderRepository orderRepo;

    public Order placeOrder(OrderRequest request) {

        Order order = new Order();
        order.setTableId(request.getTableId());
        order.setStatus(OrderStatus.PLACED);
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> items = request.getItems().stream().map(itemReq -> {
            OrderItem item = new OrderItem();
            item.setMenuItemId(itemReq.getItemId());
            item.setQuantity(itemReq.getQuantity());
            item.setOrder(order);
            return item;
        }).toList();

        order.setItems(items);

        return orderRepo.save(order);
    }
}