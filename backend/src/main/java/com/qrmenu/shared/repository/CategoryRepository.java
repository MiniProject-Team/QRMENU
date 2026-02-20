package com.qrmenu.shared.repository;

import com.qrmenu.shared.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}