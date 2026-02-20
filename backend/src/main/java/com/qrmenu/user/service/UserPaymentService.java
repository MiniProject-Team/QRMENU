package com.qrmenu.user.service;

import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.shared.enums.PaymentStatus;
import com.qrmenu.shared.model.Order;
import com.qrmenu.shared.model.Payment;
import com.qrmenu.shared.repository.OrderRepository;
import com.qrmenu.shared.repository.PaymentRepository;
import com.qrmenu.user.dto.PaymentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserPaymentService {

    private final PaymentRepository paymentRepo;
    private final OrderRepository orderRepo;

    public Payment pay(PaymentRequest request) {

        Order order = orderRepo.findById(request.getOrderId())
                .orElseThrow();

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(
        com.qrmenu.shared.enums.PaymentMethod.valueOf(request.getMethod())
);
        payment.setStatus(PaymentStatus.SUCCESS);

        order.setStatus(OrderStatus.PAID);
        orderRepo.save(order);

        return paymentRepo.save(payment);
    }
}