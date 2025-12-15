package com.progi.stemtutor.service;

import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.enums.UserRole;
import com.progi.stemtutor.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SetupService {

    private final UserRepository userRepository;

    @Transactional
    public User updateUserRole(String email, UserRole newRole) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != UserRole.noRole) {
            throw new IllegalStateException("Role already set");
        }

        user.setRole(newRole);
        return userRepository.save(user);
    }
}
