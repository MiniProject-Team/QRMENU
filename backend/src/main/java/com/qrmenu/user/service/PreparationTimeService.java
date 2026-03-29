package com.qrmenu.user.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.qrmenu.shared.model.Category;

@Service
public class PreparationTimeService {

    private static final Map<String, Integer> CATEGORY_TIME_MINUTES = Map.of(
            "starters", 5,
            "starter", 5,
            "main course", 8,
            "main", 8,
            "beverages", 6,
            "beverage", 6,
            "desserts", 3,
            "dessert", 3
    );

    public int getPreparationMinutes(Category category) {
        if (category == null || category.getName() == null) {
            return 5;
        }

        return CATEGORY_TIME_MINUTES.getOrDefault(category.getName().trim().toLowerCase(), 5);
    }
}
