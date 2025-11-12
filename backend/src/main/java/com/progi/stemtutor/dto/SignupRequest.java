package com.progi.stemtutor.dto;

public record SignupRequest(
        String firstName,
        String lastName,
        String email,
        String password
) {}
