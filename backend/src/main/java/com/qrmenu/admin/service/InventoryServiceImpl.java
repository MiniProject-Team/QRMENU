package com.qrmenu.admin.service;

import com.qrmenu.admin.dto.InventoryDTO;
import com.qrmenu.admin.dto.InventoryResponseDTO;
import com.qrmenu.admin.dto.StockUpdateDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    // Temporary in-memory list for demo
    private final List<InventoryResponseDTO> inventoryList = new ArrayList<>();

    @Override
    public InventoryResponseDTO createInventory(InventoryDTO dto) {
        InventoryResponseDTO response = InventoryResponseDTO.builder()
                .id(dto.getId())
                .menuItemId(dto.getMenuItemId())
                .itemName(dto.getItemName())
                .quantity(dto.getQuantity())
                .lowStockThreshold(dto.getLowStockThreshold())
                .available(dto.getAvailable())
                .build();
        inventoryList.add(response);
        return response;
    }

    @Override
    public List<InventoryResponseDTO> getAllInventory() {
        return inventoryList;
    }

    @Override
    public InventoryResponseDTO getInventoryById(Long id) {
        return inventoryList.stream()
                .filter(item -> item.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    @Override
    public InventoryResponseDTO updateInventory(Long id, InventoryDTO dto) {
        InventoryResponseDTO existing = getInventoryById(id);
        if (existing != null) {
            existing.setItemName(dto.getItemName());
            existing.setQuantity(dto.getQuantity());
            existing.setLowStockThreshold(dto.getLowStockThreshold());
            existing.setAvailable(dto.getAvailable());
        }
        return existing;
    }

    @Override
    public void addStock(Long id, StockUpdateDTO dto) {
        InventoryResponseDTO item = getInventoryById(id);
        if (item != null) {
            item.setQuantity(item.getQuantity() + dto.getQuantity());
        }
    }

    @Override
    public void reduceStock(Long id, StockUpdateDTO dto) {
        InventoryResponseDTO item = getInventoryById(id);
        if (item != null) {
            item.setQuantity(Math.max(0, item.getQuantity() - dto.getQuantity()));
        }
    }

    @Override
    public void toggleAvailability(Long id) {
        InventoryResponseDTO item = getInventoryById(id);
        if (item != null) {
            item.setAvailable(!item.getAvailable());
        }
    }

    @Override
    public void deleteInventory(Long id) {
        inventoryList.removeIf(item -> item.getId().equals(id));
    }

    @Override
    public List<InventoryResponseDTO> getLowStockItems() {
        List<InventoryResponseDTO> lowStock = new ArrayList<>();
        for (InventoryResponseDTO item : inventoryList) {
            if (item.getQuantity() <= item.getLowStockThreshold()) {
                lowStock.add(item);
            }
        }
        return lowStock;
    }
}