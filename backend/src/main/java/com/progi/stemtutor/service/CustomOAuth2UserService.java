package com.progi.stemtutor.service;

import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.enums.UserRole;
import com.progi.stemtutor.model.enums.UserStatus;
import com.progi.stemtutor.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);
    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        String firstName = (String) attributes.get("given_name");
        String lastName = (String) attributes.get("family_name");

        if (email == null) {
            logger.error("Google account email nije verificiran ili nedostaje. Prekidam prijavu.");
            throw new OAuth2AuthenticationException("Google account email not verified.");
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);

        User user = optionalUser.orElseGet(() -> {
            logger.info("Korisnik s emailom {} nije pronađen. Kreiranje novog korisnika.", email);
            User newUser = User.builder() // Koristi builder!
                    .email(email)
                    .firstName(firstName != null ? firstName : "")
                    .lastName(lastName != null ? lastName : "")
                    .passwordHash(null)
                    .role(UserRole.student)
                    .status(UserStatus.active)
                    .createdAt(Instant.now())
                    .lastLogin(Instant.now())
                    .build();

            return userRepository.save(newUser);
        });

        user.setLastLogin(Instant.now());
        userRepository.save(user);

        return oAuth2User;
//        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
//
//        return new DefaultOAuth2User(
//                authorities,
//                oAuth2User.getAttributes(),
//                "email" // ključ koji predstavlja 'username' u atributima
//        ); // Spring Security will store authentication info
    }
}

