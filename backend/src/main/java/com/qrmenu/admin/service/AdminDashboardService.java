package com.qrmenu.admin.service;

import com.qrmenu.shared.repository.OrderRepository;
import com.qrmenu.shared.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final OrderRepository orderRepo;
    private final MenuRepository menuRepo;

    public Map<String, Object> summary() {

        Map<String, Object> data = new HashMap<>();

        data.put("totalOrders", orderRepo.count());
        data.put("totalItems", menuRepo.count());

        return data;
    }
}