package com.progi.stemtutor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JaaSTokenResponse {
    private String roomName;
    private String appId;
    private String jwt;
}