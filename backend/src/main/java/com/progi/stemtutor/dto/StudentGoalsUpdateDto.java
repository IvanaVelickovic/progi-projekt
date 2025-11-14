package com.progi.stemtutor.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class StudentGoalsUpdateDto {

    @Size(max = 500, message = "Ciljevi učenja za Matematiku su predugi (max 500 znakova)")
    private String goalsMath;

    @Size(max = 500, message = "Ciljevi učenja za Fiziku su predugi (max 500 znakova)")
    private String goalsPhi;

    @Size(max = 500, message = "Ciljevi učenja za Informatiku su predugi (max 500 znakova)")
    private String goalsInf;
}