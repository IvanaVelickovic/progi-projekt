package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("""
        SELECT q
        FROM Question q
        LEFT JOIN FETCH q.answerOptions
        WHERE q.quiz.quizId = :quizId
    """)
    List<Question> findQuestionsByQuizId(@Param("quizId") Long quizId);
}
