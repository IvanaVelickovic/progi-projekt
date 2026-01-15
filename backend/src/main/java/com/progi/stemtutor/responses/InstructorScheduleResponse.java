package com.progi.stemtutor.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.progi.stemtutor.model.enums.AttendanceMode;
import com.progi.stemtutor.model.enums.ScheduleStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstructorScheduleResponse {

    private Long scheduleId;
    private String datetime;

    private Integer durationMin;
    private BigDecimal price;
    private AttendanceMode attendanceMode;
    private Integer maxParticipants;
    private ScheduleStatus status;
    private String googleCalendarId;
    private Integer instructorId;
}