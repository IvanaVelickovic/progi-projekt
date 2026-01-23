package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.InstructorSubject;
import com.progi.stemtutor.model.enums.SubjectName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InstructorSubjectRepository extends JpaRepository<InstructorSubject, Long> {

    @Query("SELECT isub FROM InstructorSubject isub " +
            "WHERE isub.instructor.user.id = :userId " +
            "AND isub.subjectName = :subjectName " +
            "AND isub.isRemoved = false")
    Optional<InstructorSubject> findActiveByUserIdAndSubjectName(
            @Param("userId") Long userId,
            @Param("subjectName") SubjectName subjectName);
    Optional<InstructorSubject> findFirstByInstructorId(Long instructorId);
}