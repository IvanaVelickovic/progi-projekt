package com.progi.stemtutor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class InstructorProfileDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String biography;
    private String introVideoUrl;
    private boolean math;
    private boolean physics;
    private boolean it;
    private BigDecimal longitude;
    private BigDecimal latitude;
    private BigDecimal hourlyRate;
    private String references;
    private String expertiseAreas;
}
