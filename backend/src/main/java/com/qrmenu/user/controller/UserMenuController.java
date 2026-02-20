package com.qrmenu.user.controller;

import com.qrmenu.shared.model.MenuItem;
import com.qrmenu.user.service.UserMenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/menu")
@RequiredArgsConstructor
public class UserMenuController {

    private final UserMenuService service;

    @GetMapping
    public List<MenuItem> getMenu() {
        return service.getMenu();
    }
}