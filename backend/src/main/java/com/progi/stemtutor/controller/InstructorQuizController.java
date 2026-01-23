package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.quiz.*;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.service.InstructorQuizService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/instructor")
public class InstructorQuizController {
    private final InstructorQuizService quizService;

    public InstructorQuizController(InstructorQuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/quizzes")
    public List<QuizPreviewDto> getQuizzes(@AuthenticationPrincipal User user) {
        return quizService.getQuizPreviews(user.getId());
    }

    @PostMapping("/deleteQuiz")
    public void deleteQuiz(@RequestBody DeleteQuizRequestDto request) {
        quizService.deleteQuiz(request.quiz_id);
    }

    @GetMapping("/selectedSchedules")
    public List<Long> selectedSchedules(
            @RequestParam Long quiz_id,
            @RequestParam List<Long> instructor_schedule_ids
    ) {
        return quizService.getSelectedSchedules(quiz_id, instructor_schedule_ids);
    }

    @PostMapping("/addToSchedule")
    public void addToSchedule(@RequestBody AddQuizToScheduleRequestDto request) {
        quizService.assignQuizToSchedules(
                request.quiz_id,
                request.schedule_ids
        );
    }

    @PostMapping("/addQuiz")
    public void addQuiz(
            @RequestBody AddQuizRequestDto request,
            @AuthenticationPrincipal User user) {

        quizService.addQuiz(request, user.getId());
    }
}
