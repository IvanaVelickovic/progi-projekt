package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.VideoSessionEndDto;
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

    @PostMapping("/api/video-sessions/{reservationId}/end")
    public ResponseEntity<VideoSessionEndDto> endSession(
            @PathVariable Long reservationId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        VideoSession session = videoSessionRepository
                .findByReservationId(reservationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Video session not found"
                ));

        VideoSessionEndDto response =
                videoSessionTrackingService.onLeave(session, user);

        return ResponseEntity.ok(response);
    }
}
