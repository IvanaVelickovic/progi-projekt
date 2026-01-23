package com.progi.stemtutor.service;

import com.progi.stemtutor.model.enums.SubjectName;
import com.progi.stemtutor.service.GmailService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EmailService {

    private final GmailService gmailService;

    public EmailService(GmailService gmailService) {
        this.gmailService = gmailService;
    }

    @Async
    public void sendReservationConfirmation(String to, String studentName, String instructorFirstName,
                                            String instructorLastName, SubjectName subject, LocalDateTime dateTime) {
        String body = "Poštovani/na " + studentName + ",\n\n" +
                "Uspješno ste rezervirali termin instrukcija.\n\n" +
                "Predmet: " + subject + "\n" +
                "Instruktor: " + instructorFirstName + " " + instructorLastName + "\n" +
                "Datum i vrijeme: " + dateTime + "\n\n" +
                "Vidimo se!\nSTEM Tutor tim";
        try {
            gmailService.sendEmail(to, "Potvrda rezervacije termina", body);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendReservationReminder(String to, String studentName, String instructorFirstName,
                                        String instructorLastName, SubjectName subject, LocalDateTime dateTime,
                                        String reminderType) {
        String body = "Poštovani/na " + studentName + ",\n\n" +
                "Ovo je " + reminderType + " podsjetnik na Vaš termin instrukcija.\n\n" +
                "Predmet: " + subject + "\n" +
                "Instruktor: " + instructorFirstName + " " + instructorLastName + "\n" +
                "Datum i vrijeme: " + dateTime + "\n\n" +
                "Vidimo se!\nSTEM Tutor tim";
        try {
            gmailService.sendEmail(to, "Podsjetnik na termin instrukcija", body);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}