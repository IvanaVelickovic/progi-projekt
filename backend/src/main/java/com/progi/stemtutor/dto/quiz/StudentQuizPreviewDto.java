package com.progi.stemtutor.dto.quiz;

import lombok.Data;

@Data
public class StudentQuizPreviewDto {
    public Long quiz_id;
    public String quiz_name;
    public String quiz_description;
    public String schedule_datetime;
    public Long instructor_id;
    public String instructor_name;
}
