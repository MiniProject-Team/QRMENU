package com.qrmenu.shared.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.qrmenu.shared.enums.PaymentMethod;
import com.qrmenu.shared.enums.PaymentStatus;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(name = "transaction_id", length = 150)
    private String transactionId;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;
}