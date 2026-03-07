package com.qrmenu.shared.repository;

import com.qrmenu.shared.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByMenuItemId(Long menuItemId);
    List<Inventory> findByStockQuantityLessThan(Integer threshold);
}
