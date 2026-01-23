package com.progi.stemtutor.dto.quiz;

import lombok.Data;

import java.util.List;

@Data
public class AddQuizRequestDto {
    public String quiz_title;
    public String quiz_description;
    public List<QuestionRequest> questions;

    public static class QuestionRequest {
        public String text;
        public String type; // "input" | "options"
        public String difficulty; // easy | medium | hard
        public List<String> options;
        public String correct;
    }
}
