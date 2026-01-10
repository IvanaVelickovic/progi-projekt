package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.PersonalInfoUpdateDto;
import com.progi.stemtutor.dto.PasswordUpdateDto;
import com.progi.stemtutor.dto.StudentEducationUpdateDto; // NOVI IMPORT
import com.progi.stemtutor.dto.StudentGoalsUpdateDto; // NOVI IMPORT
import com.progi.stemtutor.dto.ProfileDto;
import com.progi.stemtutor.model.Student;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.StudentSubject;
import com.progi.stemtutor.model.enums.SubjectName;
import com.progi.stemtutor.model.enums.UserRole;
import com.progi.stemtutor.repository.StudentRepository;
import com.progi.stemtutor.repository.StudentSubjectRepository;
import com.progi.stemtutor.repository.SubjectRepository;
import com.progi.stemtutor.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final StudentSubjectRepository studentSubjectRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(UserRepository userRepository, StudentRepository studentRepository,
                          StudentSubjectRepository studentSubjectRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.studentSubjectRepository = studentSubjectRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Pomoćna funkcija za ažuriranje/kreiranje StudentSubject entiteta
    private void updateOrCreateStudentSubject(Long studentId, SubjectName subjectName, String knowledgeLevel, String learningGoals) {

        // Pokušaj pronaći postojeći unos za tog studenta i taj predmet
        Optional<StudentSubject> studentSubjectOpt =
                studentSubjectRepository.findByStudentIdAndSubjectName(studentId, subjectName);

        StudentSubject studentSubject;
        if (studentSubjectOpt.isPresent()) {
            studentSubject = studentSubjectOpt.get();
        } else {
            // Ako ne postoji, kreiraj novi unos
            Student student = studentRepository.findById(studentId).orElse(null);
            if (student == null) return; // Greška, student bi trebao postojati

            studentSubject = new StudentSubject();
            studentSubject.setStudent(student); // Postavi FK na studenta
            studentSubject.setSubjectName(subjectName); // Postavi FK na predmet

        }

        // Ažuriraj samo ako je vrijednost poslana (null se ignorira)
        if (knowledgeLevel != null) {
            studentSubject.setKnowledgeLevel(knowledgeLevel);
        }
        if (learningGoals != null) {
            studentSubject.setLearningGoals(learningGoals);
        }

        studentSubjectRepository.save(studentSubject);
    }

    public Optional<Object> getProfileData(Long userId) {

        // Dohvati usera
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }
        User user = userOpt.get();
        System.out.println("aaaaa");

        // Ako nije student → vrati samo osnovne podatke
        if (user.getRole() != UserRole.student) {
            return Optional.of(new ProfileDto(
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    null,
                    null, null, null,
                    null, null, null
            ));
        }

        // Ako jest student, ali nema Student entitet → kreiraj ga
        Student student = studentRepository.findById(userId).orElseGet(() -> {
            Student s = new Student();
            s.setUser(user);
            System.out.println(user);
            s.setGrade(null);
            System.out.println("spremam studneta");
            return studentRepository.save(s);
        });

        System.out.println("IMAM STUDENTA");
        // Provjeri StudentSubject
        List<SubjectName> subjectNames = Arrays.asList(SubjectName.Matematika, SubjectName.Fizika, SubjectName.Informatika);

        for (SubjectName subName : subjectNames) {
            studentSubjectRepository
                    .findByStudentIdAndSubjectName(student.getId(), subName)
                    .orElseGet(() -> {
                        StudentSubject ss = new StudentSubject();
                        ss.setStudent(student);
                        ss.setSubjectName(subName); // Postavi Enum
                        ss.setKnowledgeLevel("");


                        ss.setLearningGoals("");
                        return studentSubjectRepository.save(ss);
                    });
        }

        // Dohvati studentske predmete
        System.out.println("doša do tu");
        List<StudentSubject> subjectsList = studentSubjectRepository.findByStudentId(student.getId());
        System.out.println(subjectsList + "aaaaaaaaaaaaaaaaaaa");
        // Helper mapa po imenu predmeta
        Map<SubjectName, StudentSubject> map = subjectsList.stream()
                .collect(Collectors.toMap(
                        StudentSubject::getSubjectName,
                        ss -> ss
                ));

        System.out.println(map + "bbbbbbbbbbbbbbbb");

        StudentSubject math = map.get(SubjectName.Matematika);
        StudentSubject phy = map.get(SubjectName.Fizika);
        StudentSubject inf = map.get(SubjectName.Informatika);

        System.out.println(math + "aahahahiodhio");
        System.out.println(phy + "aahahahiodhio");
        System.out.println(inf + "aahahahiodhio");
        // Složi DTO
        ProfileDto dto = ProfileDto.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .grade(student.getGrade())

                .knowledgeLevelMath(math != null ? math.getKnowledgeLevel() : "")
                .knowledgeLevelPhi(phy != null ? phy.getKnowledgeLevel() : "")
                .knowledgeLevelInf(inf != null ? inf.getKnowledgeLevel() : "")

                .learningGoalsMath(math != null ? math.getLearningGoals() : "")
                .learningGoalsPhi(phy != null ? phy.getLearningGoals() : "")
                .learningGoalsInf(inf != null ? inf.getLearningGoals() : "")
                .build();
        System.out.println(dto);
        return Optional.of(dto);
    }

    // Osobni podaci i lozinka (ostaju isti)
    public boolean updatePersonalInfo(Long userId, PersonalInfoUpdateDto dto) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return false; // Korisnik nije pronađen
        }

        User user = userOpt.get();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        userRepository.save(user);
        return true;
    }

    @Transactional
    public Optional<Boolean> changePassword(Long userId, PasswordUpdateDto dto) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return Optional.empty(); // Korisnik nije pronađen
        }

        User user = userOpt.get();

        //TO-DO: baci fix, fali ono kad usporedujes stari
        if (user.getPasswordHash() == null || !passwordEncoder.matches(dto.getCurrentPassword(), user.getPasswordHash())) {
            // Umjesto prilagođene iznimke, bacamo standardnu koja signalizira problem s lozinkom
            throw new IllegalStateException("Trenutna lozinka nije ispravna.");
        }

        user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
        return Optional.of(true);
    }

    @Transactional
    public boolean updateStudentEducation(Long userId, StudentEducationUpdateDto dto) {
        System.out.println("UŠA U UPDATE STUDENT EDUCATION");
        Optional<Student> studentOpt = studentRepository.findById(userId);
        System.out.println("POSLE REPOSITORYA");

        if (studentOpt.isEmpty()) {
            return false; // Profil studenta nije pronađen
        }
        Student student = studentOpt.get();
        student.setGrade(dto.getGrade());
        studentRepository.save(student);

        // Ažuriranje student_subjects tablice (Razine znanja)
        // Pozovi pomoćnu funkciju za svaki predmet
        updateOrCreateStudentSubject(student.getId(), SubjectName.Matematika, dto.getKnowledgeLevelMath(), null);
        updateOrCreateStudentSubject(student.getId(), SubjectName.Fizika, dto.getKnowledgeLevelPhi(), null);
        updateOrCreateStudentSubject(student.getId(), SubjectName.Informatika, dto.getKnowledgeLevelInf(), null);

        return true;
    }


    @Transactional
    public boolean updateStudentGoals(Long userId, StudentGoalsUpdateDto dto) {
        // Provjeri postojanje studenta (za ResourceNotFoundException)
        Optional<Student> studentOpt = studentRepository.findById(userId);
        if (studentOpt.isEmpty()) return false;

        // Ažuriranje student_subjects tablice (Ciljevi učenja)
        // Pozovi pomoćnu funkciju za svaki predmet
        updateOrCreateStudentSubject(userId, SubjectName.Matematika, null, dto.getGoalsMath());
        updateOrCreateStudentSubject(userId, SubjectName.Fizika, null, dto.getGoalsPhi());
        updateOrCreateStudentSubject(userId, SubjectName.Informatika, null, dto.getGoalsInf());

        return true;
    }

}

