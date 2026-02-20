package com.qrmenu.shared.repository;

import com.qrmenu.shared.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}