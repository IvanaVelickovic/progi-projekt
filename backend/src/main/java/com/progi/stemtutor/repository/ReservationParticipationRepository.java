package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.InstructorSchedule;
import com.progi.stemtutor.model.ReservationParticipation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
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
}