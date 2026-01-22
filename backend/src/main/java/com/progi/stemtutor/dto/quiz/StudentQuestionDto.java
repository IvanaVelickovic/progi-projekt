package com.progi.stemtutor.dto.quiz;

import lombok.Data;

import java.util.List;

@Data
public class StudentQuestionDto {
    public String question_text;
    public String question_type; // input | options
    public List<String> options;
    public String question_difficulty;
    public String correct_answer;
}
