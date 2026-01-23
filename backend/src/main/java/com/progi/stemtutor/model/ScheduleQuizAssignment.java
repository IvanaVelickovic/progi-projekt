package com.progi.stemtutor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "schedule_quiz_assignments")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class ScheduleQuizAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_quiz_assignment_id")
    private Long id;

    @Column(name = "assignment_url")
    private String assignmentUrl;

    @Column(name = "due_at")
    private LocalDateTime dueAt;

    @Column(name = "is_completed")
    private boolean completed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id")
    private InstructorSchedule instructorSchedule;
}
