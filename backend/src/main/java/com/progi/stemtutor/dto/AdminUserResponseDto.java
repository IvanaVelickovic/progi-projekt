package com.progi.stemtutor.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminUserResponseDto {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String status;
    private boolean isVerified;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}
