package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.quiz.StudentQuestionDto;
import com.progi.stemtutor.dto.quiz.StudentQuizPreviewDto;
import com.progi.stemtutor.model.AnswerOption;
import com.progi.stemtutor.model.Question;
import com.progi.stemtutor.model.enums.QuestionType;
import com.progi.stemtutor.repository.QuestionRepository;
import com.progi.stemtutor.repository.QuizRepository;
import com.progi.stemtutor.repository.StudentQuizRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class StudentQuizService {
    private final StudentQuizRepository studentQuizRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;

    public StudentQuizService(
            StudentQuizRepository studentQuizRepository,
            QuizRepository quizRepository, QuestionRepository questionRepository) {
        this.studentQuizRepository = studentQuizRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
    }

    public List<StudentQuizPreviewDto> getQuizPreviews() {

        return studentQuizRepository.findAvailableQuizzesForStudent()
                .stream()
                .map(row -> {
                    StudentQuizPreviewDto dto = new StudentQuizPreviewDto();
                    dto.quiz_id = (Long) row[0];
                    dto.quiz_name = (String) row[1];
                    dto.quiz_description = (String) row[2];
                    dto.schedule_datetime = row[3].toString();
                    dto.instructor_id = (Long) row[4];
                    dto.instructor_name = (String) row[5];
                    return dto;
                }).toList();
    }

    public List<StudentQuestionDto> startQuiz(Long quizId) {

        List<Question> questions = questionRepository.findQuestionsByQuizId(quizId);

        return questions.stream().map(q -> {
            StudentQuestionDto dto = new StudentQuestionDto();
            dto.question_text = q.getQuestionText();
            dto.question_type =
                    q.getQuestionType() == QuestionType.short_answer
                            ? "input"
                            : "options";

            dto.options = q.getAnswerOptions()
                    .stream()
                    .map(AnswerOption::getOptionText)
                    .toList();

            dto.question_difficulty = switch (q.getQuestionDifficulty()) {
                case 1 -> "easy";
                case 2 -> "medium";
                default -> "hard";
            };

            dto.correct_answer = q.getCorrectAnswer();
            return dto;
        }).toList();
    }
}
