package com.qrmenu.admin.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.qrmenu.admin.service.QRService;
import com.qrmenu.shared.model.TableEntity;
import com.qrmenu.shared.repository.TableRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/qr")
@RequiredArgsConstructor
public class QRController {

    private final QRService qrService;
    private final TableRepository tableRepository;

    @Value("${app.base-url:http://localhost:5173}")
    private String baseUrl;

    /**
     * Generate QR code for a specific table
     */
    @GetMapping("/table/{tableId}")
    public ResponseEntity<Map<String, String>> generateTableQR(@PathVariable Long tableId) {
        TableEntity table = tableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Table not found"));

        String qrUrl = qrService.generateTableQRUrl(baseUrl, tableId);
        String qrCodeBase64 = qrService.generateQRCodeBase64(qrUrl);

        Map<String, String> response = new HashMap<>();
        response.put("tableId", tableId.toString());
        Integer tableNumber = table.getTableNumber();
        response.put("tableNumber", tableNumber != null ? tableNumber.toString() : table.getId().toString());
        response.put("qrUrl", qrUrl);
        response.put("qrCode", qrCodeBase64);

        return ResponseEntity.ok(response);
    }

    /**
     * Generate QR codes for all tables
     */
    @GetMapping("/all-tables")
    public ResponseEntity<List<Map<String, String>>> generateAllTableQRs() {
        List<TableEntity> tables = tableRepository.findAll();

        List<Map<String, String>> qrCodes = tables.stream()
                .map(table -> {
                    String qrUrl = qrService.generateTableQRUrl(baseUrl, table.getId());
                    String qrCodeBase64 = qrService.generateQRCodeBase64(qrUrl);

                    Map<String, String> qrData = new HashMap<>();
                    qrData.put("tableId", table.getId().toString());
                    Integer tableNumber = table.getTableNumber();
                    qrData.put("tableNumber", tableNumber != null ? tableNumber.toString() : table.getId().toString());
                    qrData.put("qrUrl", qrUrl);
                    qrData.put("qrCode", qrCodeBase64);
                    return qrData;
                })
                .toList();

        return ResponseEntity.ok(qrCodes);
    }

    /**
     * Get the base URL configuration
     */
    @GetMapping("/config")
    public ResponseEntity<Map<String, String>> getConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("baseUrl", baseUrl);
        return ResponseEntity.ok(config);
    }
}
