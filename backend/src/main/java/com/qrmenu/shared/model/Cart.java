package com.qrmenu.shared.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Table number (QR scanned table)
    private Long tableId;

    // Menu item ID
    private Long itemId;

    // Quantity of item
    private int quantity;

    // Constructors
    public Cart() {}

    public Cart(Long tableId, Long itemId, int quantity) {
        this.tableId = tableId;
        this.itemId = itemId;
        this.quantity = quantity;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public Long getTableId() {
        return tableId;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}