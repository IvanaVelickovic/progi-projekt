package com.progi.stemtutor.dto;

import lombok.Data;

@Data
public class StudentEducationUpdateDto {

    private String grade;
    private String knowledgeLevelMath;
    private String knowledgeLevelPhi;
    private String knowledgeLevelInf;

}
