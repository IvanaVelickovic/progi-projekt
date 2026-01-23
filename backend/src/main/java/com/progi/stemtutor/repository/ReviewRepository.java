package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.Review;
import org.checkerframework.checker.nullness.qual.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;
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

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE FROM reviews WHERE review_id = :id", nativeQuery = true)
    void deleteById(@Param("id") @NonNull Long id);

    @Query("""
        SELECT r
        FROM Review r
        JOIN r.reservationParticipation rp
        JOIN rp.reservation res
        JOIN res.schedule s
        JOIN s.instructor i
        WHERE i.user.id = :instructorId
          AND r.isReviewRemoved = false
    """)

    List<Review> findAllByInstructorId(@Param("instructorId") Long instructorId);
}
