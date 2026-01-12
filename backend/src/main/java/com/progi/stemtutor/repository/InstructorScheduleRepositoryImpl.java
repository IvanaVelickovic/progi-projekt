package com.progi.stemtutor.repository;

import com.progi.stemtutor.dto.InstructorSearchRequestDto;
import com.progi.stemtutor.dto.InstructorSearchResponseDto;
import com.progi.stemtutor.model.*;
import com.progi.stemtutor.model.enums.AttendanceMode;
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
        CriteriaQuery<InstructorSearchResponseDto> cq = cb.createQuery(InstructorSearchResponseDto.class);

        Root<InstructorSchedule> schedule = cq.from(InstructorSchedule.class);


        Join<InstructorSchedule, InstructorSubject> instructorSubject = schedule.join("instructorSubject");


        Join<InstructorSchedule, Instructor> instructor = schedule.join("instructor");
        Join<InstructorSchedule, Reservation> reservation = schedule.join("reservations", JoinType.LEFT);
        Join<Reservation, ReservationParticipation> participation = reservation.join("participations", JoinType.LEFT);
        Join<ReservationParticipation, Review> review = participation.join("review", JoinType.LEFT);

        List<Predicate> predicates = new ArrayList<>();

        if (dto.getSubject() != null) {
            predicates.add(
                    cb.equal(instructorSubject.get("subjectName"), dto.getSubject())
            );
        }

        if (dto.getFormat() != null) {
            predicates.add(
                    cb.or(
                            cb.equal(schedule.get("attendanceMode"), dto.getFormat()),
                            cb.equal(schedule.get("attendanceMode"), AttendanceMode.flexible)
                        )
                    );
        }

        if (dto.getMinPrice() != null) {
            predicates.add(cb.ge(schedule.get("price"), dto.getMinPrice()));
        }

        if (dto.getMaxPrice() != null) {
            predicates.add(cb.le(schedule.get("price"), dto.getMaxPrice()));
        }

        if (dto.getDate() != null) {
            Expression<String> dbDateStr = cb.function("to_char", String.class,
                    schedule.get("scheduleDateTime"),
                    cb.literal("YYYY-MM-DD")
            );
            predicates.add(cb.equal(dbDateStr, dto.getDate().toString()));
        }

        if (dto.getTimeFrom() != null || dto.getTimeTo() != null) {
            Expression<String> dbTimeStr = cb.function("to_char", String.class,
                    schedule.get("scheduleDateTime"),
                    cb.literal("HH24:MI")
            );

            if (dto.getTimeFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(dbTimeStr, dto.getTimeFrom().toString()));
            }

            if (dto.getTimeTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(dbTimeStr, dto.getTimeTo().toString()));
            }
        }

        Expression<Double> avgRating = cb.avg(review.get("rating"));
        if (dto.getRating() != null) {
            cq.having(cb.ge(cb.coalesce(avgRating, 0.0), dto.getRating().doubleValue()));
        }

        Expression<Long> filledCount = cb.countDistinct(participation.get("id"));

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
                        instructorSubject.get("subjectName"),
                        cb.concat(
                                cb.concat(instructor.get("firstName"), " "),
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
                instructorSubject.get("subjectName"),
                instructor.get("id"),
                instructor.get("firstName"),
                instructor.get("lastName")
        );

        TypedQuery<InstructorSearchResponseDto> query = em.createQuery(cq);
        query.setFirstResult(dto.getPage() * dto.getLimit());
        query.setMaxResults(dto.getLimit());

        return query.getResultList();
    }
}