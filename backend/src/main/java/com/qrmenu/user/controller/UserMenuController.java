package com.qrmenu.user.controller;

import com.qrmenu.shared.model.Category;
import com.qrmenu.shared.model.MenuItem;
import com.qrmenu.user.service.UserMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/menu")
@RequiredArgsConstructor
public class UserMenuController {

    private final UserMenuService service;

    @GetMapping
    public List<MenuItem> getMenu() {
        return service.getMenu();
    }

    @GetMapping("/{id}")
    public MenuItem getMenuItem(@PathVariable Long id) {
        return service.getMenuItemById(id);
    }

    @GetMapping("/category/{categoryId}")
    public List<MenuItem> getMenuByCategory(@PathVariable Long categoryId) {
        return service.getMenuByCategory(categoryId);
    }

    @GetMapping("/categories")
    public List<Category> getCategories() {
        return service.getCategories();
    }
}