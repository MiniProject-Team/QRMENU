package com.qrmenu.shared.repository;

import com.qrmenu.shared.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByTargetRoleOrderByCreatedAtDesc(String targetRole);
    List<Notification> findByOrderId(Long orderId);
    List<Notification> findByReadFalseAndTargetRole(String targetRole);
}
