package com.qrmenu.admin.controller;

import com.qrmenu.admin.dto.MenuDTO;
import com.qrmenu.admin.service.MenuManagementService;
import com.qrmenu.shared.model.MenuItem;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/menu")
@RequiredArgsConstructor
public class MenuManagementController {

    private final MenuManagementService service;

    @PostMapping("/add")
    public MenuItem add(@RequestBody MenuDTO dto) {
        return service.addItem(dto);
    }

    @PutMapping("/update/{id}")
    public MenuItem update(@PathVariable Long id, @RequestBody MenuDTO dto) {
        return service.updateItem(id, dto);
    }

    @GetMapping("/all")
    public List<MenuItem> all() {
        return service.getAll();
    }

    @PutMapping("/toggle/{id}")
    public MenuItem toggle(@PathVariable Long id) {
        return service.toggleAvailability(id);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
