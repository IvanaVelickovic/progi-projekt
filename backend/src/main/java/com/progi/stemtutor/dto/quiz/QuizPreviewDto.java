package com.progi.stemtutor.dto.quiz;

import lombok.Data;

@Data
public class QuizPreviewDto {
    public Long quiz_id;
    public String quiz_name;
    public String quiz_description;
    public int numberOfQuestions;
    public String quiz_created_at;
}
