package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.SessionSummaryDto;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.VideoSession;
import com.progi.stemtutor.model.enums.UserRole;
import com.progi.stemtutor.repository.VideoSessionParticipantRepository;
import com.progi.stemtutor.repository.VideoSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionSummaryService {

    private final VideoSessionRepository sessionRepo;
    private final VideoSessionParticipantRepository participantRepo;

    public List<SessionSummaryDto> studentSummaries(User user) {
        return sessionRepo.findStudentSessions(user.getId())
                .stream()
                .map(s -> toDto(s, "student"))
                .toList();
    }

    public List<SessionSummaryDto> instructorSummaries(User user) {
        return sessionRepo.findInstructorSessions(user.getId())
                .stream()
                .map(s -> toDto(s, "instructor"))
                .toList();
    }

    private SessionSummaryDto toDto(VideoSession s, String role) {

        long durationMin = (long) Math.ceil(
                Duration.between(
                        s.getStartedAt(),
                        s.getEndedAt()
                ).toMillis() / 60000.0
        );

        List<String> studentNames =
                participantRepo.findBySessionAndRole(
                                s.getId(),
                                UserRole.student
                        )
                        .stream()
                        .map(p -> p.getUser().getFirstName()
                                + " " + p.getUser().getLastName())
                        .distinct()
                        .toList();

        return new SessionSummaryDto(
                s.getId(),
                s.getReservationId(),
                s.getSubject(),
                s.getStartedAt().toString(),
                durationMin,
                s.getInstructor().getFirstName()
                        + " " + s.getInstructor().getLastName(),
                studentNames,
                role
        );
    }
}
