package com.progi.stemtutor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.progi.stemtutor.model.ScheduleQuizAssignment;

import java.util.List;

@Repository
public interface StudentQuizRepository extends JpaRepository<ScheduleQuizAssignment, Long> {

    @Query("""
        SELECT 
            q.quizId,
            q.quizTitle,
            q.quizDescription,
            s.datetime,
            i.user.id,
            CONCAT(u.firstName, ' ', u.lastName)
        FROM ScheduleQuizAssignment a
        JOIN a.quiz q
        JOIN a.instructorSchedule s
        JOIN s.instructor i
        JOIN User u ON u.id = i.user.id
        WHERE a.completed = false
    """)
    List<Object[]> findAvailableQuizzesForStudent();
}
