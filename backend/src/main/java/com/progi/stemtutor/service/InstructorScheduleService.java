package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.InstructorScheduleRequestDTO;
import com.progi.stemtutor.model.InstructorSchedule;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.repository.InstructorScheduleRepository;
import com.progi.stemtutor.repository.UserRepository;
import com.progi.stemtutor.responses.InstructorScheduleResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstructorScheduleService {

    private final InstructorScheduleRepository instructorScheduleRepository;
    private final UserRepository userRepository;
    private final GoogleCalendarService googleCalendarService;

    public List<InstructorScheduleResponse> getAllInstructorSchedules() {
        return instructorScheduleRepository.findAll().stream()
                .map(this::convertToInstructorScheduleResponse)
                .collect(Collectors.toList());
    }

    public InstructorScheduleResponse getInstructorScheduleById(Long id) {
        InstructorSchedule entity = instructorScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instructor schedule not found with id: " + id));
        return convertToInstructorScheduleResponse(entity);
    }

    public List<InstructorScheduleResponse> getSchedulesByInstructorEmail(String email) {
        // Nađi korisnika/instruktora
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Instruktor nije pronađen"));

        // Vrati samo njegove termine koristeći findByInstructorId koji smo ranije dodali u Repository
        return instructorScheduleRepository.findByInstructorId(user.getId().intValue()).stream()
                .map(this::convertToInstructorScheduleResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public InstructorScheduleResponse createInstructorSchedule(InstructorScheduleRequestDTO dto, String email, Authentication auth) {
        // googleCalendarId is currently null for testing
        String googleId = null;
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen za email: " + email));

        System.out.println("DEBUG: DTO googleCalendar value: " + dto.getGoogleCalendar());

        InstructorSchedule instructorSchedule = InstructorSchedule.builder()
                .datetime(dto.getDatetime())
                .durationMin(dto.getDurationMin())
                .price(dto.getPrice())
                .attendanceMode(dto.getAttendanceMode())
                .maxParticipants(dto.getMaxParticipants())
                .status(dto.getStatus())
                .instructorId(user.getId().intValue())
                .googleCalendarId(googleId)
                .build();

        InstructorSchedule saved = instructorScheduleRepository.save(instructorSchedule);

        if (dto.getGoogleCalendar() != null && dto.getGoogleCalendar()) {
            System.out.println("DEBUG: Entering Google Sync block...");
            try {
                String calendarId = googleCalendarService.addEventToCalendar(saved, auth);
                System.out.println("DEBUG: Received Calendar ID: " + calendarId);
                saved.setGoogleCalendarId(calendarId);
                instructorScheduleRepository.save(saved);
            } catch (Exception e) {
                System.err.println("DEBUG: Google Sync FAILED: " + e.getMessage());
                e.printStackTrace(); // Ovo će nam reći točno ZAŠTO ne radi
            }
        } else {
            System.out.println("DEBUG: Skipping Google Sync (value was false or null)");
        }

        return convertToInstructorScheduleResponse(saved);
    }

    @Transactional
    public InstructorScheduleResponse updateInstructorSchedule(Long id, InstructorScheduleRequestDTO dto) {
        InstructorSchedule existing = instructorScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Termin nije pronađen"));

        if (dto.getMaxParticipants() != null) {
            existing.setMaxParticipants(dto.getMaxParticipants());
        }

        // Ovdje će kasnije ići logika za Google Calendar ako je dto.getGoogleCalendar() true

        InstructorSchedule saved = instructorScheduleRepository.save(existing);
        return convertToInstructorScheduleResponse(saved);
    }

    @Transactional
    public void deleteInstructorSchedule(Long id) {
        if (!instructorScheduleRepository.existsById(id)) {
            throw new RuntimeException("Termin ne postoji u bazi.");
        }
        instructorScheduleRepository.deleteById(id);
    }

    private InstructorScheduleResponse convertToInstructorScheduleResponse(InstructorSchedule entity) {
        return InstructorScheduleResponse.builder()
                .scheduleId(entity.getScheduleId())
                .datetime(entity.getDatetime().toString())
                .durationMin(entity.getDurationMin())
                .price(entity.getPrice())
                .attendanceMode(entity.getAttendanceMode())
                .maxParticipants(entity.getMaxParticipants())
                .status(entity.getStatus())
                .googleCalendarId(entity.getGoogleCalendarId())
                .instructorId(entity.getInstructorId())
                .build();
    }

    public List<InstructorScheduleResponse> getSchedulesByInstructorId(Integer instructorId) {
        return instructorScheduleRepository.findByInstructorId(instructorId).stream()
                .map(this::convertToInstructorScheduleResponse)
                .collect(Collectors.toList());
    }
}
