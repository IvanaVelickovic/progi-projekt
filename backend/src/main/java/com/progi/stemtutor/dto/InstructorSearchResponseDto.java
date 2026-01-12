package com.progi.stemtutor.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.progi.stemtutor.model.enums.AttendanceMode;
import com.progi.stemtutor.model.enums.SubjectName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({
        "id",
        "dateTime",
        "maxParticipants",
        "filled",
        "duration",
        "price",
        "format",
        "subject",
        "instructorName",
        "instructorId"
})
public class InstructorSearchResponseDto {
    private Long id;
    private LocalDateTime DateTime;
    private Integer maxParticipants;
    private Long filled;
    private Integer duration;
    private BigDecimal price;
    private AttendanceMode format;
    private SubjectName subject;
    private String instructorName;
    private Long instructorId;
}