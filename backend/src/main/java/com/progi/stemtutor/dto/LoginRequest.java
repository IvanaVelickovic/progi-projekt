package com.progi.stemtutor.dto;

public record LoginRequest(
        String email,
        String password
) {}
