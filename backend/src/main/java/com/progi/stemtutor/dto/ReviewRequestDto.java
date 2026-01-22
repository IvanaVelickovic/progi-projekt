package com.progi.stemtutor.dto;

import lombok.Data;

@Data
public class ReviewRequestDto {
    private Long reservationParticipationId;
    private int rating;
    private String comment;
}
