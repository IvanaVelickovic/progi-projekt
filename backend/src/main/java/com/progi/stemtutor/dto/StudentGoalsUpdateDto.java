package com.progi.stemtutor.dto;

public record UpdateStudentRequest(
        String firstName,
        String lastName,
        String grade
) {}
