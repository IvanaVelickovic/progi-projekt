package com.progi.stemtutor.dto.quiz;

import lombok.Data;

import java.util.List;

@Data
public class SelectedSchedulesResponseDto {
    public List<Long> schedule_ids;
}
