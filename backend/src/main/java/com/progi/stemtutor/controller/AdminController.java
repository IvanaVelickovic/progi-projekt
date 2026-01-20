package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.AdminReviewResponseDto;
import com.progi.stemtutor.dto.AdminUserResponseDto;
import com.progi.stemtutor.dto.AdminUserStatusUpdateDto;
import com.progi.stemtutor.service.AdminService;
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

    // Dohvat korisnika uz paginaciju
    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserResponseDto>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminService.getUsersPaged(page, size));
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
        adminService.updateUserStatus(id, dto.getStatus());
        return ResponseEntity.ok().build();
    }

    // Verifikacija korisnika
    @PutMapping("/users/{id}/verify")
    public ResponseEntity<Void> verifyUser(@PathVariable Long id) {
        adminService.verifyUser(id);
        return ResponseEntity.ok().build();
    }
}