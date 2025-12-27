package com.progi.stemtutor.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "available_at_locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AvailableAtLocation {

    @EmbeddedId
    private AvailableAtLocationId id;

    @ManyToOne
    @MapsId("instructorId")
    @JoinColumn(name = "instructor_id")
    private Instructor instructor;

    @ManyToOne
    @MapsId("locationId")
    @JoinColumn(name = "location_id")
    private Location location;
}
