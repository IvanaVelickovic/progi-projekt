package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.InstructorSearchRequestDto;
import com.progi.stemtutor.dto.InstructorSearchResponseDto;
import com.progi.stemtutor.service.InstructorSearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/instructors")
@RequiredArgsConstructor
public class InstructorSearchController {

    private final InstructorSearchService instructorSearchService;

    @PostMapping("/search")
    public List<InstructorSearchResponseDto> search(
           @Valid @RequestBody InstructorSearchRequestDto dto) {
        return instructorSearchService.search(dto);
    }
}
