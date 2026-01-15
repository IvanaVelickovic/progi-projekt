package com.progi.stemtutor.model;

import com.progi.stemtutor.model.enums.SubjectName;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.Instant;

@Entity
@Table(name = "student_subjects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class StudentSubject {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "student_subject_id")
        private Long id;

        @ToString.Exclude
        @EqualsAndHashCode.Exclude
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "student_id", nullable = false)
        private Student student;

        @Enumerated(EnumType.STRING)
        @Column(name = "subject_name", nullable = false, length = 50)
        private SubjectName subjectName;

        @Column(name = "knowledge_level", nullable = true)
        private String knowledgeLevel;

        @Column(name = "learning_goals", length = 1000)
        private String learningGoals;


}