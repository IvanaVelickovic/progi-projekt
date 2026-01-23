package com.progi.stemtutor.controller;

import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.enums.UserRole;
import com.progi.stemtutor.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class Dashboard {

    private final DashboardService dashboardService;

    @GetMapping("/student/video-sessions")
    public ResponseEntity<?> studentDashboard(@AuthenticationPrincipal User user) {
        if(user.getRole() != UserRole.student) throw new RuntimeException();
        return ResponseEntity.ok(dashboardService.studentDashboard(user.getId()));
    }

    @GetMapping("/instructor/video-sessions")
    public ResponseEntity<?> instructorDashboard(@AuthenticationPrincipal User user) {
        if(user.getRole() != UserRole.instructor) throw new RuntimeException();
        return ResponseEntity.ok(dashboardService.instructorDashboard(user.getId()));
    }
}