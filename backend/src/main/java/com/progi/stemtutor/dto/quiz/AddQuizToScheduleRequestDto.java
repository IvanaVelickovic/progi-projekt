package com.progi.stemtutor.dto.quiz;

import lombok.Data;

import java.util.List;

@Data
public class AddQuizToScheduleRequestDto {
    public Long quiz_id;
    public List<Long> schedule_ids;
}
