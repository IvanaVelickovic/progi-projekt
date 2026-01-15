package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.StudentProfileDto;
import com.progi.stemtutor.model.Student;
import com.progi.stemtutor.model.StudentSubject;
import com.progi.stemtutor.model.enums.SubjectName;
import com.progi.stemtutor.repository.StudentRepository;
import com.progi.stemtutor.repository.StudentSubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentProfileService {
    private final StudentRepository studentRepository;
    private final StudentSubjectRepository studentSubjectRepository;

    public Optional<Object> getStudentProfile(Long studentId) {

        // Dohvati usera
        Optional<Student> optStudent = studentRepository.findById(studentId);

        if (optStudent.isEmpty()) return Optional.empty();
        Student student = optStudent.orElse(null);
        List<SubjectName> subjectNames = Arrays.asList(SubjectName.Matematika, SubjectName.Fizika, SubjectName.Informatika);

        for (SubjectName subName : subjectNames) {
            studentSubjectRepository
                    .findByStudentIdAndSubjectName(student.getId(), subName)
                    .orElseGet(() -> {
                        StudentSubject ss = new StudentSubject();
                        ss.setStudent(student);
                        ss.setSubjectName(subName);
                        ss.setKnowledgeLevel("");
                        ss.setLearningGoals("");
                        return studentSubjectRepository.save(ss);
                    });
        }

        List<StudentSubject> subjectsList = studentSubjectRepository.findByStudentId(student.getId());

        // Helper mapa po imenu predmeta
        Map<SubjectName, StudentSubject> map = subjectsList.stream()
                .collect(Collectors.toMap(
                        StudentSubject::getSubjectName,
                        ss -> ss
                ));

        StudentSubject math = map.get(SubjectName.Matematika);
        StudentSubject phy = map.get(SubjectName.Fizika);
        StudentSubject inf = map.get(SubjectName.Informatika);

        // Složi DTO
        StudentProfileDto dto = StudentProfileDto.builder()
                .firstName(student.getUser().getFirstName())
                .lastName(student.getUser().getLastName())
                .lastName(student.getUser().getLastName())
                .grade(student.getGrade())

                .knowledgeLevelMath(math != null ? math.getKnowledgeLevel() : "")
                .knowledgeLevelPhi(phy != null ? phy.getKnowledgeLevel() : "")
                .knowledgeLevelInf(inf != null ? inf.getKnowledgeLevel() : "")

                .learningGoalsMath(math != null ? math.getLearningGoals() : "")
                .learningGoalsPhi(phy != null ? phy.getLearningGoals() : "")
                .learningGoalsInf(inf != null ? inf.getLearningGoals() : "")
                .build();

        return Optional.of(dto);
    }
}
