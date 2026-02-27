package com.qrmenu.admin.controller;

import com.qrmenu.admin.dto.InventoryDTO;
import com.qrmenu.admin.dto.InventoryResponseDTO;
import com.qrmenu.admin.dto.StockUpdateDTO;
import com.qrmenu.admin.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    // Create Inventory
    @PostMapping
    public ResponseEntity<InventoryResponseDTO> createInventory(@RequestBody InventoryDTO dto) {
        return ResponseEntity.ok(inventoryService.createInventory(dto));
    }

    // Get All Inventory
    @GetMapping
    public ResponseEntity<List<InventoryResponseDTO>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    // Get Inventory by ID
    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponseDTO> getInventoryById(@PathVariable Long id) {
        return ResponseEntity.ok(inventoryService.getInventoryById(id));
    }

    // Update Inventory
    @PutMapping("/{id}")
    public ResponseEntity<InventoryResponseDTO> updateInventory(@PathVariable Long id,
            @RequestBody InventoryDTO dto) {
        return ResponseEntity.ok(inventoryService.updateInventory(id, dto));
    }

    // Add Stock
    @PostMapping("/{id}/add-stock")
    public ResponseEntity<Void> addStock(@PathVariable Long id,
            @RequestBody StockUpdateDTO dto) {
        inventoryService.addStock(id, dto);
        return ResponseEntity.ok().build();
    }

    // Reduce Stock
    @PostMapping("/{id}/reduce-stock")
    public ResponseEntity<Void> reduceStock(@PathVariable Long id,
            @RequestBody StockUpdateDTO dto) {
        inventoryService.reduceStock(id, dto);
        return ResponseEntity.ok().build();
    }

    // Toggle Availability
    @PostMapping("/{id}/toggle-availability")
    public ResponseEntity<Void> toggleAvailability(@PathVariable Long id) {
        inventoryService.toggleAvailability(id);
        return ResponseEntity.ok().build();
    }

    // Get Low Stock Items
    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryResponseDTO>> getLowStockItems() {
        return ResponseEntity.ok(inventoryService.getLowStockItems());
    }

    // Delete Inventory
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
        return ResponseEntity.ok().build();
    }
}
