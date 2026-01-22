package com.progi.stemtutor.service;

import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.VideoSession;
import com.progi.stemtutor.model.VideoSessionParticipant;
import com.progi.stemtutor.model.enums.UserRole;
import com.progi.stemtutor.repository.VideoSessionParticipantRepository;
import com.progi.stemtutor.repository.VideoSessionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class VideoSessionTrackingService {

    private final VideoSessionRepository sessionRepo;
    private final VideoSessionParticipantRepository participantRepo;

    @Transactional
    public VideoSession onJoin(
            Long reservationId,
            User user,
            UserRole role
    ) {
        // 1️⃣ nađi ili kreiraj session
        VideoSession session = sessionRepo
                .findByReservationId(reservationId)
                .orElseGet(() -> {
                    VideoSession s = new VideoSession();
                    s.setReservationId(reservationId);
                    s.setInstructor(user); // ili iz reservationa
                    return sessionRepo.save(s);
                });

        // 2️⃣ ako je prvi ulazak
        if (session.getStartedAt() == null) {
            session.setStartedAt(Instant.now());
            sessionRepo.save(session);
        }

        // 3️⃣ dodaj participant
        VideoSessionParticipant p = new VideoSessionParticipant();
        p.setSession(session);
        p.setUser(user);
        p.setRole(role);
        p.setJoinedAt(Instant.now());

        participantRepo.save(p);

        return session;
    }

    @Transactional
    public void onLeave(VideoSession session, User user) {

        VideoSessionParticipant p =
                participantRepo.findActive(session.getId(), user.getId())
                        .orElseThrow();

        p.setLeftAt(Instant.now());
        participantRepo.save(p);

        if (p.getRole() == UserRole.instructor) {
            session.setEndedAt(Instant.now());
            sessionRepo.save(session);
        }
    }
}
