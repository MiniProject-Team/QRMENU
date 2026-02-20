package com.qrmenu.shared.repository;

import com.qrmenu.shared.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}