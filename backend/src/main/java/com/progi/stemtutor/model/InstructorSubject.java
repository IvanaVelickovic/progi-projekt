package com.progi.stemtutor.model;

import com.progi.stemtutor.model.enums.SubjectName;
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

    @Enumerated(EnumType.STRING)
    @Column(name = "subject_name", nullable = false)
    private SubjectName subjectName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id", nullable = false)
    private Instructor instructor;
}
