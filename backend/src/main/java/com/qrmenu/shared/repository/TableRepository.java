package com.qrmenu.shared.repository;

import com.qrmenu.shared.model.TableEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TableRepository extends JpaRepository<TableEntity, Long> {
    Optional<TableEntity> findByTableNumber(Integer tableNumber);
}