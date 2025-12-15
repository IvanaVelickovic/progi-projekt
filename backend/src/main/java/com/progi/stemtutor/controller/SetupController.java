package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.SetupRequest;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.responses.SetupResponse;
import com.progi.stemtutor.service.JwtService;
import com.progi.stemtutor.service.SetupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/setup")
@RestController
@RequiredArgsConstructor
public class SetupController {

    private final SetupService setupService;

    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<?> setupUserRole(@RequestBody SetupRequest request, Authentication auth) {

        if (auth == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        String email = auth.getName();

        try {
            User updatedUser = setupService.updateUserRole(email, request.getRole());
            String newToken = jwtService.generateToken(updatedUser);

            return ResponseEntity.ok().body(new SetupResponse(newToken));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
