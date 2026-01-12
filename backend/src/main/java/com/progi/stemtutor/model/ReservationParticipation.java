package com.progi.stemtutor.model;

import com.progi.stemtutor.model.enums.ParticipationStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reservation_participations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationParticipation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_participation_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "participation_status", nullable = false)
    private ParticipationStatus participationStatus;

    @ManyToOne(optional = false)
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private Student student;

    @OneToOne(mappedBy = "reservationParticipation")
    private Review review;
}
