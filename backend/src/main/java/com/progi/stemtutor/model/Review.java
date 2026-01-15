package com.progi.stemtutor.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long id;

    @Column(nullable = false)
    private int rating;

    @Column
    private String comment;

    @Column(name = "review_created_at", nullable = false)
    private Instant reviewCreatedAt = Instant.now();

    @Column(name = "is_review_removed", nullable = false)
    private boolean isReviewRemoved = false;

    @OneToOne(optional = false)
    @JoinColumn(name = "reservation_participation_id")
    private ReservationParticipation reservationParticipation;
}
