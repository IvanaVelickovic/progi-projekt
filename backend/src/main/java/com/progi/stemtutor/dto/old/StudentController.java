//package com.progi.stemtutor.dto.old;
//
//import com.progi.stemtutor.dto.StudentDTO;
//import com.progi.stemtutor.dto.UpdateStudentRequest;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/student/")
//@RequiredArgsConstructor
//public class StudentController {
//
//    private final StudentService studentService;
//
//    @GetMapping("/profile")
//    public ResponseEntity<StudentDTO> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
//        return ResponseEntity.ok(studentService.getProfile(userDetails.getUsername()));
//    }
//
//    @PutMapping("/profile")
//    public ResponseEntity<StudentDTO> updateProfile(
//            @AuthenticationPrincipal UserDetails userDetails,
//            @RequestBody UpdateStudentRequest request
//    ) {
//        return ResponseEntity.ok(studentService.updateProfile(userDetails.getUsername(), request));
//    }
//}
