package com.progi.stemtutor.dto;

import com.progi.stemtutor.model.Student;

public record StudentDTO(
        String firstName,
        String lastName,
        String grade
) {
    public static StudentDTO fromEntity(Student student) {
        return new StudentDTO(
                student.user.getFirstName(),
                student.user.getLastName(),
                student.getGrade()
        );
    }
}