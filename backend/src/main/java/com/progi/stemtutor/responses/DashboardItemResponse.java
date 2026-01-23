package com.progi.stemtutor.responses;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record DashboardItemResponse(
        Long reservationId,
        String subject,
        LocalDate date,
        LocalTime time,
        Integer durationMin,
        String status,

        String instructorName,

        List<String> studentNames
) {}
