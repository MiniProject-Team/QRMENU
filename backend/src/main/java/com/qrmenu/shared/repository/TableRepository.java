package com.qrmenu.shared.repository;

import com.qrmenu.shared.model.TableEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableRepository extends JpaRepository<TableEntity, Long> {
}