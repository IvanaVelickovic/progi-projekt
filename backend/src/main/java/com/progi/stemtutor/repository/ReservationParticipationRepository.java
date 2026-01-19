package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.ReservationParticipation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationParticipationRepository extends JpaRepository<ReservationParticipation, Long> {
}