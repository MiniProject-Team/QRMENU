package com.qrmenu.shared.model;

import jakarta.persistence.*;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long menuItemId;
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    // GETTERS & SETTERS
    public void setOrder(Order order) {
        this.order = order;
    }
}