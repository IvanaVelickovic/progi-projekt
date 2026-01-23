package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.*;
import com.progi.stemtutor.service.InstructorProfileEditService;
import com.progi.stemtutor.model.User;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/Instructor")

public class InstructorProfileEditController {

    private final InstructorProfileEditService instructorProfileEditService;

    public InstructorProfileEditController(InstructorProfileEditService instructorProfileEditService) {
        this.instructorProfileEditService = instructorProfileEditService;
    }

    // Pomoćna metoda za dohvaćanje ID-a iz Principal objekta
    private Long getUserId(UserDetails userDetails) {

        /*
        //if za testing
        if (userDetails == null) {
            log.warn("TESTNI MOD: UserDetails je null, vracam ID 3 za testiranje.");
            return 3L;
        }*/

        if (userDetails instanceof User) {
            return ((User) userDetails).getId();
        }
        // Ako je samo UserDetails, ovo bi trebalo izbaciti grešku jer ne znamo ID.
        // Ovo je bitna pretpostavka za funkcionalnost aplikacije.
        throw new IllegalStateException("Ulogirani korisnik nije naš User entitet. Ne možemo dobiti ID.");
    }

    // DOHVAĆANJE PODATAKA (GET /api/user/profile)
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        System.out.println(userDetails);
        System.out.println(userId);
        return instructorProfileEditService.getProfileData(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Korisnik nije pronađen."));
    }

    // AŽURIRANJE OSOBNIH PODATAKA (PUT /api/user/update)
    @PutMapping("/update")
    public ResponseEntity<Void> updatePersonalInfo(@AuthenticationPrincipal UserDetails userDetails,
                                                   @Valid @RequestBody PersonalInfoUpdateDto dto) {
        Long userId = getUserId(userDetails);
        if (userDetails == null) {
            log.warn("Pristup zaštićenoj ruti bez autentikacije. Vraćam 401.");
            // Vraćamo 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean success = instructorProfileEditService.updatePersonalInfo(userId, dto);

        if (success) {
            return ResponseEntity.noContent().build(); // 204 No Content za uspješno ažuriranje
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 Not Found ako korisnik ne postoji
        }
    }

    // PROMJENA LOZINKE (POST /api/user/change-password)
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                            @Valid @RequestBody PasswordUpdateDto dto) {
        Long userId = getUserId(userDetails);

        try {
            Optional<Boolean> result = instructorProfileEditService.changePassword(userId, dto);

            if (result.isEmpty()) {
                // Korisnik nije pronađen (Service je vratio Optional.empty())
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Korisnik nije pronađen.");
            }

            return ResponseEntity.status(HttpStatus.OK).build(); // 204 No Content
        } catch (IllegalStateException e) {
            // Service je bacio IllegalStateException (Lozinka nije ispravna)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage()); // 401 Unauthorized
        }
    }

    @PostMapping("/update-biography")
    public ResponseEntity<?> updateStudentEducation(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody InstructorBiographyDto dto) {

        Long userId = getUserId(userDetails);

        boolean success = instructorProfileEditService.updateInstructorBiography(userId, dto);

        if (success) {
            return ResponseEntity.ok(Map.of("status", "ok"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student nije pronađen");
        }
    }

    // AŽURIRANJE CILJEVA UČENJA (POST /api/user/update-goals)
    @PostMapping("/update-expertise")
    public ResponseEntity<?> updateInstructorExpertise(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody InstructorExpertiseDto dto) {

        Long userId = getUserId(userDetails);

        boolean success = instructorProfileEditService.updateInstructorExpertise(userId, dto);

        if (success) {
            return ResponseEntity.ok(Map.of("status", "ok"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student nije pronađen");
        }
    }
}
