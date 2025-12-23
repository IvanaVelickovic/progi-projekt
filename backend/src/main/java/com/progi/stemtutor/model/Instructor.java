package com.progi.stemtutor.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "instructors")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class Instructor {

    @Id
    @Column(name = "instructor_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "instructor_id")
    public User user;

    private String biography;
    private BigDecimal hourlyRate;
    private String introVideoUrl;
}
