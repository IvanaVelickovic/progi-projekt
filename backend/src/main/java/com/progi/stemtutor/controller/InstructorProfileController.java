package com.progi.stemtutor.controller;

import com.progi.stemtutor.service.InstructorProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

}