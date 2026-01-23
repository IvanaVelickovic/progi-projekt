package com.progi.stemtutor.config;

import com.progi.stemtutor.model.User;
import com.progi.stemtutor.service.AuthenticationService;
import com.progi.stemtutor.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;
    private final OAuth2AuthorizedClientService authorizedClientService;

    public OAuth2SuccessHandler(AuthenticationService authenticationService, JwtService jwtService, OAuth2AuthorizedClientService authorizedClientService) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
        this.authorizedClientService = authorizedClientService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;

        // 1. Dohvaćanje Google Access Tokena
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                oauthToken.getAuthorizedClientRegistrationId(),
                oauthToken.getName()
        );

        String googleAccessToken = (client != null && client.getAccessToken() != null)
                ? client.getAccessToken().getTokenValue()
                : null;

        String googleId = (String) oauthUser.getAttributes().get("sub");
        String email = (String) oauthUser.getAttributes().get("email");
        String firstName = (String) oauthUser.getAttributes().get("given_name");
        String lastName = (String) oauthUser.getAttributes().get("family_name");

        User user = authenticationService.handleGoogleLogin(googleId, email, firstName, lastName);

        // 2. Priprema claimova za naš JWT
        Map<String, Object> extraClaims = new HashMap<>();
        if (googleAccessToken != null) {
            extraClaims.put("googleToken", googleAccessToken);
            System.out.println("✅ SuccessHandler: Google Token spakiran u JWT");
        }

        // 3. GENERIRANJE TOKENA (Ovdje je bila greška - sada šaljemo extraClaims)
        String jwt = jwtService.generateToken(extraClaims, user);

        String redirectUrl = "http://localhost:5173/oauth2/callback?token=" + URLEncoder.encode(jwt, StandardCharsets.UTF_8);
        response.sendRedirect(redirectUrl);
    }
}