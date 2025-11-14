package com.progi.stemtutor.config;

import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.enums.UserRole;
import com.progi.stemtutor.model.enums.UserStatus;
import com.progi.stemtutor.repository.UserRepository;
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

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public OAuth2SuccessHandler(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = (String) oauthUser.getAttributes().get("email");
        String firstName = (String) oauthUser.getAttributes().get("given_name");
        String lastName = (String) oauthUser.getAttributes().get("family_name");

        // Ako korisnik ne postoji -> kreiraj novog
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(email)
                            .firstName(firstName)
                            .lastName(lastName)
                            .passwordHash(null)
                            .role(UserRole.student)
                            .status(UserStatus.active)
                            .isVerified(true)
                            .createdAt(Instant.now())
                            .lastLogin(Instant.now())
                            .build();
                    return userRepository.save(newUser);
                });

        user.setLastLogin(Instant.now());
        userRepository.save(user);

        // Generiraj JWT token
        String jwt = jwtService.generateToken(user);
        String redirectUrl = "http://localhost:5173/oauth2/callback?token=" + jwt;

        response.sendRedirect(redirectUrl);
    }
}

