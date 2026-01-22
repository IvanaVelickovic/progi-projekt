package com.progi.stemtutor.service;

import com.progi.stemtutor.model.enums.SubjectName;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendReservationConfirmation(
            String to,
            String studentName,
            String instructorFirstName,
            String instructorLastName,
            SubjectName subject,
            LocalDateTime dateTime
    ) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Potvrda rezervacije termina");

        message.setText(
                "Poštovani/na " + studentName + ",\n\n" +
                        "Uspješno ste rezervirali termin instrukcija.\n\n" +
                        "Predmet: " + subject + "\n" +
                        "Instruktor: " + instructorFirstName + " " + instructorLastName + "\n" +
                        "Datum i vrijeme: " + dateTime + "\n\n" +
                        "Vidimo se!\n" +
                        "STEM Tutor tim"
        );

        mailSender.send(message);
    }

    public void sendReservationReminder(
            String to,
            String studentName,
            String instructorFirstName,
            String instructorLastName,
            SubjectName subject,
            LocalDateTime dateTime,
            String reminderType
    ) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Podsjetnik na termin instrukcija");

        message.setText(
                "Poštovani/na " + studentName + ",\n\n" +
                        "Ovo je " + reminderType + " podsjetnik na Vaš termin instrukcija.\n\n" +
                        "Predmet: " + subject + "\n" +
                        "Instruktor: " + instructorFirstName + " " + instructorLastName + "\n" +
                        "Datum i vrijeme: " + dateTime + "\n\n" +
                        "Vidimo se!\n" +
                        "STEM Tutor tim"
        );

        mailSender.send(message);
    }
}
