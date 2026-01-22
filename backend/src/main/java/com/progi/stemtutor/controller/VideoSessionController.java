package com.progi.stemtutor.controller;

import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.VideoSession;
import com.progi.stemtutor.repository.VideoSessionRepository;
import com.progi.stemtutor.service.VideoSessionTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class VideoSessionController {

    private final VideoSessionTrackingService videoSessionTrackingService;
    private final VideoSessionRepository videoSessionRepository;

    @PostMapping("/api/video-sessions/{sessionId}/end")
    public ResponseEntity<?> endSession(
            @PathVariable Long sessionId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        VideoSession session = videoSessionRepository
                .findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Video session not found"
                ));

        videoSessionTrackingService.onLeave(session, user);

        String role = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"))
                ? "instructor"
                : "student";

        return ResponseEntity.ok(
                Map.of("role", role)
        );
    }
}
