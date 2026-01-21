package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("""
        SELECT DISTINCT r
        FROM Reservation r
        JOIN FETCH r.schedule s
        JOIN FETCH s.instructor i
        JOIN FETCH r.participations p
        JOIN FETCH p.student st
        JOIN FETCH st.user u
        JOIN FETCH s.instructorSubject isub
        WHERE i.id = :instructorId
    """)
    List<Reservation> findForInstructorDashboard(
            @Param("instructorId") Long instructorId
    );
}
