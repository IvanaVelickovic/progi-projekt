package com.progi.stemtutor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JoinSessionResponse {
    private String roomName;
    private String displayName;
    private boolean isInstructor;
    private String jwt;     // za JaaS
    private String domain;  // meet.jit.si ili JaaS domain
}
