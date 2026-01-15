package com.progi.stemtutor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long locationId;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String address;

    @Column(name = "radius_available")
    private Integer radiusAvailable;

    private Double lat;
    private Double lng;

}
