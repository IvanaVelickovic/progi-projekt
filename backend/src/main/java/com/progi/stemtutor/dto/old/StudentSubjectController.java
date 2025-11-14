package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.old.StudentSubjectDTO;
import com.progi.stemtutor.dto.old.UpdateStudentSubjectRequest;
import com.progi.stemtutor.service.StudentSubjectService;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/subjects")
@RequiredArgsConstructor
public class StudentSubjectController {

    private final StudentSubjectService studentSubjectService;

    @GetMapping
    public ResponseEntity<List<StudentSubjectDTO>> getSubjects(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(studentSubjectService.getSubjects(userDetails.getUsername()));
    }

    @PutMapping("/{subjectId}")
    public ResponseEntity<StudentSubjectDTO> updateSubject(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long subjectId,
            @RequestBody UpdateStudentSubjectRequest request
    ) {
        return ResponseEntity.ok(
                studentSubjectService.updateSubject(userDetails.getUsername(), subjectId, request)
        );
    }

    @PutMapping("/goals")
    public ResponseEntity<StudentSubjectDTO> updateGoals(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateStudentSubjectRequest request
    ) {
        return ResponseEntity.ok(
                studentSubjectService.updateSubject(userDetails.getUsername(), subjectId, request)
        );
    }

}