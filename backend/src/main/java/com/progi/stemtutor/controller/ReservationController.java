package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.CreateReservationRequestDto;
import com.progi.stemtutor.dto.InstructorSearchResponseDto;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.service.ReservationService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/reservation")
    public void createReservation(
            @RequestBody CreateReservationRequestDto request,
            @AuthenticationPrincipal UserDetails userDetails) {

        System.out.println("moj request: " + request);
        if (userDetails instanceof User) {
            Long studentId = ((User) userDetails).getId();

            reservationService.createReservation(
                    request.schedule_id,
                    studentId
            );

        } else {
            throw new IllegalStateException("Ulogirani korisnik nije naš User entitet. Ne možemo dobiti ID.");
        }
    }

    @GetMapping("/schedules")
    public List<InstructorSearchResponseDto> getMySchedules(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (userDetails instanceof User user) {
            return reservationService.getStudentSchedules(user.getId());
        }
        throw new IllegalStateException("Ulogirani korisnik nije naš User entitet. Ne možemo dobiti ID.");
    }
}
