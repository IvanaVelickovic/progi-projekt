package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByReservationParticipationId(Long participationId);

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
