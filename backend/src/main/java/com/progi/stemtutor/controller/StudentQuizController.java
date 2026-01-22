package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.quiz.StudentQuestionDto;
import com.progi.stemtutor.dto.quiz.StudentQuizPreviewDto;
import com.progi.stemtutor.service.StudentQuizService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/student")
public class StudentQuizController {
    private final StudentQuizService quizService;

    public StudentQuizController(StudentQuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/quizzes")
    public List<StudentQuizPreviewDto> getStudentQuizzes() {
        return quizService.getQuizPreviews();
    }

    @GetMapping("/startQuiz")
    public List<StudentQuestionDto> startQuiz(@RequestParam Long id) {
        return quizService.startQuiz(id);
    }
}
