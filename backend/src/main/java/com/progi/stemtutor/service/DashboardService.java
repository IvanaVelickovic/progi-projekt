package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.DashboardItemResponse;
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

    public List<DashboardItemResponse> getDashboard(Long userId, UserRole role) {

        return switch (role) {
            case student -> studentDashboard(userId);
            case instructor -> instructorDashboard(userId);
            default -> List.of();
        };
    }

    private List<DashboardItemResponse> studentDashboard(Long studentId) {
        return participationRepo.findForStudentDashboard(studentId)
                .stream()
                .map(rp -> {
                    var r = rp.getReservation();
                    var s = r.getSchedule();
                    var instructorUser = s.getInstructor().getUser();

                    return new DashboardItemResponse(
                            r.getId(),
                            s.getInstructorSubject().getSubjectName().name(),
                            s.getDatetime().toLocalDate(),
                            s.getDatetime().toLocalTime(),
                            s.getDurationMin(),
                            r.getReservationStatus().name(),
                            instructorUser.getFirstName() + " " + instructorUser.getLastName(),
                            null
                    );
                })
                .toList();
    }

    private List<DashboardItemResponse> instructorDashboard(Long instructorId) {
        return reservationRepo.findForInstructorDashboard(instructorId)
                .stream()
                .map(r -> {
                    var s = r.getSchedule();

                    List<String> students = r.getParticipations().stream()
                            .map(p -> p.getStudent().getUser().getFirstName()
                                    + " " +
                                    p.getStudent().getUser().getLastName())
                            .toList();

                    return new DashboardItemResponse(
                            r.getId(),
                            s.getInstructorSubject().getSubjectName().name(),
                            s.getDatetime().toLocalDate(),
                            s.getDatetime().toLocalTime(),
                            s.getDurationMin(),
                            r.getReservationStatus().name(),
                            null,
                            students
                    );
                })
                .toList();
    }
}
