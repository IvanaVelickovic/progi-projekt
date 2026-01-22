package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.InstructorSchedule;
import com.progi.stemtutor.model.ReservationParticipation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface ReservationParticipationRepository extends JpaRepository<ReservationParticipation, Long> {

    @Query(value = "SELECT to_char(reservation_created_at, 'YYYY-MM') as month, COUNT(*) as count " +
            "FROM reservations " +
            "WHERE reservation_created_at > CURRENT_DATE - INTERVAL '12 months' " +
            "GROUP BY month ORDER BY month ASC", nativeQuery = true)
    List<Object[]> getMonthlyReservationsNative();
    boolean existsByReservationScheduleScheduleIdAndStudentId(
            Long scheduleId,
            Long studentId
    );

    @Query("""
        select rp.reservation.schedule
        from ReservationParticipation rp
        where rp.student.id = :studentId
    """)
    List<InstructorSchedule> findSchedulesByStudentId(Long studentId);

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