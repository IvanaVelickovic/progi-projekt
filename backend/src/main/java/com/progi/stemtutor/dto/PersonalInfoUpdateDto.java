package com.progi.stemtutor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// DTO za Ime i Prezime
@Data
public class PersonalInfoUpdateDto {

    private String firstName;
    private String lastName;
}