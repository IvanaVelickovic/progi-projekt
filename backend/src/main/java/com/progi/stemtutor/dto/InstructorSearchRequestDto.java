package com.progi.stemtutor.dto;

import com.progi.stemtutor.model.enums.AttendanceMode;
import com.progi.stemtutor.model.enums.SubjectName;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Setter
@Getter
public class InstructorSearchRequestDto {

    @NotNull(message = "Page is required")
    @Min(0)
    private Integer page;

    @NotNull(message = "Limit is required")
    @Min(1)
    private Integer limit;

    private SubjectName subject;

    private AttendanceMode format;

    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    private LocalDate date;
    private LocalTime timeFrom;
    private LocalTime timeTo;

    private Integer rating;

    private Double lat;
    private Double lng;
    private Integer locationRadius;
}
