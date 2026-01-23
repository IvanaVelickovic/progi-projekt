package com.progi.stemtutor.jobs;

import com.progi.stemtutor.model.Reservation;
import com.progi.stemtutor.model.ReservationParticipation;
import com.progi.stemtutor.model.enums.SubjectName;
import com.progi.stemtutor.repository.ReservationRepository;
import com.progi.stemtutor.service.EmailService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.security.auth.Subject;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Transactional
public class ReservationReminderJob {
    private final ReservationRepository reservationRepository;
    private final EmailService emailService;

    public ReservationReminderJob(
            ReservationRepository reservationRepository,
            EmailService emailService) {
        this.reservationRepository = reservationRepository;
        this.emailService = emailService;
    }

    @Scheduled(fixedRate = 300000) // svaku minutu
    public void sendReminders() {

        LocalDateTime now = LocalDateTime.now();

        // 24h reminder (23h 55min – 24h 5min)
        send24hReminders(
                now.plusHours(24).minusMinutes(6),
                now.plusHours(24).plusMinutes(6)
        );

        // 1h reminder (55min – 65min)
        send1hReminders(
                now.plusHours(1).minusMinutes(5),
                now.plusHours(1).plusMinutes(5)
        );
    }

    private void send24hReminders(LocalDateTime from, LocalDateTime to) {
        List<Reservation> reservations =
                reservationRepository.findReservationsFor24hReminder(from, to);

        for (Reservation r : reservations) {
            sendReminder(r, "24-satni");
            r.setReminder24hSent(true);
        }
    }

    private void send1hReminders(LocalDateTime from, LocalDateTime to) {
        List<Reservation> reservations =
                reservationRepository.findReservationsFor1hReminder(from, to);

        for (Reservation r : reservations) {
            sendReminder(r, "1-satni");
            r.setReminder1hSent(true);
        }
    }

    private void sendReminder(Reservation r, String type) {
        ReservationParticipation p = r.getParticipations().getFirst();

        emailService.sendReservationReminder(
                p.getStudent().getUser().getEmail(),
                p.getStudent().getUser().getFirstName(),
                r.getSchedule().getInstructor().getUser().getFirstName(),
                r.getSchedule().getInstructor().getUser().getLastName(),
                SubjectName.Matematika, //r.getSchedule().getInstructorSubject().getSubjectName(),
                r.getSchedule().getDatetime(),
                type
        );
    }
}
