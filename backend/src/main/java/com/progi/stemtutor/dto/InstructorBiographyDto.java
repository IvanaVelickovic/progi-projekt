package com.progi.stemtutor.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class InstructorBiographyDto {
    private String biography;
    private BigDecimal longitude;
    private BigDecimal latitude;
}
