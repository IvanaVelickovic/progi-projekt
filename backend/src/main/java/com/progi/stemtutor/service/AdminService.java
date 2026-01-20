package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.AdminReviewResponseDto;
import com.progi.stemtutor.dto.AdminUserResponseDto;
import com.progi.stemtutor.model.Review;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.enums.UserStatus;
import com.progi.stemtutor.repository.ReviewRepository;
import com.progi.stemtutor.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));
        user.setStatus(UserStatus.valueOf(status.toLowerCase()));
        userRepository.save(user);
    }

    @Transactional
    public void verifyUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));
        user.setVerified(true);
        userRepository.save(user);
    }

    public List<AdminReviewResponseDto> getAllReviews() {
        return reviewRepository.findAll().stream().map(review -> {
            AdminReviewResponseDto dto = new AdminReviewResponseDto();
            dto.setReviewId(review.getId());
            dto.setRating(review.getRating());
            dto.setComment(review.getComment());
            dto.setRemoved(review.isReviewRemoved());

            // Izvlačenje imena preko relacija
            dto.setStudentName(review.getReservationParticipation().getStudent().getUser().getFirstName());
            dto.setInstructorName(review.getReservationParticipation().getReservation().getSchedule().getInstructor().getUser().getFirstName());
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void toggleReviewVisibility(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Recenzija nije pronađena"));
        review.setReviewRemoved(!review.isReviewRemoved());
        reviewRepository.save(review);
    }

    public Page<AdminUserResponseDto> getUsersPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        return userRepository.findAll(pageable).map(user -> AdminUserResponseDto.builder()
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .isVerified(user.isVerified())
                .createdAt(user.getCreatedAt())
                .lastLogin(user.getLastLogin())
                .build());
    }
}
