package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.PersonalInfoUpdateDto;
import com.progi.stemtutor.dto.PasswordUpdateDto;
import com.progi.stemtutor.dto.StudentEducationDto;
import com.progi.stemtutor.dto.StudentGoalsDto;
import com.progi.stemtutor.service.StudentProfileEditService;
import com.progi.stemtutor.model.User; // Pretpostavljam da je User vaš Principal

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
@RequestMapping("/api/user")
public class StudentProfileEditController {

    private final StudentProfileEditService studentProfileEditService;

    public StudentProfileEditController(StudentProfileEditService studentProfileEditService) {
        this.studentProfileEditService = studentProfileEditService;
    }

    // Pomoćna metoda za dohvaćanje ID-a iz Principal objekta
    private Long getUserId(UserDetails userDetails) {
        // OVISI O VAŠOJ SPRING SECURITY IMPLEMENTACIJI.
        // AKO VAM JE PRINCIPAL VAŠ USER ENTITET:
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
        return studentProfileEditService.getProfileData(userId)
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

        boolean success = studentProfileEditService.updatePersonalInfo(userId, dto);

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
            Optional<Boolean> result = studentProfileEditService.changePassword(userId, dto);

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

    // AŽURIRANJE OBRAZOVANJA/RAZINE ZNANJA (POST /api/user/update-education)
    @PostMapping("/update-education")
    public ResponseEntity<?> updateStudentEducation(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody StudentEducationDto dto) {

        Long userId = getUserId(userDetails);

        boolean success = studentProfileEditService.updateStudentEducation(userId, dto);

        if (success) {
            return ResponseEntity.ok(Map.of("status", "ok"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student nije pronađen");
        }
    }

    // AŽURIRANJE CILJEVA UČENJA (POST /api/user/update-goals)
    @PostMapping("/update-goals")
    public ResponseEntity<?> updateStudentGoals(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody StudentGoalsDto dto) {

        Long userId = getUserId(userDetails);

        boolean success = studentProfileEditService.updateStudentGoals(userId, dto);

        if (success) {
            return ResponseEntity.ok(Map.of("status", "ok"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student nije pronađen");
        }
    }
}
