package com.progi.stemtutor.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "instructors")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class Instructor {

    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "instructor_id")
    public User user;

    @Column(columnDefinition = "TEXT")
    private String biography;
    private BigDecimal hourlyRate;
    private String introVideoUrl;
    private Boolean math;
    private Boolean physics;
    private Boolean it;
    @Column(name = "reference")
    private String references;
    private BigDecimal longitude;
    private BigDecimal latitude;

    @OneToMany(mappedBy = "instructor", fetch = FetchType.LAZY)
    private List<AvailableAtLocation> availableAtLocations;
}
