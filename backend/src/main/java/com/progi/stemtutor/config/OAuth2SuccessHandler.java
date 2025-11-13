package com.progi.stemtutor.config;

import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.enums.UserRole;
import com.progi.stemtutor.model.enums.UserStatus;
import com.progi.stemtutor.repository.UserRepository;
import com.progi.stemtutor.service.AuthenticationService;
import com.progi.stemtutor.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;

    public OAuth2SuccessHandler(AuthenticationService authenticationService, JwtService jwtService) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String googleId = (String) oauthUser.getAttributes().get("sub");
        String email = (String) oauthUser.getAttributes().get("email");
        String firstName = (String) oauthUser.getAttributes().get("given_name");
        String lastName = (String) oauthUser.getAttributes().get("family_name");

        // Delegate account linking or creation to AuthenticationService
        User user = authenticationService.handleGoogleLogin(googleId, email, firstName, lastName);

        // Generate JWT
        String jwt = jwtService.generateToken(user);

        String redirectUrl = "http://localhost:5173/oauth2/callback?token=" + URLEncoder.encode(jwt, StandardCharsets.UTF_8);
        response.sendRedirect(redirectUrl);

        // Alternative JSON response for API clients:
        // response.setContentType("application/json");
        // response.getWriter().write("{\"token\":\"" + jwt + "\"}");
    }
}

