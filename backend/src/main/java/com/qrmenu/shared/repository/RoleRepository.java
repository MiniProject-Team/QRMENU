package com.qrmenu.shared.repository;

import com.qrmenu.shared.model.Role;
import com.qrmenu.shared.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}