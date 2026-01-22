package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {

    @Query("""
    SELECT q.quizId,
           q.quizTitle,
           q.quizDescription,
           COUNT(ques),
           q.quizCreatedAt
    FROM Quiz q
    LEFT JOIN q.questions ques
    WHERE q.instructor.user.id = :instructorId
    GROUP BY q.quizId, q.quizTitle, q.quizDescription, q.quizCreatedAt
""")
    List<Object[]> findQuizPreviews(@Param("instructorId") Long instructorId);
}
