package com.qrmenu.admin.controller;

import com.qrmenu.admin.dto.ReportDTO;
import com.qrmenu.admin.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/daily")
    public ReportDTO dailyReport() {
        return reportService.getDailyReport();
    }

    @GetMapping("/weekly")
    public ReportDTO weeklyReport() {
        return reportService.getWeeklyReport();
    }

    @GetMapping("/monthly")
    public ReportDTO monthlyReport() {
        return reportService.getMonthlyReport();
    }
}
