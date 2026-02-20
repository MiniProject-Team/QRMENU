package com.qrmenu.user.dto;

import lombok.Data;

@Data
public class PaymentRequest {

    private Long orderId;
    private String method; // CASH / UPI / CARD
}