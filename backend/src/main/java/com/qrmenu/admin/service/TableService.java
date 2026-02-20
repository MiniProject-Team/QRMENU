package com.qrmenu.admin.service;

import com.qrmenu.admin.dto.TableDTO;
import com.qrmenu.shared.model.TableEntity;
import com.qrmenu.shared.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TableService {

    private final TableRepository repo;

    public TableEntity add(TableDTO dto) {

        TableEntity t = new TableEntity();
        t.setTableNumber(dto.getTableNumber());
        t.setActive(dto.isActive());

        return repo.save(t);
    }

    public List<TableEntity> getAll() {
        return repo.findAll();
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}