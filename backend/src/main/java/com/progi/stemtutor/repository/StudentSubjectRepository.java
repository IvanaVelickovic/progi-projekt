package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.StudentSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentSubjectRepository extends JpaRepository<StudentSubject, Long> {
    List<StudentSubject> findByStudentId(Long studentId);
    Optional<StudentSubject> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
}