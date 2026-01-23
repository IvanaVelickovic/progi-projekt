package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.DashboardItemResponseInstructor;
import com.progi.stemtutor.dto.DashboardItemResponseStudent;
import com.progi.stemtutor.model.enums.UserRole;
import com.progi.stemtutor.repository.ReservationParticipationRepository;
import com.progi.stemtutor.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ReservationParticipationRepository participationRepo;
    private final ReservationRepository reservationRepo;

    public List<DashboardItemResponseStudent> studentDashboard(Long studentId) {
        return participationRepo.findForStudentDashboard(studentId)
                .stream()
                .map(rp -> {
                    var r = rp.getReservation();
                    var s = r.getSchedule();
                    var instructorUser = s.getInstructor().getUser();

                    return new DashboardItemResponseStudent(
                            r.getId(),
                            rp.getId(),
                            s.getInstructorSubject().getSubjectName().name(),
                            s.getDatetime().toLocalDate(),
                            s.getDatetime().toLocalTime(),
                            s.getDurationMin(),
                            r.getReservationStatus().name(),
                            instructorUser.getFirstName() + " " + instructorUser.getLastName()
                    );
                })
                .toList();
    }

    public List<DashboardItemResponseInstructor> instructorDashboard(Long instructorId) {
        return reservationRepo.findForInstructorDashboard(instructorId)
                .stream()
                .map(r -> {
                    var s = r.getSchedule();

                    List<String> students = r.getParticipations().stream()
                            .map(p -> p.getStudent().getUser().getFirstName()
                                    + " " +
                                    p.getStudent().getUser().getLastName())
                            .toList();
                    List<Long> participationIds = r.getParticipations().stream()
                            .map(p -> p.getId())
                            .toList();

                    return new DashboardItemResponseInstructor(
                            r.getId(),
                            participationIds,
                            s.getInstructorSubject().getSubjectName().name(),
                            s.getDatetime().toLocalDate(),
                            s.getDatetime().toLocalTime(),
                            s.getDurationMin(),
                            null,
                            students
                    );
                })
                .toList();
    }
}
