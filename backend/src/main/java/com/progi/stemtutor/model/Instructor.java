package com.progi.stemtutor.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "students")
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class Instructor extends User {
    private String biography;
    private BigDecimal hourlyRate;
    private String introVideoUrl;
}
