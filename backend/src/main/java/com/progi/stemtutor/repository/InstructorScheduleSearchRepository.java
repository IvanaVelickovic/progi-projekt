package com.progi.stemtutor.repository;

import com.progi.stemtutor.dto.InstructorSearchRequestDto;
import com.progi.stemtutor.dto.InstructorSearchResponseDto;

import java.util.List;

public interface InstructorScheduleSearchRepository {

    List<InstructorSearchResponseDto> search(InstructorSearchRequestDto dto);
}
