package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.ScheduleQuizAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleQuizAssignmentRepository
        extends JpaRepository<ScheduleQuizAssignment, Long> {

    @Query("""
        SELECT sqa.instructorSchedule.scheduleId
        FROM ScheduleQuizAssignment sqa
        WHERE sqa.quiz.quizId = :quizId
        AND sqa.instructorSchedule.scheduleId IN :scheduleIds
    """)
    List<Long> findAssignedScheduleIds(Long quizId, List<Long> scheduleIds);

    boolean existsByQuizQuizIdAndInstructorScheduleScheduleId(Long quizId, Long scheduleId);
}
