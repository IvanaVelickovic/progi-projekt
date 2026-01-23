package com.progi.stemtutor.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class InstructorExpertiseDto {
    private boolean math;
    private boolean physics;
    private boolean it;
    private BigDecimal hourlyRate;
    private String introVideoUrl;
    private String references;
}