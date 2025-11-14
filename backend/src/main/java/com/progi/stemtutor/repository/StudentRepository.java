package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.Student;
import com.progi.stemtutor.model.StudentSubject;
import com.progi.stemtutor.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser_Id(Long userId);
    boolean existsByUser_Id(Long userId);
}
