package com.progi.stemtutor.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AvailableAtLocationId implements Serializable {

    @Column(name = "instructor_id")
    private Long instructorId;

    @Column(name = "location_id")
    private Long locationId;
}
