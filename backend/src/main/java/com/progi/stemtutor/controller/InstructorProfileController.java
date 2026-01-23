package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.ReviewDto;
import com.progi.stemtutor.service.InstructorProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/instructors")
@RequiredArgsConstructor
public class InstructorProfileController {

    private final InstructorProfileService instructorProfileService;

    /**
     * Osnovni podaci instruktora (O instruktoru)
     */
    @GetMapping("/{instructorId}")
    public ResponseEntity<?> getInstructorProfile(@PathVariable Long instructorId) {

        return instructorProfileService.getInstructorProfile(instructorId)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body("Instruktor nije pronađen")
                );
    }

    @GetMapping("/{instructorId}/summary")
    public ResponseEntity<?> getInstructorSummary(@PathVariable Long instructorId){

        return instructorProfileService.getInstructorSummary(instructorId)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body("Instructor summary nije pronađen")
                );
    }

    @GetMapping("/{instructorId}/reviews")
    public ResponseEntity<List<ReviewDto>> getInstructorReviews(
            @PathVariable Long instructorId) {

        List<ReviewDto> reviews =
                instructorProfileService.getInstructorReviews(instructorId);

        return ResponseEntity.ok(reviews);
    }
}