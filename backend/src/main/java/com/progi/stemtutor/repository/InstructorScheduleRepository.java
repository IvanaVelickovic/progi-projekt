package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.InstructorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstructorScheduleRepository extends JpaRepository<InstructorSchedule, Long> {

    // SELECT * FROM instructor_schedules WHERE instructor_id = ?
    List<InstructorSchedule> findByInstructorId(Integer instructorId);
}
