package com.qrmenu.user.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {

    private Long tableId;
    private List<OrderItemRequest> items;
}