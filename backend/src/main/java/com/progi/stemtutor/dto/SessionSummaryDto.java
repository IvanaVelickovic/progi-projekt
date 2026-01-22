package com.progi.stemtutor.dto;

import java.util.List;

public record SessionSummaryDto(
        Long summaryId,
        Long reservationId,
        String subject,
        String date,
        Long durationMin,
        String instructorName,
        List<String> studentNames,
        String role
) {}
