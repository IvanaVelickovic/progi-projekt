package com.progi.stemtutor.service;

import com.progi.stemtutor.model.Instructor;
import com.progi.stemtutor.model.Student;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.enums.UserRole;
import com.progi.stemtutor.repository.InstructorRepository;
import com.progi.stemtutor.repository.StudentRepository;
import com.progi.stemtutor.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SetupService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final InstructorRepository instructorRepository;

    @Transactional
    public User updateUserRole(String email, UserRole newRole) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != UserRole.noRole) {
            throw new IllegalStateException("Role already set");
        }

        user.setRole(newRole);
        userRepository.save(user);

        if (newRole == UserRole.student) {
            Student student = new Student();
            student.setUser(user);
            student.setGrade(null);
            studentRepository.save(student);

        } else if (newRole == UserRole.instructor) {
            Instructor instructor = new Instructor();
            instructor.setUser(user);  // KLJUČNO
            instructorRepository.save(instructor);
        }

        return user;
    }
}
