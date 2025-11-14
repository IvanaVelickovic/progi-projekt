package com.progi.stemtutor.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UpdateStudentSubjectRequest(
        String knowledgeLevel,
        String learningGoals
) {}

