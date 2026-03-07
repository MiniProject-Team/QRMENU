package com.qrmenu.shared.repository;

import com.qrmenu.shared.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategoryId(Long categoryId);
    List<MenuItem> findByAvailableTrue();
}