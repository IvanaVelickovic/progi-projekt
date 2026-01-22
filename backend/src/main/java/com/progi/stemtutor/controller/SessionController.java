package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.JaaSTokenResponse;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.enums.UserRole;
import com.progi.stemtutor.service.JaaSTokenService;
import com.progi.stemtutor.service.VideoSessionTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/video-sessions")
@RequiredArgsConstructor
public class SessionController {

    private final JaaSTokenService jaasTokenService;
    private final VideoSessionTrackingService videoSessionTrackingService;

    @GetMapping("/{reservationId}/join")
    public ResponseEntity<JaaSTokenResponse> joinSession(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal User user
    ) throws Exception {

        boolean isInstructor =
                user.getRole().name().equalsIgnoreCase("instructor");

        videoSessionTrackingService.onJoin(
                reservationId,
                user,
                isInstructor ? UserRole.instructor : UserRole.student
        );

        String roomName = "stemtutor-reservation-" + reservationId;

        JaaSTokenResponse response = jaasTokenService.generateToken(
                roomName,
                user.getFirstName() + " " + user.getLastName(),
                isInstructor
        );

        return ResponseEntity.ok(response);
    }
}
