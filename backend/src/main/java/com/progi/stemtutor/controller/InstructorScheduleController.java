package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.InstructorScheduleRequestDTO;
import com.progi.stemtutor.responses.InstructorScheduleResponse;
import com.progi.stemtutor.service.InstructorScheduleService;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructor-schedules")
@RequiredArgsConstructor
public class InstructorScheduleController {

    private final InstructorScheduleService instructorScheduleService;

    @GetMapping("/my-appointments")
    public ResponseEntity<List<InstructorScheduleResponse>> getMyAppointments(Authentication authentication) {
        String email = authentication.getName();
        List<InstructorScheduleResponse> mySchedules = instructorScheduleService.getSchedulesByInstructorEmail(email);

        return ResponseEntity.ok(mySchedules);
    }

    @PostMapping
    public ResponseEntity<InstructorScheduleResponse> createInstructorSchedule(@RequestBody InstructorScheduleRequestDTO dto, Authentication authentication) {
        String emailFromToken = authentication.getName();

        InstructorScheduleResponse response = instructorScheduleService.createInstructorSchedule(dto, emailFromToken, authentication);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InstructorScheduleResponse> updateInstructorSchedule(
            @PathVariable Long id,
            @RequestBody InstructorScheduleRequestDTO dto) {

        return ResponseEntity.ok(instructorScheduleService.updateInstructorSchedule(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstructorSchedule(@PathVariable Long id) {
        instructorScheduleService.deleteInstructorSchedule(id);
        return ResponseEntity.noContent().build();
    }
}