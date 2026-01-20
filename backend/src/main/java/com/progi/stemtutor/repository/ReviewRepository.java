package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByReservationParticipationId(Long participationId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.isReviewRemoved = false")
    Double getAverageRating();

    @Query("SELECT COUNT(r) FROM Review r WHERE r.isReviewRemoved = false")
    long countAllActiveReviews();

    @Query("SELECT COUNT(r) FROM Review r WHERE r.isReviewRemoved = false AND r.rating = 5")
    long countFiveStarReviews();

    @Query("SELECT r FROM Review r WHERE r.isReviewRemoved = false")
    List<Review> findAllActiveReviews();
}
