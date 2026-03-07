package com.qrmenu.admin.service;

import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.shared.repository.OrderRepository;
import com.qrmenu.shared.repository.MenuRepository;
import com.qrmenu.shared.repository.TableRepository;
import com.qrmenu.shared.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

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
        data.put("totalMenuItems", menuRepo.count());
        data.put("totalTables", tableRepo.count());
        data.put("totalUsers", userRepo.count());
        data.put("pendingOrders", orderRepo.countByStatus(OrderStatus.PLACED));
        data.put("completedOrders", orderRepo.countByStatus(OrderStatus.SERVED));
        data.put("totalRevenue", orderRepo.sumTotalAmountByStatus(OrderStatus.PAID));
        return data;
    }
}