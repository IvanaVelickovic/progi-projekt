package com.progi.stemtutor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// DTO za promjenu lozinke
@Data
public class PasswordUpdateDto {

    @NotBlank(message = "Trenutna lozinka ne smije biti prazna")
    private String currentPassword;

    @NotBlank(message = "Nova lozinka ne smije biti prazna")
    @Size(min = 8, message = "Lozinka mora imati barem 8 znakova")
    private String newPassword;
}
