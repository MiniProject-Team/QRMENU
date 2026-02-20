package com.qrmenu.admin.dto;

import lombok.Data;

@Data
public class MenuDTO {

    private String name;
    private double price;
    private Long categoryId;
    private boolean available;
}