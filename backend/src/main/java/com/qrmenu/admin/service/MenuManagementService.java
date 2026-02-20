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

        Category category = categoryRepo.findById(dto.getCategoryId())
                .orElseThrow();

        MenuItem item = new MenuItem();
        item.setName(dto.getName());
        item.setPrice(dto.getPrice());
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