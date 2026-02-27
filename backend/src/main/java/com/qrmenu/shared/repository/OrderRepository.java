package com.qrmenu.shared.repository;

import com.qrmenu.shared.model.Order;
import com.qrmenu.shared.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByTableId(Long tableId);

    List<Order> findByStatusIn(List<OrderStatus> status);
}