package com.progi.stemtutor.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class VideoSessionController {

    @PostMapping("/api/video-sessions/{sessionId}/end")
    public ResponseEntity<?> endSession(
            @PathVariable Long sessionId,
            Authentication authentication
    ) {
        String role = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"))
                ? "instructor"
                : "student";

        return ResponseEntity.ok(
                Map.of("role", role)
        );
    }
}
