package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {

    @Query(value = """
        SELECT
            COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) AS prosjecna_ocjena
        FROM instructors i
        LEFT JOIN instructor_schedules s
            ON s.instructor_id = i.instructor_id
        LEFT JOIN reservations res
            ON res.schedule_id = s.schedule_id
        LEFT JOIN reservation_participations rp
            ON rp.reservation_id = res.reservation_id
        LEFT JOIN reviews r
            ON r.reservation_participation_id = rp.reservation_participation_id
           AND r.is_review_removed = FALSE
        WHERE i.instructor_id = :instructor_id
        GROUP BY i.instructor_id;
    """, nativeQuery = true)
    Double findAverageRatingByInstructorId(@Param("instructorId") Long instructorId);

    @Query(value = """
        SELECT
        COUNT(r.review_id) AS broj_recenzija
        FROM instructors i
        LEFT JOIN instructor_schedules s
        ON s.instructor_id = i.instructor_id
        LEFT JOIN reservations res
        ON res.schedule_id = s.schedule_id
        LEFT JOIN reservation_participations rp
        ON rp.reservation_id = res.reservation_id
        LEFT JOIN reviews r
        ON r.reservation_participation_id = rp.reservation_participation_id
        AND r.is_review_removed = FALSE
        WHERE i.instructor_id = :instructor_id
        GROUP BY i.instructor_id
    """, nativeQuery = true)
    Integer countByInstructorId(@Param("instructorId") Long instructorId);
}
