package com.progi.stemtutor.dto;

import com.progi.stemtutor.model.enums.AttendanceMode;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class InstructorSearchRequestDto {

    private Long subjectId;
    private BigDecimal maxHourlyRate;
    private AttendanceMode attendanceMode;
    private String city;
    private String address;
}
