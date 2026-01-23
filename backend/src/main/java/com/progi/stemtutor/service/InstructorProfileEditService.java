package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.*;
import com.progi.stemtutor.model.Instructor;
import com.progi.stemtutor.model.Student;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.enums.SubjectName;
import com.progi.stemtutor.model.enums.UserRole;
import com.progi.stemtutor.repository.InstructorRepository;
import com.progi.stemtutor.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class InstructorProfileEditService {

    private final UserRepository userRepository;
    private final InstructorRepository instructorRepository;
    private final PasswordEncoder passwordEncoder;

    public InstructorProfileEditService(UserRepository userRepository, InstructorRepository instructorRepository,
                                     PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.instructorRepository = instructorRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public Optional<Object> getProfileData(Long userId) {

        // Dohvati usera
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }
        User user = userOpt.get();
        System.out.println("aaaaa");

        // Ako nije student → vrati samo osnovne podatke
        if (user.getRole() != UserRole.instructor) {
            return Optional.empty();
        }

        // Ako jest student, ali nema Student entitet → kreiraj ga
        Instructor instructor = instructorRepository.findById(userId).orElseGet(() -> {
            Instructor i = new Instructor();
            i.setUser(user);
            System.out.println(user);
            System.out.println("spremam instruktora");
            return instructorRepository.save(i);
        });

        System.out.println("IMAM INSTRUKTORA");

        InstructorProfileDto dto = InstructorProfileDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .biography(instructor.getBiography())
                .latitude(instructor.getLatitude())
                .longitude(instructor.getLongitude())
                .hourlyRate(instructor.getHourlyRate())
                .introVideoUrl(instructor.getIntroVideoUrl())
                .references(instructor.getReferences())
                .math(Boolean.TRUE.equals(instructor.getMath()))
                .physics(Boolean.TRUE.equals(instructor.getPhysics()))
                .it(Boolean.TRUE.equals(instructor.getIt()))
                .build();
        System.out.println(dto);
        return Optional.of(dto);
    }

    // Osobni podaci i lozinka (ostaju isti)
    public boolean updatePersonalInfo(Long userId, PersonalInfoUpdateDto dto) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return false; // Korisnik nije pronađen
        }

        User user = userOpt.get();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        userRepository.save(user);
        return true;
    }

    @Transactional
    public Optional<Boolean> changePassword(Long userId, PasswordUpdateDto dto) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return Optional.empty(); // Korisnik nije pronađen
        }

        User user = userOpt.get();

        //TO-DO: baci fix, fali ono kad usporedujes stari
        if (user.getPasswordHash() == null || !passwordEncoder.matches(dto.getCurrentPassword(), user.getPasswordHash())) {
            // Umjesto prilagođene iznimke, bacamo standardnu koja signalizira problem s lozinkom
            throw new IllegalStateException("Trenutna lozinka nije ispravna.");
        }

        user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
        return Optional.of(true);
    }

    @Transactional
    public boolean updateInstructorBiography(Long userId,InstructorBiographyDto dto) {
        Optional<Instructor> instructorOpt = instructorRepository.findById(userId);

        if (instructorOpt.isEmpty()) {
            return false; // Profil studenta nije pronađen
        }
        Instructor instructor = instructorOpt.get();

        System.out.println(dto.getLatitude());
        System.out.println(dto.getLongitude());
        instructor.setBiography(dto.getBiography());
        instructor.setLatitude(dto.getLatitude());
        instructor.setLongitude(dto.getLongitude());

        instructorRepository.save(instructor);

        return true;
    }

    @Transactional
    public boolean updateInstructorExpertise(Long userId,InstructorExpertiseDto dto) {
        Optional<Instructor> instructorOpt = instructorRepository.findById(userId);

        if (instructorOpt.isEmpty()) {
            return false; // Profil studenta nije pronađen
        }
        Instructor instructor = instructorOpt.get();
        instructor.setMath(dto.isMath());
        instructor.setPhysics(dto.isPhysics());
        instructor.setIt(dto.isIt());
        instructor.setHourlyRate(dto.getHourlyRate());
        instructor.setIntroVideoUrl(dto.getIntroVideoUrl());
        instructor.setReferences(dto.getReferences());

        instructorRepository.save(instructor);

        return true;
    }
}


