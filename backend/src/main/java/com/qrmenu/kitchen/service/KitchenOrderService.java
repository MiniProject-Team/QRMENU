package com.qrmenu.kitchen.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.qrmenu.kitchen.dto.KitchenOrderDTO;
import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.shared.model.MenuItem;
import com.qrmenu.shared.model.Order;
import com.qrmenu.shared.model.OrderItem;
import com.qrmenu.shared.repository.MenuRepository;
import com.qrmenu.shared.repository.OrderRepository;
import com.qrmenu.shared.repository.TableRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KitchenOrderService {

    private final OrderRepository orderRepo;
    private final TableRepository tableRepo;
    private final MenuRepository menuRepo;

    public List<KitchenOrderDTO> getActiveOrders() {
        List<OrderStatus> active = List.of(
                OrderStatus.PLACED,
                OrderStatus.ACCEPTED,
                OrderStatus.COOKING,
                OrderStatus.READY
        );

        return orderRepo.findByStatusIn(active)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public Order acceptOrder(Long id) {
        return updateStatus(id, OrderStatus.ACCEPTED);
    }

    public Order cookingOrder(Long id) {
        return updateStatus(id, OrderStatus.COOKING);
    }

    public Order readyOrder(Long id) {
        return updateStatus(id, OrderStatus.READY);
    }

    public Order servedOrder(Long id) {
        return updateStatus(id, OrderStatus.SERVED);
    }

    public Order cancelOrder(Long id) {
        return updateStatus(id, OrderStatus.CANCELLED);
    }

    private Order updateStatus(Long id, OrderStatus status) {
        Order order = orderRepo.findById(id).orElseThrow();
        order.setStatus(status);
        return orderRepo.save(order);
    }

    private KitchenOrderDTO convertToDTO(Order order) {
        KitchenOrderDTO dto = new KitchenOrderDTO();
        dto.setOrderId(order.getId());
        dto.setStatus(order.getStatus().name());
        dto.setCreatedAt(order.getCreatedAt() == null ? null : order.getCreatedAt().toString());
        dto.setTableId(order.getTableId());

        String tableNumber;
        if (order.getTableId() == null) {
            tableNumber = "Unknown";
        } else {
            tableNumber = tableRepo.findById(order.getTableId())
                    .map(t -> String.valueOf(t.getTableNumber()))
                    .orElse(String.valueOf(order.getTableId()));
        }
        dto.setTableNumber(tableNumber);

        if (order.getItems() != null) {
            List<String> items = order.getItems()
                    .stream()
                    .map(this::formatItem)
                    .collect(Collectors.toList());
            dto.setItems(items);
        } else {
            dto.setItems(List.of());
        }

        return dto;
    }

    private String formatItem(OrderItem item) {
        String name = menuRepo.findById(item.getMenuItemId())
                .map(MenuItem::getName)
                .orElse("Item " + item.getMenuItemId());
        return name + " x " + item.getQuantity();
    }
}
