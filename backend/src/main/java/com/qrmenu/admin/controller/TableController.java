package com.qrmenu.admin.controller;

import com.qrmenu.admin.dto.TableDTO;
import com.qrmenu.admin.service.TableService;
import com.qrmenu.shared.model.TableEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService service;

    @PostMapping("/add")
    public TableEntity add(@RequestBody TableDTO dto) {
        return service.add(dto);
    }

    @GetMapping("/all")
    public List<TableEntity> all() {
        return service.getAll();
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}