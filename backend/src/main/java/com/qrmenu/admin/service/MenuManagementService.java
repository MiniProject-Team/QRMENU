package com.qrmenu.admin.service;

import com.qrmenu.admin.dto.MenuDTO;
import com.qrmenu.shared.model.*;
import com.qrmenu.shared.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuManagementService {

    private final MenuRepository menuRepo;
    private final CategoryRepository categoryRepo;

    public MenuItem addItem(MenuDTO dto) {
        Category category = categoryRepo.findById(dto.getCategoryId()).orElseThrow();
        MenuItem item = new MenuItem();
        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setImageUrl(dto.getImageUrl());
        item.setAvailable(dto.isAvailable());
        item.setCategory(category);
        return menuRepo.save(item);
    }

    public MenuItem updateItem(Long id, MenuDTO dto) {
        MenuItem item = menuRepo.findById(id).orElseThrow();
        Category category = categoryRepo.findById(dto.getCategoryId()).orElseThrow();
        item.setName(dto.getName());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setImageUrl(dto.getImageUrl());
        item.setAvailable(dto.isAvailable());
        item.setCategory(category);
        return menuRepo.save(item);
    }

    public List<MenuItem> getAll() {
        return menuRepo.findAll();
    }

    public void delete(Long id) {
        menuRepo.deleteById(id);
    }
}