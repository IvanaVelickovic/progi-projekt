package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.AdminDashboardStatsDto;
import com.progi.stemtutor.dto.MonthlyReservationDto;
import com.progi.stemtutor.model.ReservationParticipation;
import com.progi.stemtutor.repository.ReservationParticipationRepository;
import com.progi.stemtutor.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final ReviewRepository reviewRepository;
    private final ReservationParticipationRepository reservationRepository;

    public AdminDashboardStatsDto getSummaryStats() {
        Double avg = reviewRepository.getAverageRating();
        long total = reviewRepository.countAllActiveReviews();
        long fiveStars = reviewRepository.countFiveStarReviews();

        double satisfaction = (total > 0) ? ((double) fiveStars / total) * 100 : 0;

        return AdminDashboardStatsDto.builder()
                .overallAverageRating(avg != null ? avg : 0.0)
                .totalRatingsCount(total)
                .fiveStarRatingsCount(fiveStars)
                .build();
    }

    public List<MonthlyReservationDto> getMonthlyReservations() {
        return reservationRepository.getMonthlyReservationsNative().stream()
                .map(obj -> new MonthlyReservationDto((String) obj[0], ((Number) obj[1]).longValue()))
                .collect(Collectors.toList());
    }
}