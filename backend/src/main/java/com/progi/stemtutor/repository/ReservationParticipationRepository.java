package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.ReservationParticipation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationParticipationRepository
        extends JpaRepository<ReservationParticipation, Long> {

    @Query("""
        SELECT rp
        FROM ReservationParticipation rp
        JOIN FETCH rp.reservation r
        JOIN FETCH r.schedule s
        JOIN FETCH s.instructor i
        JOIN FETCH i.user u
        JOIN FETCH s.instructorSubject isub
        WHERE rp.student.id = :studentId
    """)
    List<ReservationParticipation> findForStudentDashboard(
            @Param("studentId") Long studentId
    );
}
