package com.qrmenu.shared.repository;

import com.qrmenu.shared.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}