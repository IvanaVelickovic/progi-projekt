package com.progi.stemtutor.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import com.progi.stemtutor.model.Instructor;
import com.progi.stemtutor.model.InstructorSchedule;
import com.progi.stemtutor.model.InstructorSubject;
import com.progi.stemtutor.model.Reservation;
import com.progi.stemtutor.model.Student;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.enums.AttendanceMode;
import com.progi.stemtutor.model.enums.SubjectName;
import com.progi.stemtutor.repository.InstructorScheduleRepository;
import com.progi.stemtutor.repository.ReservationParticipationRepository;
import com.progi.stemtutor.repository.ReservationRepository;
import com.progi.stemtutor.repository.StudentRepository;

@SpringBootTest
@ActiveProfiles("test")
class ReservationServiceTest {

    @MockitoBean
    private ReservationRepository reservationRepository;

    @MockitoBean
    private ReservationParticipationRepository participationRepository;

    @MockitoBean
    private InstructorScheduleRepository scheduleRepository;

    @MockitoBean
    private StudentRepository studentRepository;

    @MockitoBean
    private EmailService emailService;

    @Autowired
    private ReservationService reservationService;

    @Test
    void testCreateReservation_Success() {
        Long scheduleId = 100L;
        Long studentId = 200L;

        InstructorSchedule schedule = new InstructorSchedule();
        schedule.setScheduleId(scheduleId);
        schedule.setDatetime(LocalDateTime.now());
        schedule.setDurationMin(60);
        schedule.setAttendanceMode(AttendanceMode.online);

        Instructor instructor = new Instructor();
        User instructorUser = new User();
        instructorUser.setFirstName("Instructor");
        instructorUser.setLastName("Name");
        instructor.setUser(instructorUser);
        schedule.setInstructor(instructor);

        InstructorSubject subject = new InstructorSubject();
        subject.setSubjectName(SubjectName.Matematika);
        schedule.setInstructorSubject(subject);

        Student student = new Student();
        student.setId(studentId);
        User studentUser = new User();
        studentUser.setEmail("student@example.com");
        studentUser.setFirstName("Student");
        student.setUser(studentUser);

        when(participationRepository.existsByReservationScheduleScheduleIdAndStudentId(scheduleId, studentId)).thenReturn(false);
        when(scheduleRepository.findById(scheduleId)).thenReturn(Optional.of(schedule));
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(i -> i.getArgument(0));

        assertDoesNotThrow(() -> reservationService.createReservation(scheduleId, studentId));

        verify(reservationRepository).save(any(Reservation.class));
        verify(emailService).sendReservationConfirmation(anyString(), anyString(), anyString(), anyString(), any(), any());
    }

    @Test
    void testCreateReservation_AlreadyExists() {
        Long scheduleId = 100L;
        Long studentId = 200L;

        when(participationRepository.existsByReservationScheduleScheduleIdAndStudentId(scheduleId, studentId)).thenReturn(true);

        assertThrows(RuntimeException.class, () -> reservationService.createReservation(scheduleId, studentId));
        verify(reservationRepository, never()).save(any(Reservation.class));
    }

    @Test
    void testCreateReservation_ScheduleNotFound() {
        Long scheduleId = 1L;
        Long studentId = 1L;
        when(participationRepository.existsByReservationScheduleScheduleIdAndStudentId(scheduleId, studentId)).thenReturn(false);
        when(scheduleRepository.findById(scheduleId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> reservationService.createReservation(scheduleId, studentId));
    }

    @Test
    void testCreateReservation_StudentNotFound() {
        Long scheduleId = 1L;
        Long studentId = 1L;
        when(participationRepository.existsByReservationScheduleScheduleIdAndStudentId(scheduleId, studentId)).thenReturn(false);
        when(scheduleRepository.findById(scheduleId)).thenReturn(Optional.of(new InstructorSchedule()));
        when(studentRepository.findById(studentId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> reservationService.createReservation(scheduleId, studentId));
    }
}