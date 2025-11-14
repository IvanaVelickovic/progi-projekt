package com.progi.stemtutor.service;


import com.progi.stemtutor.dto.old.StudentSubjectDTO;
import com.progi.stemtutor.dto.old.UpdateStudentSubjectRequest;
import com.progi.stemtutor.model.Student;
import com.progi.stemtutor.model.StudentSubject;
import com.progi.stemtutor.repository.StudentRepository;
import com.progi.stemtutor.repository.StudentSubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentSubjectService {

    private final StudentRepository studentRepository;
    private final StudentSubjectRepository studentSubjectRepository;

    public List<StudentSubjectDTO> getSubjects(String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Student not found with email: " + email));

        return student.getStudentSubjects()
                .stream()
                .map(StudentSubjectDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public StudentSubjectDTO updateSubject(String email, Long subjectId, UpdateStudentSubjectRequest request) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Student not found with email: " + email));

        StudentSubject studentSubject = student.getStudentSubjects()
                .stream()
                .filter(ss -> ss.getSubject().getId().equals(subjectId))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementException("Subject not found for this student."));

        if (request.knowledgeLevel() != null) {
            studentSubject.setKnowledgeLevel(request.knowledgeLevel());
        }

        if (request.learningGoals() != null) {
            studentSubject.setLearningGoals(request.learningGoals());
        }

        studentSubjectRepository.save(studentSubject);
        return StudentSubjectDTO.fromEntity(studentSubject);
    }


}