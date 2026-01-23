package com.progi.stemtutor.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


public record DashboardItemResponseStudent(
        Long reservationId,
        Long participationId,
        String subject,
        LocalDate date,
        LocalTime time,
        Integer durationMin,
        String status,
        String instructorName
) {}
