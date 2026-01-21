package com.progi.stemtutor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class JaaSTokenResponse {
    private String roomName;
    private String displayName;
    private boolean isInstructor;
    private String jwt; // ovo se koristi za JaaS autentifikaciju
}
