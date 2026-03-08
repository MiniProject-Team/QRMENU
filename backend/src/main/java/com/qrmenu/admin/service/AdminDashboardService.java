package com.qrmenu.admin.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.shared.repository.MenuRepository;
import com.qrmenu.shared.repository.OrderRepository;
import com.qrmenu.shared.repository.TableRepository;
import com.qrmenu.shared.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final OrderRepository orderRepo;
    private final MenuRepository menuRepo;
    private final TableRepository tableRepo;
    private final UserRepository userRepo;

    public Map<String, Object> summary() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalOrders", orderRepo.count());
        // keys expected by frontend
        data.put("totalItems", menuRepo.count());
        data.put("totalTables", tableRepo.count());
        data.put("totalUsers", userRepo.count());
        data.put("pendingOrders", orderRepo.countByStatus(OrderStatus.PLACED));
        data.put("completedOrders", orderRepo.countByStatus(OrderStatus.SERVED));

        // compute revenue from PAID and SERVED orders (some apps mark paid as SERVED)
        Double paid = orderRepo.sumTotalAmountByStatus(OrderStatus.PAID);
        Double served = orderRepo.sumTotalAmountByStatus(OrderStatus.SERVED);
        double totalRevenue = (paid == null ? 0.0 : paid) + (served == null ? 0.0 : served);
        data.put("totalRevenue", totalRevenue);
        return data;
    }
}