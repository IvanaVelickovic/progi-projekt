package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.JaaSTokenResponse;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.service.JaaSTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final JaaSTokenService jaasTokenService;

    @GetMapping("/{reservationId}/join")
    public ResponseEntity<?> joinSession(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal User user
    ) throws Exception {

        // Ovdje možeš dohvatiti reservation iz DB da dobiješ naziv room-a
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
