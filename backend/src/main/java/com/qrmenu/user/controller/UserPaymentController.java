package com.qrmenu.user.controller;

import com.qrmenu.shared.model.Payment;
import com.qrmenu.user.dto.PaymentRequest;
import com.qrmenu.user.dto.PaymentResponse;
import com.qrmenu.user.service.UserPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/payment")
@RequiredArgsConstructor
public class UserPaymentController {

    private final UserPaymentService service;

    @PostMapping("/pay")
    public PaymentResponse pay(@RequestBody PaymentRequest request) {
        return PaymentResponse.from(service.pay(request));
    }

    @GetMapping("/{orderId}")
    public PaymentResponse getPayment(@PathVariable Long orderId) {
        return PaymentResponse.from(service.getPaymentByOrderId(orderId));
    }
}
