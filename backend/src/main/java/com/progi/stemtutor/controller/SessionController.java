package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.JaaSTokenResponse;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.service.JaaSTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/video-sessions")
@RequiredArgsConstructor // Ovo rješava "Cannot resolve symbol jaasTokenService"
public class SessionController {

    private final JaaSTokenService jaasTokenService;

    @GetMapping("/{reservationId}/join")
    public ResponseEntity<JaaSTokenResponse> joinSession(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal User user
    ) throws Exception {

        String roomName = "stemtutor-reservation-" + reservationId;
        boolean isInstructor = user.getRole().name().equalsIgnoreCase("instructor");

        JaaSTokenResponse response = jaasTokenService.generateToken(
                roomName,
                user.getFirstName() + " " + user.getLastName(),
                isInstructor
        );

        return ResponseEntity.ok(response);
    }
}