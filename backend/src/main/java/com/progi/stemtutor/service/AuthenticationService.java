package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.LoginRequest;
import com.progi.stemtutor.dto.SignupRequest;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.enums.UserRole;
import com.progi.stemtutor.model.enums.UserStatus;
import com.progi.stemtutor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public User signup(SignupRequest input) {
        Optional<User> existingOpt = userRepository.findByEmail(input.getEmail());

        if (existingOpt.isPresent()) {
            User existingUser = existingOpt.get();

            if (existingUser.getGoogleId() != null && existingUser.getPassword() == null) {
                existingUser.setPasswordHash(passwordEncoder.encode(input.getPassword()));
                existingUser.setFirstName(input.getFirstName());
                existingUser.setLastName(input.getLastName());
                return userRepository.save(existingUser);
            }

            throw new RuntimeException("User with that email already exists.");
        }

        validatePassword(input.getPassword());

        User user = new User(
                input.getFirstName(),
                input.getLastName(),
                input.getEmail(),
                passwordEncoder.encode(input.getPassword())
        );
        return userRepository.save(user);
    }

    public void validatePassword(String value){
        if (value == null || value.length() < 8) {
            throw new IllegalArgumentException("Lozinka mora imati barem 8 znakova!");
        }
        if (!value.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("Lozinka mora imati barem jedno veliko slovo!");
        }
        if (!value.matches(".*[0-9].*")) {
            throw new IllegalArgumentException("Lozinka mora sadržavati barem jednu znamenku!");
        }
    }

    public User authenticate(LoginRequest input) {
        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user;
    }

    public User handleGoogleLogin(String googleId, String email, String firstName, String lastName) {
        return userRepository.findByEmail(email)
                .map(existingUser -> {
                    // Link Google account if not yet linked
                    if (existingUser.getGoogleId() == null) {
                        existingUser.setGoogleId(googleId);
                    }

                    existingUser.setLastLogin(Instant.now());
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    // Create new user if none exists
                    User newUser = User.builder()
                            .googleId(googleId)
                            .email(email)
                            .firstName(firstName != null ? firstName : "")
                            .lastName(lastName != null ? lastName : "")
                            .passwordHash(null)
                            .role(UserRole.noRole)
                            .status(UserStatus.active)
                            .isVerified(false)
                            .createdAt(Instant.now())
                            .lastLogin(Instant.now())
                            .build();
                    return userRepository.save(newUser);
                });
    }
}