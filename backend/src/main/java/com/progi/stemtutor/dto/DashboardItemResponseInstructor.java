package com.progi.stemtutor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardItemResponseInstructor {
    Long reservationId;
    List<Long> participationIds;
    String subject;
    LocalDate date;
    LocalTime time;
    Integer durationMin;
    String status;
    List<String> studentNames;
}
