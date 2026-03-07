package com.qrmenu.admin.service;

import com.qrmenu.admin.dto.ReportDTO;
import com.qrmenu.shared.enums.OrderStatus;
import com.qrmenu.shared.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepo;

    public ReportDTO getDailyReport() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(LocalTime.MAX);
        return buildReport(start, end);
    }

    public ReportDTO getWeeklyReport() {
        LocalDateTime start = LocalDate.now().minusDays(7).atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(LocalTime.MAX);
        return buildReport(start, end);
    }

    public ReportDTO getMonthlyReport() {
        LocalDateTime start = LocalDate.now().minusDays(30).atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(LocalTime.MAX);
        return buildReport(start, end);
    }

    private ReportDTO buildReport(LocalDateTime start, LocalDateTime end) {
        var orders = orderRepo.findByCreatedAtBetween(start, end);
        long total = orders.size();
        long completed = orders.stream().filter(o -> o.getStatus() == OrderStatus.SERVED || o.getStatus() == OrderStatus.PAID).count();
        long cancelled = orders.stream().filter(o -> o.getStatus() == OrderStatus.CANCELLED).count();
        long pending = orders.stream().filter(o -> o.getStatus() == OrderStatus.PLACED || o.getStatus() == OrderStatus.ACCEPTED).count();
        double revenue = orders.stream()
                .filter(o -> o.getTotalAmount() != null)
                .filter(o -> o.getStatus() == OrderStatus.SERVED || o.getStatus() == OrderStatus.PAID)
                .mapToDouble(o -> o.getTotalAmount())
                .sum();
        return new ReportDTO(total, revenue, completed, cancelled, pending);
    }
}
