package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.InstructorSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface InstructorSubjectRepository extends JpaRepository<InstructorSubject, Long> {
    Optional<InstructorSubject> findFirstByInstructorId(Long instructorId);
}
