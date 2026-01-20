package com.progi.stemtutor.dto;

import lombok.Data;

@Data
public class AdminReviewResponseDto {
    private Long reviewId;
    private int rating;
    private String comment;
    private String studentName;
    private String instructorName;
    private boolean isRemoved;
}