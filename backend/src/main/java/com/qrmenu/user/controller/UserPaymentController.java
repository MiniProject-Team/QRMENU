package com.qrmenu.user.controller;

import com.qrmenu.shared.model.Payment;
import com.qrmenu.user.dto.PaymentRequest;
import com.qrmenu.user.service.UserPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/payment")
@RequiredArgsConstructor
public class UserPaymentController {

    private final UserPaymentService service;

    @PostMapping("/pay")
    public Payment pay(@RequestBody PaymentRequest request) {
        return service.pay(request);
    }
}