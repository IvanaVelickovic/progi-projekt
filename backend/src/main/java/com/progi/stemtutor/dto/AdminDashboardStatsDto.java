package com.progi.stemtutor.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardStatsDto {
    private double overallAverageRating;
    private long totalRatingsCount;
    private long fiveStarRatingsCount;
}
