package com.progi.stemtutor.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "instructor_subjects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstructorSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "instructor_subject_id")
    private Long id;

    @Column(name = "is_removed", nullable = false)
    private boolean isRemoved = false;

    // 🔹 više instructor_subject → jedan instructor
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id", nullable = false)
    private Instructor instructor;

    // 🔹 više instructor_subject → jedan subject
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
}
