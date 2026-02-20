package com.qrmenu.admin.controller;

import com.qrmenu.admin.dto.CategoryDTO;
import com.qrmenu.admin.service.CategoryService;
import com.qrmenu.shared.model.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService service;

    @PostMapping("/add")
    public Category add(@RequestBody CategoryDTO dto) {
        return service.add(dto);
    }

    @GetMapping("/all")
    public List<Category> all() {
        return service.getAll();
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}