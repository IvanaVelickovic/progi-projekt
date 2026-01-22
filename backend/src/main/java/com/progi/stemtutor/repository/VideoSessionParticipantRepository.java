package com.progi.stemtutor.repository;

import com.progi.stemtutor.model.VideoSessionParticipant;
import com.progi.stemtutor.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface VideoSessionParticipantRepository extends JpaRepository<VideoSessionParticipant, Long> {

    @Query("""
            SELECT p
            FROM VideoSessionParticipant p
            WHERE p.session.id = :sessionId
              AND p.role = :role
            """)
    List<VideoSessionParticipant> findBySessionAndRole(Long sessionId, UserRole role);

    @Query("""
            SELECT p
            FROM VideoSessionParticipant p
            WHERE p.session.id = :sessionId
              AND p.user.id = :userId
              AND p.leftAt IS NULL
            """)
    Optional<VideoSessionParticipant> findActive(Long sessionId, Long userId);
}
