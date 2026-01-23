package com.progi.stemtutor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlyReservationDto {
    private String month; // npr. "12-2025"
    private long count;
}