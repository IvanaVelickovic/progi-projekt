package com.progi.stemtutor.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
@AllArgsConstructor
public class InstructorSearchResponseDto {

    private Long instructorId;
    private String firstName;
    private String lastName;
    private BigDecimal hourlyRate;
    private Double averageRating;
    private String city;
    private String address;
}
