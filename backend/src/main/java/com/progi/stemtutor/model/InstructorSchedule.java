package com.progi.stemtutor.model;

import com.progi.stemtutor.model.enums.AttendanceMode;
import com.progi.stemtutor.model.enums.ScheduleStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "instructor_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstructorSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long id;

    @Column(name = "schedule_datetime", nullable = false)
    private LocalDateTime scheduleDateTime;

    @Column(name = "duration_min", nullable = false)
    private Integer durationMin;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(name = "attendance_mode", nullable = false)
    private AttendanceMode attendanceMode;

    @Column(name = "max_participants", nullable = false)
    private Integer maxParticipants;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleStatus status;

    @Column(name = "google_calendar_id", unique = true)
    private String googleCalendarId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Instructor instructor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_subject_id", nullable = false)
    private InstructorSubject instructorSubject;

    @OneToMany(mappedBy = "schedule", fetch = FetchType.LAZY)
    private List<Reservation> reservations;

}
