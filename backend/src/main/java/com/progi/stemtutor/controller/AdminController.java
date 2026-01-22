package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.*;
import com.progi.stemtutor.service.AdminService;
import com.progi.stemtutor.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Osigurava da samo admini pristupaju
public class AdminController {

    private final AdminService adminService;
    private final AdminStatsService adminStatsService;

    // Dohvat korisnika uz paginaciju
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // Dohvat svih recenzija (uključujući obrisane)
    @GetMapping("/reviews")
    public ResponseEntity<List<AdminReviewResponseDto>> getAllReviews() {
        return ResponseEntity.ok(adminService.getAllReviews());
    }

    // Sakrivanje/Prikazivanje recenzije
    @PutMapping("/reviews/{id}/toggle")
    public ResponseEntity<Void> toggleReview(@PathVariable Long id) {
        adminService.toggleReviewVisibility(id);
        return ResponseEntity.ok().build();
    }

    // Upravljanje statusom korisnika
    @PutMapping("/users/{id}/status")
    public ResponseEntity<Void> updateUserStatus(@PathVariable Long id, @RequestBody AdminUserStatusUpdateDto dto) {
        adminService.updateUserStatus(id, dto);
        return ResponseEntity.ok().build();
    }

    // Verifikacija korisnika
    @PutMapping("/users/{id}/verify")
    public ResponseEntity<Void> verifyUser(@PathVariable Long id) {
        adminService.verifyUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats/summary")
    public ResponseEntity<AdminDashboardStatsDto> getSummary() {
        return ResponseEntity.ok(adminStatsService.getSummaryStats());
    }

    @GetMapping("/stats/reservations-chart")
    public ResponseEntity<List<MonthlyReservationDto>> getChartData() {
        return ResponseEntity.ok(adminStatsService.getMonthlyReservations());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.hardDeleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        adminService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}