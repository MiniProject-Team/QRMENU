package com.qrmenu.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportDTO {
    private long totalOrders;
    private double totalRevenue;
    private long completedOrders;
    private long cancelledOrders;
    private long pendingOrders;
}
