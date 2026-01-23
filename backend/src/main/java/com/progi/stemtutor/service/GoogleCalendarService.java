package com.progi.stemtutor.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.client.util.DateTime;
import com.progi.stemtutor.model.InstructorSchedule;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.Date;

@Service
public class GoogleCalendarService {

    private final OAuth2AuthorizedClientService clientService;

    public GoogleCalendarService(OAuth2AuthorizedClientService clientService) {
        this.clientService = clientService;
    }

    public String addEventToCalendar(InstructorSchedule schedule, Authentication authentication) throws Exception {

        String tokenValue = (String) authentication.getCredentials();

        if (tokenValue == null || tokenValue.isEmpty()) {
            throw new RuntimeException("Google Token nedostaje u Authentication objektu!");
        }

        Calendar service = new Calendar.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance(),
                request -> request.getHeaders().setAuthorization("Bearer " + tokenValue))
                .setApplicationName("STEM Tutorstvo")
                .build();

        Event event = new Event()
                .setSummary("STEM Tutorstvo: " + schedule.getAttendanceMode())
                .setDescription("Trajanje: " + schedule.getDurationMin() + " min");

        DateTime startDateTime = new DateTime(Date.from(schedule.getDatetime().atZone(ZoneId.systemDefault()).toInstant()));
        event.setStart(new EventDateTime().setDateTime(startDateTime));

        DateTime endDateTime = new DateTime(Date.from(schedule.getDatetime().plusMinutes(schedule.getDurationMin())
                .atZone(ZoneId.systemDefault()).toInstant()));
        event.setEnd(new EventDateTime().setDateTime(endDateTime));

        Event createdEvent = service.events().insert("primary", event).execute();

        return createdEvent.getId(); // Vraćamo ID da ga spremimo u našu bazu
    }
}