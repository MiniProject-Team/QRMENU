package com.qrmenu.admin.dto;

import lombok.Data;

@Data
public class MenuDTO {
    private String name;
    private String description;
    private double price;
    private Long categoryId;
    private String imageUrl;
    private boolean available;
}