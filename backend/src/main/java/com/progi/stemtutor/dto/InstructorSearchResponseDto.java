package com.progi.stemtutor.dto;

import com.progi.stemtutor.model.enums.AttendanceMode;
import com.progi.stemtutor.model.enums.SubjectType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InstructorSearchResponseDto {
    private Long id;
    private LocalDateTime scheduleDateTime;
    private Integer maxParticipants;
    private Long filledCount;
    private Integer durationMin;
    private BigDecimal price;
    private AttendanceMode attendanceMode;
    private SubjectType subjectName;
    private String instructorName;
    private Long instructorId;
}