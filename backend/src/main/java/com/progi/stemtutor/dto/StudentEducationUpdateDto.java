package com.progi.stemtutor.dto;

import com.progi.stemtutor.model.enums.KnowledgeLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class StudentEducationUpdateDto {

    private String grade;
    private String knowledgeLevelMath;
    private String knowledgeLevelPhi;
    private String knowledgeLevelInf;

}
