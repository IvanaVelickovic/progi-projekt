package com.progi.stemtutor.dto;

import com.progi.stemtutor.model.Student;

public record StudentDto(
        String firstName,
        String lastName,
        String grade
) {
    public static StudentDto fromEntity(Student student) {
        return new StudentDto(
                student.user.getFirstName(),
                student.user.getLastName(),
                student.getGrade()
        );
    }
}