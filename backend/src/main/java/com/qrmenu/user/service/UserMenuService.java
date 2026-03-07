package com.qrmenu.user.service;

import com.qrmenu.shared.model.Category;
import com.qrmenu.shared.model.MenuItem;
import com.qrmenu.shared.repository.CategoryRepository;
import com.qrmenu.shared.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserMenuService {

    private final MenuRepository menuRepo;
    private final CategoryRepository categoryRepo;

    public List<MenuItem> getMenu() {
        return menuRepo.findByAvailableTrue();
    }

    public MenuItem getMenuItemById(Long id) {
        return menuRepo.findById(id).orElseThrow(() -> new RuntimeException("Menu item not found"));
    }

    public List<MenuItem> getMenuByCategory(Long categoryId) {
        return menuRepo.findByCategoryId(categoryId);
    }

    public List<Category> getCategories() {
        return categoryRepo.findAll();
    }
}