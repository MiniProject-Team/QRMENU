package com.qrmenu.user.service;

import com.qrmenu.shared.model.MenuItem;
import com.qrmenu.shared.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserMenuService {

    private final MenuRepository menuRepo;

    public List<MenuItem> getMenu() {
        return menuRepo.findAll()
                .stream()
                .filter(MenuItem::isAvailable)
                .toList();
    }
}