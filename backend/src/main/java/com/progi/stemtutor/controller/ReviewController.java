package com.progi.stemtutor.controller;

import com.progi.stemtutor.dto.ReviewRequestDto;
import com.progi.stemtutor.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<String> addReview(@RequestBody ReviewRequestDto dto) {
        try {
            reviewService.saveReview(dto);
            return ResponseEntity.ok("Recenzija je uspješno spremljena!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Došlo je do pogreške na serveru.");
        }
    }
}