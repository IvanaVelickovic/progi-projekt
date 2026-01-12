package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.InstructorSearchRequestDto;
import com.progi.stemtutor.dto.InstructorSearchResponseDto;
import com.progi.stemtutor.repository.InstructorScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InstructorSearchService {

    private final InstructorScheduleRepository repository;

    public List<InstructorSearchResponseDto> search(InstructorSearchRequestDto dto) {
        return repository.search(dto);
    }
}
