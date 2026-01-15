package com.progi.stemtutor.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InstructorSummaryDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String profileImageUrl;
    private Double averageRating;
    private Integer reviewCount;
}
