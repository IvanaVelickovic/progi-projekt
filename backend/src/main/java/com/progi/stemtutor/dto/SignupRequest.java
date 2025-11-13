package com.progi.stemtutor.dto;


import com.progi.stemtutor.model.enums.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {

    String firstName;
    String lastName;
    String email;
    String password;
    UserRole role;
}