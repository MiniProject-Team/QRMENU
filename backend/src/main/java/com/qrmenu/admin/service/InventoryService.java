package com.qrmenu.admin.service;

import com.qrmenu.admin.dto.InventoryDTO;
import com.qrmenu.admin.dto.InventoryResponseDTO;
import com.qrmenu.admin.dto.StockUpdateDTO;

import java.util.List;

public interface InventoryService {

    InventoryResponseDTO createInventory(InventoryDTO dto);

    List<InventoryResponseDTO> getAllInventory();

    InventoryResponseDTO getInventoryById(Long id);

    InventoryResponseDTO updateInventory(Long id, InventoryDTO dto);

    void addStock(Long id, StockUpdateDTO dto);

    void reduceStock(Long id, StockUpdateDTO dto);

    void toggleAvailability(Long id);

    void deleteInventory(Long id);

    // ✅ Add this
    List<InventoryResponseDTO> getLowStockItems();
}