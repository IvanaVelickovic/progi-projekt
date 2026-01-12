package com.progi.stemtutor.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "instructors")
@PrimaryKeyJoinColumn(name = "instructor_id") // This links back to user_id
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true) // Important for @Data with inheritance
@SuperBuilder
public class Instructor extends User { // <--- Must extend User

    // Remove the id and user fields entirely.
    // They are inherited from User.

    @Column(columnDefinition = "TEXT")
    private String biography;

    @Column(name = "hourly_rate")
    private BigDecimal hourlyRate;

    @Column(name = "intro_video_url", length = 2083)
    private String introVideoUrl;
}