package com.progi.stemtutor.config;

import com.progi.stemtutor.model.User;
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
import java.util.Optional;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public OAuth2SuccessHandler(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService =  jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = (String) oauthUser.getAttributes().get("email");
        System.out.println("AAAAAAAAAAAAAAAAAAAAAAAAAA " + email);
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
            return;
        }

        User user = optionalUser.get();

        // Generate your app’s token
        String jwt = jwtService.generateToken(user);

        // Redirect back to your frontend app with the token in the URL
        String redirectUrl = "http://localhost:3000/oauth2/callback?token=" + jwt;
        response.sendRedirect(redirectUrl);
    }
}

