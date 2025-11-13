package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.LoginRequest;
import com.progi.stemtutor.dto.SignupRequest;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public User signup(SignupRequest input) {
        User user = new User(input.getFirstName(), input.getLastName(), input.getEmail(), passwordEncoder.encode(input.getPassword()), input.getRole());
        return userRepository.save(user);
    }

    public User authenticate(LoginRequest input) {
        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user;
    }
}