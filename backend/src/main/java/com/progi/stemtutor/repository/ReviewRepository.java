package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByReservationParticipationId(Long participationId);
}
