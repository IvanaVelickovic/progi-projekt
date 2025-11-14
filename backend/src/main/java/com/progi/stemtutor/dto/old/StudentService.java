//package com.progi.stemtutor.dto.old;
//
//import com.progi.stemtutor.dto.StudentDTO;
//import com.progi.stemtutor.dto.UpdateStudentRequest;
//import com.progi.stemtutor.model.Student;
//import com.progi.stemtutor.repository.StudentRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.NoSuchElementException;
//
//@Service
//@RequiredArgsConstructor
//public class StudentService {
//
//    private final StudentRepository studentRepository;
//
//    public StudentDTO getProfile(String email) {
//        Student student = studentRepository.findByEmail(email)
//                .orElseThrow(() -> new NoSuchElementException("Student not found with email: " + email));
//
//        return StudentDTO.fromEntity(student);
//    }
//
//    public StudentDTO updateProfile(String email, UpdateStudentRequest request) {
//        Student student = studentRepository.findByEmail(email)
//                .orElseThrow(() -> new NoSuchElementException("Student not found with email: " + email));
//
//        if (request.firstName() != null) {
//            student.setFirstName(request.firstName());
//        }
//
//        if (request.lastName() != null) {
//            student.setLastName(request.lastName());
//        }
//
//        if (request.grade() != null) {
//            student.setGrade(request.grade());
//        }
//
//        studentRepository.save(student);
//
//        return StudentDTO.fromEntity(student);
//    }
//}
