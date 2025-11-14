package com.progi.stemtutor.dto;

import com.progi.stemtutor.model.enums.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SetupRequest {

    String email;
    private UserRole role;
}
