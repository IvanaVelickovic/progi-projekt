package com.progi.stemtutor.model;

import com.progi.stemtutor.model.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "reservation_status", nullable = false)
    private ReservationStatus reservationStatus;

    @Column(name = "reservation_notes")
    private String reservationNotes;

    @Column(
            name = "reservation_created_at",
            nullable = false,
            updatable = false
    )
    private Instant reservationCreatedAt;

    @Column(name = "address_in_person")
    private String addressInPerson;

    @ManyToOne(optional = false)
    @JoinColumn(name = "schedule_id")
    private InstructorSchedule schedule;

    @PrePersist
    protected void onCreate() {
        this.reservationCreatedAt = Instant.now();
    }

    @Column(name = "reminder_24h_sent", nullable = false)
    private boolean reminder24hSent = false;

    @Column(name = "reminder_1h_sent", nullable = false)
    private boolean reminder1hSent = false;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL)
    private List<ReservationParticipation> participations = new ArrayList<>();
}
