package com.qrmenu.shared.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    private String description;

    @Column(nullable = false)
    private double price;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_available")
    private boolean available = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}