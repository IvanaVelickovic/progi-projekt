package com.progi.stemtutor.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.progi.stemtutor.model.enums.AttendanceMode;
import com.progi.stemtutor.model.enums.ScheduleStatus;
import com.progi.stemtutor.model.enums.SubjectName;
import lombok.*;
import java.math.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstructorScheduleRequestDTO {

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime datetime;

    private Integer durationMin;
    private BigDecimal price;
    private AttendanceMode attendanceMode;
    private Integer maxParticipants;
    private ScheduleStatus status;
    private Integer instructorId;
    public Boolean googleCalendar;
}
