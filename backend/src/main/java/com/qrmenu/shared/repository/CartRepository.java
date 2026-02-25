package com.qrmenu.shared.repository;

import com.qrmenu.shared.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {

    // find cart items by table
    List<Cart> findByTableId(Long tableId);

    // find cart items by menu item
    List<Cart> findByItemId(Long itemId);

    // delete cart items by menu item
    void deleteByItemId(Long itemId);
}