package com.progi.stemtutor.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "instructors")
@PrimaryKeyJoinColumn(name = "instructor_id")
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class Instructor extends User {

    @Column(columnDefinition = "TEXT")
    private String biography;

    @Column(name = "hourly_rate")
    private BigDecimal hourlyRate;

    @Column(name = "intro_video_url", length = 2083)
    private String introVideoUrl;

    @OneToMany(mappedBy = "instructor")
    private List<AvailableAtLocation> availableAtLocations;
}