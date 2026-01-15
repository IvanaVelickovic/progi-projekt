package com.progi.stemtutor.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/google")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class GoogleAuthController {

    private final OAuth2AuthorizedClientService authorizedClientService;

    @GetMapping("/status")
    public ResponseEntity<Boolean> getGoogleStatus(Authentication authentication) {
        // Ako nema autentifikacije (JWT nije poslan), odmah vrati false
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(false);
        }

        // Provjeri imamo li Google Access Token spremljen za ovog korisnika
        // Napomena: Ovo će raditi samo ako se korisnik ulogirao preko Google OAuth2 tipke
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                "google",
                authentication.getName()
        );

        boolean isConnected = (client != null && client.getAccessToken() != null);
        return ResponseEntity.ok(isConnected);
    }
}