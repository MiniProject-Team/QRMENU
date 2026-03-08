package com.qrmenu.user.dto;

import com.qrmenu.shared.model.Payment;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class PaymentResponse {
    private Long id;
    private Long orderId;
    private String paymentMethod;
    private String status;
    private String transactionId;
    private LocalDateTime paidAt;

    public static PaymentResponse from(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setOrderId(payment.getOrder() != null ? payment.getOrder().getId() : null);
        response.setPaymentMethod(payment.getPaymentMethod() != null ? payment.getPaymentMethod().name() : null);
        response.setStatus(payment.getStatus() != null ? payment.getStatus().name() : null);
        response.setTransactionId(payment.getTransactionId());
        response.setPaidAt(payment.getPaidAt());
        return response;
    }
}
