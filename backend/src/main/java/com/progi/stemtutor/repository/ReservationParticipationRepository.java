package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.InstructorSchedule;
import com.progi.stemtutor.model.ReservationParticipation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

@Repository
public interface ReservationParticipationRepository extends JpaRepository<ReservationParticipation, Long> {
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