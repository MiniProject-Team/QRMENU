package com.qrmenu.shared.repository;

import com.qrmenu.shared.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<MenuItem, Long> {
}