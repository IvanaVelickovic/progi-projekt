package com.progi.stemtutor.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.progi.stemtutor.model.enums.AttendanceMode;
import com.progi.stemtutor.model.enums.ScheduleStatus;
import com.progi.stemtutor.model.enums.SubjectName;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "instructor_schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstructorSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long scheduleId;

    @Column(name = "schedule_datetime", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime datetime;

    @Column(name = "duration_min", nullable = false)
    private Integer durationMin;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "attendance_mode", nullable = false, columnDefinition = "attendance_mode")
    private AttendanceMode attendanceMode;

    @Column(name = "max_participants", nullable = false)
    private Integer maxParticipants;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false, columnDefinition = "schedule_status")
    private ScheduleStatus status;

    @Column(name = "google_calendar_id", unique = true)
    private String googleCalendarId;

    @Column(name = "instructor_id", nullable = false)
    private Integer instructorId;
}
