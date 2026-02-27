package com.qrmenu.kitchen.service;

import com.qrmenu.kitchen.dto.KitchenOrderDTO;
import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.shared.model.MenuItem;
import com.qrmenu.shared.model.Order;
import com.qrmenu.shared.model.OrderItem;
import com.qrmenu.shared.model.TableEntity;
import com.qrmenu.shared.repository.MenuRepository;
import com.qrmenu.shared.repository.OrderRepository;
import com.qrmenu.shared.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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
            OrderStatus.PREPARING
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
        return updateStatus(id, OrderStatus.PREPARING);
    }

    public Order readyOrder(Long id) {
        return updateStatus(id, OrderStatus.READY);
    }

    public Order servedOrder(Long id) {
        return updateStatus(id, OrderStatus.SERVED);
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
    dto.setTableId(order.getTableId());
    
        String tableNumber = tableRepo.findById(order.getTableId())
                .map(TableEntity::getTableNumber)
                .orElse(String.valueOf(order.getTableId()));
        dto.setTableNumber(tableNumber);

        dto.setStatus(order.getStatus().name());

        List<String> items = order.getItems().stream()
                .map(this::formatItem)
                .collect(Collectors.toList());
        dto.setItems(items);

        return dto;
    }

    private String formatItem(OrderItem item) {
        String name = menuRepo.findById(item.getMenuItemId())
                .map(MenuItem::getName)
                .orElse("Item " + item.getMenuItemId());
        return name + " x " + item.getQuantity();
    }
}