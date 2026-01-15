package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.InstructorProfileDto;
import com.progi.stemtutor.dto.InstructorSummaryDto;
import com.progi.stemtutor.model.Instructor;
import com.progi.stemtutor.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InstructorProfileService {
    private final InstructorRepository instructorRepository;

    public Optional<Object> getInstructorProfile(Long instructorId) {

        // Dohvati usera
        Optional<Instructor> optInstructor = instructorRepository.findById(instructorId);

        if (optInstructor.isEmpty()) return Optional.empty();
        Instructor instructor = optInstructor.orElse(null);

        List<String> areas = new ArrayList<>();
        if (instructor.isMath()) areas.add("Matematika");
        if (instructor.isPhysics()) areas.add("Fizika");
        if (instructor.isIt()) areas.add("Informatika");
        String expertiseAreas = String.join(", ", areas);

        // Složi DTO
        InstructorProfileDto dto = InstructorProfileDto.builder()
                .id(instructor.getId())
                .firstName(instructor.getUser().getFirstName())
                .lastName(instructor.getUser().getLastName())
                .biography(instructor.getBiography())
                .introVideoUrl(instructor.getIntroVideoUrl())
                .math(instructor.isMath())
                .physics(instructor.isPhysics())
                .it(instructor.isIt())
                .longitude(instructor.getLongitude())
                .latitude(instructor.getLatitude())
                .hourlyRate(instructor.getHourlyRate())
                .expertiseAreas(expertiseAreas)
                .build();

        return Optional.of(dto);
    }

    public Optional<Object> getInstructorSummary(Long instructorId) {

        // Dohvati usera
        Optional<Instructor> optInstructor = instructorRepository.findById(instructorId);

        if (optInstructor.isEmpty()) return Optional.empty();
        Instructor instructor = optInstructor.orElse(null);

        Double avgRating = instructorRepository.findAverageRatingByInstructorId(instructor.getId());
        Integer reviewCount = instructorRepository.countByInstructorId(instructor.getId());

        // Složi DTO
        InstructorSummaryDto dto = InstructorSummaryDto.builder()
                .id(instructor.getId())
                .firstName(instructor.getUser().getFirstName())
                .lastName(instructor.getUser().getLastName())
                .averageRating(avgRating)
                .reviewCount(reviewCount)
                .build();

        return Optional.of(dto);
    }
}
