package com.progi.stemtutor.model;

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

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "student_id", nullable = false)
        private Student student;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "subject_id", nullable = false)
        private Subject subject;

        @Column(name = "knowledge_level", nullable = false)
        private String knowledgeLevel;

        @Column(name = "learning_goals", length = 1000)
        private String learningGoals;


}
