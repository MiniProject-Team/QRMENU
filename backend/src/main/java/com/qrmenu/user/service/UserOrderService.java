package com.qrmenu.user.service;

import com.qrmenu.shared.model.Order;
import com.qrmenu.shared.model.OrderItem;
import com.qrmenu.shared.model.MenuItem;
import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.user.dto.OrderRequest;
import com.qrmenu.user.dto.OrderItemRequest;
import com.qrmenu.shared.repository.OrderRepository;
import com.qrmenu.shared.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserOrderService {

    private final OrderRepository orderRepository;
    private final MenuRepository menuRepository;

    public Order placeOrder(OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setTableId(request.getTableId());
        order.setStatus(OrderStatus.PLACED);

        List<OrderItem> items = new ArrayList<>();
        double totalAmount = 0;

        for (OrderItemRequest itemReq : request.getItems()) {
            MenuItem menuItem = menuRepository.findById(itemReq.getItemId()).orElseThrow();

            OrderItem item = new OrderItem();
            item.setMenuItemId(itemReq.getItemId());
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(menuItem.getPrice());
            item.setOrder(order);
            items.add(item);

            totalAmount += menuItem.getPrice() * itemReq.getQuantity();
        }

        order.setItems(items);
        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    public Order trackOrder(Long orderId) {
        return orderRepository.findById(orderId).orElseThrow();
    }

    public List<Order> getOrdersByTable(Long tableId) {
        return orderRepository.findByTableId(tableId);
    }

    public Order cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (order.getStatus() == OrderStatus.PLACED || order.getStatus() == OrderStatus.ACCEPTED) {
            order.setStatus(OrderStatus.CANCELLED);
            return orderRepository.save(order);
        }
        throw new RuntimeException("Cannot cancel order in status: " + order.getStatus());
    }
}
