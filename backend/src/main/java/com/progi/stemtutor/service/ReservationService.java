package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.InstructorSearchResponseDto;
import com.progi.stemtutor.model.InstructorSchedule;
import com.progi.stemtutor.model.Reservation;
import com.progi.stemtutor.model.ReservationParticipation;
import com.progi.stemtutor.model.Student;
import com.progi.stemtutor.model.enums.ParticipationStatus;
import com.progi.stemtutor.model.enums.ReservationStatus;
import com.progi.stemtutor.model.enums.SubjectName;
import com.progi.stemtutor.repository.InstructorScheduleRepository;
import com.progi.stemtutor.repository.ReservationParticipationRepository;
import com.progi.stemtutor.repository.ReservationRepository;
import com.progi.stemtutor.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationParticipationRepository participationRepository;
    private final InstructorScheduleRepository scheduleRepository;
    private final StudentRepository studentRepository;
    private final EmailService emailService;

    public ReservationService(
            ReservationRepository reservationRepository,
            ReservationParticipationRepository participationRepository,
            InstructorScheduleRepository scheduleRepository,
            StudentRepository studentRepository,
            EmailService emailService) {
        this.reservationRepository = reservationRepository;
        this.participationRepository = participationRepository;
        this.scheduleRepository = scheduleRepository;
        this.studentRepository = studentRepository;
        this.emailService = emailService;
    }

    public void createReservation(Long scheduleId, Long studentId) {

        //spriječimo duplikat
        if (participationRepository
                .existsByReservationScheduleScheduleIdAndStudentId(
                        scheduleId, studentId)) {
            throw new RuntimeException("Student already reserved this schedule");
        }

        InstructorSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Reservation reservation = new Reservation();
        reservation.setSchedule(schedule);
        reservation.setReservationStatus(ReservationStatus.pending);

        ReservationParticipation participation = new ReservationParticipation();
        participation.setReservation(reservation);
        participation.setStudent(student);
        participation.setParticipationStatus(ParticipationStatus.confirmed);

        reservation.getParticipations().add(participation);

        // cascade sprema i participation
        reservationRepository.save(reservation);

        emailService.sendReservationConfirmation(
                student.getUser().getEmail(),
                student.getUser().getFirstName(),
                schedule.getInstructor().getUser().getFirstName(),
                schedule.getInstructor().getUser().getLastName(),
                SubjectName.Matematika,
                schedule.getDatetime()
        );
    }

    public List<InstructorSearchResponseDto> getStudentSchedules(Long studentId) {

        List<InstructorSchedule> schedules =
                participationRepository.findSchedulesByStudentId(studentId);

        return schedules.stream()
                .map(this::toDto)
                .toList();
    }

    private InstructorSearchResponseDto toDto(InstructorSchedule s) {
        InstructorSearchResponseDto dto = new InstructorSearchResponseDto();
        dto.setId(s.getScheduleId());
        dto.setDateTime(s.getDatetime());
        dto.setDuration(s.getDurationMin());
        dto.setPrice(s.getPrice());
        dto.setFormat(s.getAttendanceMode());
        dto.setMaxParticipants(s.getMaxParticipants());
        dto.setFilled((long) s.getReservations().size()); // ili druga logika
        dto.setSubject(SubjectName.Matematika);
        dto.setInstructorId(s.getInstructor().getId());
        dto.setInstructorName(
                s.getInstructor().getUser().getFirstName() + " " + s.getInstructor().getUser().getLastName()
        );
        return dto;
    }
}
