package com.progi.stemtutor.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ProfileDto {

    @JsonProperty("first_name")
    private String firstName;

    @JsonProperty("last_name")
    private String lastName;

    private String email;

    private String grade;

    @JsonProperty("knowledge_data_math")
    private String knowledgeLevelMath;
    @JsonProperty("knowledge_data_phi")
    private String knowledgeLevelPhi;
    @JsonProperty("knowledge_data_inf")
    private String knowledgeLevelInf;

    @JsonProperty("learning_goals_math")
    private String learningGoalsMath;
    @JsonProperty("learning_goals_phi")
    private String learningGoalsPhi;
    @JsonProperty("learning_goals_inf")
    private String learningGoalsInf;
}
