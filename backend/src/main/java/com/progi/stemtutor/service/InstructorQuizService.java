package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.quiz.AddQuizRequestDto;
import com.progi.stemtutor.dto.quiz.QuizPreviewDto;
import com.progi.stemtutor.model.*;
import com.progi.stemtutor.model.enums.QuestionType;
import com.progi.stemtutor.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

import java.util.List;

@Service
@Transactional
public class InstructorQuizService {
    private final QuizRepository quizRepository;
    private final ScheduleQuizAssignmentRepository assignmentRepository;
    private final InstructorScheduleRepository scheduleRepository;
    private final InstructorRepository instructorRepository;
    private final InstructorSubjectRepository instructorSubjectRepository;

    public InstructorQuizService(
            QuizRepository quizRepository,
            ScheduleQuizAssignmentRepository assignmentRepository,
            InstructorScheduleRepository scheduleRepository,
            InstructorRepository instructorRepository,
            InstructorSubjectRepository instructorSubjectRepository) {
        this.quizRepository = quizRepository;
        this.assignmentRepository = assignmentRepository;
        this.scheduleRepository = scheduleRepository;
        this.instructorRepository = instructorRepository;
        this.instructorSubjectRepository = instructorSubjectRepository;
    }

    public List<QuizPreviewDto> getQuizPreviews(Long instructorId) {
        return quizRepository.findQuizPreviews(instructorId)
                .stream()
                .map(row -> {
                    QuizPreviewDto dto = new QuizPreviewDto();
                    dto.quiz_id = (Long) row[0];
                    dto.quiz_name = (String) row[1];
                    dto.quiz_description = (String) row[2];
                    dto.numberOfQuestions = ((Long) row[3]).intValue();
                    dto.quiz_created_at = row[4].toString();
                    return dto;
                }).toList();
    }

    public void deleteQuiz(Long quizId) {
        quizRepository.deleteById(quizId);
    }

    public List<Long> getSelectedSchedules(Long quizId, List<Long> scheduleIds) {
        return assignmentRepository.findAssignedScheduleIds(quizId, scheduleIds);
    }

    public void assignQuizToSchedules(Long quizId, List<Long> scheduleIds) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow();

        for (Long scheduleId : scheduleIds) {
            if (!assignmentRepository
                    .existsByQuizQuizIdAndInstructorScheduleScheduleId(quizId, scheduleId)) {

                InstructorSchedule schedule = scheduleRepository.findById(scheduleId)
                        .orElseThrow();

                ScheduleQuizAssignment a = new ScheduleQuizAssignment();
                a.setQuiz(quiz);
                a.setInstructorSchedule(schedule);
                a.setAssignmentUrl(UUID.randomUUID().toString());
                a.setCompleted(false);

                assignmentRepository.save(a);
            }
        }
    }

    public void addQuiz(AddQuizRequestDto request, Long instructorId) {

        Instructor instructor = instructorRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));


        Quiz quiz = new Quiz();
        quiz.setQuizTitle(request.quiz_title);
        quiz.setQuizDescription(request.quiz_description);
        quiz.setQuizCreatedAt(LocalDateTime.now());
        quiz.setInstructor(instructor);

        for (AddQuizRequestDto.QuestionRequest qReq : request.questions) {

            Question question = new Question();
            question.setQuiz(quiz);
            question.setQuestionText(qReq.text);
            question.setCorrectAnswer(qReq.correct);
            question.setQuestionExplanation("");
            question.setQuestionDifficulty(mapDifficulty(qReq.difficulty));
            question.setQuestionType(mapQuestionType(qReq.type));

            if ("options".equals(qReq.type)) {
                for (String optionText : qReq.options) {
                    AnswerOption option = new AnswerOption();
                    option.setOptionText(optionText);
                    option.setAnswerCorrect(optionText.equals(qReq.correct));
                    option.setQuestion(question);
                    question.getAnswerOptions().add(option);
                }
            }

            quiz.getQuestions().add(question);
        }

        quizRepository.save(quiz);
    }

    private int mapDifficulty(String difficulty) {
        return switch (difficulty) {
            case "easy" -> 1;
            case "medium" -> 2;
            default -> 3;
        };
    }

    private QuestionType mapQuestionType(String type) {
        return "input".equals(type)
                ? QuestionType.short_answer
                : QuestionType.multiple_choice;
    }
}
