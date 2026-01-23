package com.progi.stemtutor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoSessionEndDto {
    String role;
    Long instructorId;
    Long participationId;
}
