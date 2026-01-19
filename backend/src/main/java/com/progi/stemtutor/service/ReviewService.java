package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.ReviewRequestDto;
import com.progi.stemtutor.model.ReservationParticipation;
import com.progi.stemtutor.model.Review;
import com.progi.stemtutor.repository.ReservationParticipationRepository;
import com.progi.stemtutor.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReservationParticipationRepository participationRepository;

    public void saveReview(ReviewRequestDto dto) {
        ReservationParticipation participation = participationRepository.findById(dto.getReservationParticipationId())
                .orElseThrow(() -> new RuntimeException("Termin nije pronađen"));

        if (participation.getReview() != null) {
            throw new RuntimeException("Već ste ostavili recenziju za ovaj termin.");
        }

        Review review = Review.builder()
                .rating(dto.getRating())
                .comment(dto.getComment())
                .reservationParticipation(participation)
                .reviewCreatedAt(Instant.now())
                .isReviewRemoved(false)
                .build();

        reviewRepository.save(review);
    }
}