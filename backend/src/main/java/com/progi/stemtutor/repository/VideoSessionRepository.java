package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.VideoSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface VideoSessionRepository extends JpaRepository<VideoSession, Long> {

    @Query("""
            SELECT s
            FROM VideoSession s
            JOIN s.participants p
            WHERE p.user.id = :studentId AND p.role = com.progi.stemtutor.model.enums.UserRole.student
            """)
    List<VideoSession> findStudentSessions(Long studentId);

    @Query("""
            SELECT s
            FROM VideoSession s
            WHERE s.instructor.id = :instructorId
            """)
    List<VideoSession> findInstructorSessions(Long instructorId);

    Optional<VideoSession> findByReservationId(Long reservationId);
}
