package com.qrmenu.admin.service;

import com.qrmenu.admin.dto.CategoryDTO;
import com.qrmenu.shared.model.Category;
import com.qrmenu.shared.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repo;

    public Category add(CategoryDTO dto) {

        Category c = new Category();
        c.setName(dto.getName());

        return repo.save(c);
    }

    public List<Category> getAll() {
        return repo.findAll();
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}