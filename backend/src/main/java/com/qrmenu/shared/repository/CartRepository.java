package com.qrmenu.shared.repository;

import com.qrmenu.shared.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {

    // find cart items by table
    List<Cart> findByTableId(Long tableId);
}