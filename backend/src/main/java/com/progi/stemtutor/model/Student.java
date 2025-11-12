package com.progi.stemtutor.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@Entity
@Table(name = "students")
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class Student extends User {

    private String grade;
    private String preferredTimes;

}
