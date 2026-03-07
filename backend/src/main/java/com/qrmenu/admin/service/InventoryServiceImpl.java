package com.qrmenu.admin.service;

import com.qrmenu.admin.dto.InventoryDTO;
import com.qrmenu.admin.dto.InventoryResponseDTO;
import com.qrmenu.admin.dto.StockUpdateDTO;
import com.qrmenu.shared.model.Inventory;
import com.qrmenu.shared.model.MenuItem;
import com.qrmenu.shared.repository.InventoryRepository;
import com.qrmenu.shared.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepo;
    private final MenuRepository menuRepo;

    @Override
    public InventoryResponseDTO createInventory(InventoryDTO dto) {
        Inventory inv = new Inventory();
        inv.setMenuItemId(dto.getMenuItemId());
        inv.setStockQuantity(dto.getQuantity());
        inv = inventoryRepo.save(inv);
        return toResponse(inv);
    }

    @Override
    public List<InventoryResponseDTO> getAllInventory() {
        return inventoryRepo.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public InventoryResponseDTO getInventoryById(Long id) {
        return toResponse(inventoryRepo.findById(id).orElseThrow());
    }

    @Override
    public InventoryResponseDTO updateInventory(Long id, InventoryDTO dto) {
        Inventory inv = inventoryRepo.findById(id).orElseThrow();
        inv.setStockQuantity(dto.getQuantity());
        inv = inventoryRepo.save(inv);
        return toResponse(inv);
    }

    @Override
    public void addStock(Long id, StockUpdateDTO dto) {
        Inventory inv = inventoryRepo.findById(id).orElseThrow();
        inv.setStockQuantity(inv.getStockQuantity() + dto.getQuantity());
        inventoryRepo.save(inv);
    }

    @Override
    public void reduceStock(Long id, StockUpdateDTO dto) {
        Inventory inv = inventoryRepo.findById(id).orElseThrow();
        inv.setStockQuantity(Math.max(0, inv.getStockQuantity() - dto.getQuantity()));
        inventoryRepo.save(inv);
    }

    @Override
    public void toggleAvailability(Long id) {
        Inventory inv = inventoryRepo.findById(id).orElseThrow();
        MenuItem item = menuRepo.findById(inv.getMenuItemId()).orElse(null);
        if (item != null) {
            item.setAvailable(!item.isAvailable());
            menuRepo.save(item);
        }
    }

    @Override
    public void deleteInventory(Long id) {
        inventoryRepo.deleteById(id);
    }

    @Override
    public List<InventoryResponseDTO> getLowStockItems() {
        return inventoryRepo.findByStockQuantityLessThan(10)
                .stream().map(this::toResponse).toList();
    }

    private InventoryResponseDTO toResponse(Inventory inv) {
        String itemName = menuRepo.findById(inv.getMenuItemId())
                .map(MenuItem::getName).orElse("Unknown");
        boolean available = menuRepo.findById(inv.getMenuItemId())
                .map(MenuItem::isAvailable).orElse(false);

        return InventoryResponseDTO.builder()
                .id(inv.getId())
                .menuItemId(inv.getMenuItemId())
                .itemName(itemName)
                .quantity(inv.getStockQuantity())
                .lowStockThreshold(10)
                .available(available)
                .lowStock(inv.getStockQuantity() < 10)
                .build();
    }
}