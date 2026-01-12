package com.progi.stemtutor.repository;

import com.progi.stemtutor.dto.InstructorSearchRequestDto;
import com.progi.stemtutor.dto.InstructorSearchResponseDto;
import com.progi.stemtutor.model.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class InstructorScheduleRepositoryImpl
        implements InstructorScheduleSearchRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<InstructorSearchResponseDto> search(InstructorSearchRequestDto dto) {

        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<InstructorSearchResponseDto> cq =
                cb.createQuery(InstructorSearchResponseDto.class);

        // FROM instructor_schedules
        Root<InstructorSchedule> schedule =
                cq.from(InstructorSchedule.class);

        // JOIN instructor_subjects
        Join<InstructorSchedule, InstructorSubject> instructorSubject =
                schedule.join("instructorSubject");

        // JOIN subjects
        Join<InstructorSubject, Subject> subject =
                instructorSubject.join("subject");

        // JOIN instructors
        Join<InstructorSchedule, Instructor> instructor =
                schedule.join("instructor");

        // LEFT JOIN reservations
        Join<InstructorSchedule, Reservation> reservation =
                schedule.join("reservations", JoinType.LEFT);

        // LEFT JOIN reservation_participations
        Join<Reservation, ReservationParticipation> participation =
                reservation.join("participations", JoinType.LEFT);

        // LEFT JOIN reviews
        Join<ReservationParticipation, Review> review =
                participation.join("review", JoinType.LEFT);

        List<Predicate> predicates = new ArrayList<>();

        // SUBJECT FILTER
        if (dto.getSubject() != null) {
            predicates.add(
                    cb.equal(subject.get("subjectName"), dto.getSubject())
            );
        }

        // FORMAT FILTER
        if (dto.getFormat() != null) {
            predicates.add(
                    cb.equal(schedule.get("attendanceMode"), dto.getFormat())
            );
        }

        // PRICE FILTERS
        if (dto.getMinPrice() != null) {
            predicates.add(
                    cb.ge(schedule.get("price"), dto.getMinPrice())
            );
        }

        if (dto.getMaxPrice() != null) {
            predicates.add(
                    cb.le(schedule.get("price"), dto.getMaxPrice())
            );
        }

        // DATE FILTER
        if (dto.getDate() != null) {
            Expression<LocalDate> dateExpr =
                    cb.function(
                            "DATE",
                            LocalDate.class,
                            schedule.get("scheduleDateTime")
                    );
            predicates.add(cb.equal(dateExpr, dto.getDate()));
        }

        // TIME RANGE FILTER
        if (dto.getTimeFrom() != null && dto.getTimeTo() != null) {
            Expression<LocalTime> timeExpr =
                    cb.function(
                            "TIME",
                            LocalTime.class,
                            schedule.get("scheduleDateTime")
                    );
            predicates.add(
                    cb.between(timeExpr, dto.getTimeFrom(), dto.getTimeTo())
            );
        }

        // AVG RATING
        Expression<Double> avgRating =
                cb.avg(review.get("rating"));

        // Move the rating predicate out of the predicates list
        if (dto.getRating() != null) {
            cq.having(cb.ge(cb.coalesce(avgRating, 0.0), dto.getRating().doubleValue()));
        }

        // COUNT PARTICIPANTS
        Expression<Long> filledCount =
                cb.countDistinct(participation.get("id"));

        // SELECT DTO
        cq.select(
                cb.construct(
                        InstructorSearchResponseDto.class,
                        schedule.get("id"),
                        schedule.get("scheduleDateTime"),
                        schedule.get("maxParticipants"),
                        filledCount,
                        schedule.get("durationMin"),
                        schedule.get("price"),
                        schedule.get("attendanceMode"),
                        subject.get("subjectName"),
                        cb.concat(
                                cb.concat(
                                        instructor.get("firstName"), // Access inherited field directly
                                        " "
                                ),
                                instructor.get("lastName")
                        ),
                        instructor.get("id")
                )
        );

        cq.where(predicates.toArray(new Predicate[0]));

        cq.groupBy(
                schedule.get("id"),
                schedule.get("scheduleDateTime"),
                schedule.get("maxParticipants"),
                schedule.get("durationMin"),
                schedule.get("price"),
                schedule.get("attendanceMode"),
                subject.get("subjectName"),
                instructor.get("id"),
                instructor.get("firstName"),
                instructor.get("lastName"),
                instructor.get("id")
        );

        TypedQuery<InstructorSearchResponseDto> query =
                em.createQuery(cq);

        query.setFirstResult(dto.getPage() * dto.getLimit());
        query.setMaxResults(dto.getLimit());

        return query.getResultList();
    }
}
