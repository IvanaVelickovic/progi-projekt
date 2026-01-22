package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("""
    SELECT r FROM Reservation r
    JOIN r.participations p
    WHERE r.reservationStatus = 'pending'
      AND r.reminder24hSent = false
      AND r.schedule.datetime BETWEEN :from AND :to
""")
    List<Reservation> findReservationsFor24hReminder(
            LocalDateTime from,
            LocalDateTime to
    );

    @Query("""
    SELECT r FROM Reservation r
    JOIN r.participations p
    WHERE r.reservationStatus = 'pending'
      AND r.reminder1hSent = false
      AND r.schedule.datetime BETWEEN :from AND :to
""")
    List<Reservation> findReservationsFor1hReminder(
            LocalDateTime from,
            LocalDateTime to
    );
}
