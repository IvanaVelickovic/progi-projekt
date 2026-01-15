package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.InstructorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstructorScheduleRepository
        extends JpaRepository<InstructorSchedule, Long>,
        InstructorScheduleSearchRepository {
}
