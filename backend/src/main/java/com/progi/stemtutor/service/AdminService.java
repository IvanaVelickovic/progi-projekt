package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.AdminReviewResponseDto;
import com.progi.stemtutor.dto.AdminUserResponseDto;
import com.progi.stemtutor.dto.AdminUserStatusUpdateDto;
import com.progi.stemtutor.model.Review;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.enums.UserStatus;
import com.progi.stemtutor.repository.ReviewRepository;
import com.progi.stemtutor.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.nullness.qual.MonotonicNonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public List<AdminUserResponseDto> getAllUsers() {
        return userRepository.findAll().stream().map(user -> AdminUserResponseDto.builder()
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(String.valueOf(user.getRole()))
                .status(String.valueOf(user.getStatus()))
                .isVerified(user.isVerified())
                .createdAt(user.getCreatedAt() != null ?
                        LocalDateTime.ofInstant(user.getCreatedAt(), ZoneId.systemDefault()) : null)
                .lastLogin(user.getLastLogin() != null ?
                        LocalDateTime.ofInstant(user.getLastLogin(), ZoneId.systemDefault()) : null)
                .build()
        ).collect(Collectors.toList());
    }

    public List<AdminReviewResponseDto> getAllReviews() {
        return reviewRepository.findAll().stream().map(review -> {
            AdminReviewResponseDto dto = new AdminReviewResponseDto();
            dto.setReviewId(review.getId());
            dto.setRating(review.getRating());
            dto.setComment(review.getComment());
            dto.setRemoved(review.isReviewRemoved());

            // Sigurnije izvlacenje podataka
            String sFirstName = "Nepoznato";
            String sLastName = "";
            String iFirstName = "Nepoznato";
            String iLastName = "";

            var participation = review.getReservationParticipation();
            if (participation != null) {
                // Podaci o studentu
                if (participation.getStudent() != null && participation.getStudent().getUser() != null) {
                    sFirstName = participation.getStudent().getUser().getFirstName();
                    sLastName = participation.getStudent().getUser().getLastName();
                }

                // Podaci o instruktoru
                if (participation.getReservation() != null &&
                        participation.getReservation().getSchedule() != null &&
                        participation.getReservation().getSchedule().getInstructor() != null &&
                        participation.getReservation().getSchedule().getInstructor().getUser() != null) {

                    var instructorUser = participation.getReservation().getSchedule().getInstructor().getUser();
                    iFirstName = instructorUser.getFirstName();
                    iLastName = instructorUser.getLastName();
                }
            }

            dto.setStudentName(sFirstName);
            dto.setStudentLastName(sLastName);
            dto.setInstructorName(iFirstName);
            dto.setInstructorLastName(iLastName);

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
                .createdAt(LocalDateTime.ofInstant(user.getCreatedAt(), ZoneId.systemDefault()))
                .lastLogin(LocalDateTime.ofInstant(user.getLastLogin(), ZoneId.systemDefault()))
                .build());
    }

    @Transactional
    public void verifyUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));

        user.setVerified(true); // Koristi metodu koju smo upravo dodali
        userRepository.save(user);
    }

    @Transactional
    public void updateUserStatus(Long userId, AdminUserStatusUpdateDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen"));

        user.setStatus(UserStatus.valueOf(dto.getStatus().toLowerCase()));
        userRepository.save(user);
    }

    @Transactional
    public void hardDeleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Korisnik nije pronađen.");
        }
        userRepository.deleteById(userId);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new RuntimeException("Recenzija nije pronađena.");
        }

        // Koristimo native query da zaobiđemo Hibernate Transient error
        reviewRepository.deleteById(reviewId);
    }
}
