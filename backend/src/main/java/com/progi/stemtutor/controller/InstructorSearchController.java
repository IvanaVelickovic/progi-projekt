package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.InstructorSearchRequestDto;
import com.progi.stemtutor.dto.InstructorSearchResponseDto;
import com.progi.stemtutor.service.InstructorSearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructors")
@RequiredArgsConstructor
public class InstructorSearchController {

    private final InstructorSearchService instructorSearchService;

    @GetMapping("/search")
    public List<InstructorSearchResponseDto> search(
           @Valid @ModelAttribute InstructorSearchRequestDto dto) {
        return instructorSearchService.search(dto);
    }
}
