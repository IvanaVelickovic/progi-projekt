package com.progi.stemtutor.repository;

import com.progi.stemtutor.dto.InstructorSearchResponseDto;
import com.progi.stemtutor.model.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface InstructorSearchRepository extends JpaRepository<Instructor, Long> {

    @Query("""
SELECT new com.progi.stemtutor.dto.InstructorSearchResponseDto(
    i.id,
    i.firstName,
    i.lastName,
    i.hourlyRate,
    AVG(r.rating),
    l.city,
    l.address
)
FROM Instructor i
     JOIN InstructorSubject isub
       ON isub.instructor = i
     JOIN isub.subject s
LEFT JOIN AvailableAtLocation aal
       ON aal.instructor = i
LEFT JOIN aal.location l
LEFT JOIN Review r
       ON r.reservationParticipation.reservation.schedule.instructor = i

WHERE isub.isRemoved = false
  AND (:subjectId IS NULL OR s.id = :subjectId)
  AND (:maxRate IS NULL OR i.hourlyRate <= :maxRate)
  AND (:city IS NULL OR l.city = :city)
GROUP BY i.id, i.firstName, i.lastName, i.hourlyRate, l.city
""")

    List<InstructorSearchResponseDto> search(Long subjectId, BigDecimal maxHourlyRate, String city, String address);
}
