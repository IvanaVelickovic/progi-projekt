package com.progi.stemtutor.service;

import com.progi.stemtutor.config.JitsiProperties;
import com.progi.stemtutor.dto.JoinSessionResponse;
import com.progi.stemtutor.model.Reservation;
import com.progi.stemtutor.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JitsiJoinService {

    private final JitsiProperties props;
    private final JitsiJwtService jwtService;

    public JoinSessionResponse buildResponse(Reservation reservation, User user) {
        String roomName = "stemtutor-reservation-" + reservation.getId();
        String displayName = user.getFirstName() + " " + user.getLastName();
        boolean isInstructor = user.getRole().name().equalsIgnoreCase("instructor");

        if (props.isJaas()) {
            try {
                String jwt = jwtService.generate(user, reservation);
                return new JoinSessionResponse(roomName, displayName, isInstructor, jwt, props.getDomain());
            } catch (Exception e) {
                throw new RuntimeException("JWT generation failed", e);
            }
        }

        // public
        return new JoinSessionResponse(roomName, displayName, isInstructor, null, props.getDomain());
    }
}
