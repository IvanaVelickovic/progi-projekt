package com.progi.stemtutor.service;

import com.progi.stemtutor.dto.PersonalInfoUpdateDto;
import com.progi.stemtutor.dto.PasswordUpdateDto;
import com.progi.stemtutor.dto.StudentEducationUpdateDto; // NOVI IMPORT
import com.progi.stemtutor.dto.StudentGoalsUpdateDto; // NOVI IMPORT
import com.progi.stemtutor.dto.ProfileDto;
import com.progi.stemtutor.model.Student;
import com.progi.stemtutor.model.User;
import com.progi.stemtutor.model.StudentSubject;
import com.progi.stemtutor.model.Subject;
import com.progi.stemtutor.repository.StudentRepository;
import com.progi.stemtutor.repository.StudentSubjectRepository;
import com.progi.stemtutor.repository.SubjectRepository;
import com.progi.stemtutor.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final StudentSubjectRepository studentSubjectRepository;
    private final SubjectRepository subjectRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(UserRepository userRepository, StudentRepository studentRepository,
                          StudentSubjectRepository studentSubjectRepository, SubjectRepository subjectRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.studentSubjectRepository = studentSubjectRepository;
        this.subjectRepository = subjectRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Pomoćna funkcija za ažuriranje/kreiranje StudentSubject entiteta
    private void updateOrCreateStudentSubject(Long studentId, String subjectName, String knowledgeLevel, String learningGoals) {
        // Pronađi Subject po imenu (Matematika/Fizika/Informatika)
        Optional<Subject> subjectOpt = subjectRepository.findBySubjectName(subjectName);
        if (subjectOpt.isEmpty()) {
            // Logiraj ili baci grešku ako subject nije pronađen (ne bi se trebalo dogoditi)
            return;
        }
        Subject subject = subjectOpt.get();

        // Pokušaj pronaći postojeći unos za tog studenta i taj predmet
        Optional<StudentSubject> studentSubjectOpt =
                studentSubjectRepository.findByStudentIdAndSubjectId(studentId, subject.getId());

        StudentSubject studentSubject;
        if (studentSubjectOpt.isPresent()) {
            studentSubject = studentSubjectOpt.get();
        } else {
            // Ako ne postoji, kreiraj novi unos
            Student student = studentRepository.findById(studentId).orElse(null);
            if (student == null) return; // Greška, student bi trebao postojati

            studentSubject = new StudentSubject();
            studentSubject.setStudent(student); // Postavi FK na studenta
            studentSubject.setSubject(subject); // Postavi FK na predmet

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

    // Ovdje bi išla implementacija getProfileData
    public Optional<Object> getProfileData(Long userId) {

        // 1. Dohvati usera
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }
        User user = userOpt.get();

        // 2. Dohvati studenta
        Optional<Student> studentOpt = studentRepository.findById(userId);
        if (studentOpt.isEmpty()) {
            return Optional.empty();
        }
        Student student = studentOpt.get();

        // 3. Dohvati studentske predmete
        // (pretpostavljam da svaki student ima maksimalno 3 unosa u student_subjects)
        List<StudentSubject> subjects = studentSubjectRepository.findByStudentId(userId);

        // Helper mapa po imenu predmeta
        Map<String, StudentSubject> map = subjects.stream()
                .collect(Collectors.toMap(
                        ss -> ss.getSubject().getSubjectName(),
                        ss -> ss
                ));

        StudentSubject math = map.get("Matematika");
        StudentSubject phy = map.get("Fizika");
        StudentSubject inf = map.get("Informatika");

        // 4. Složi DTO
        ProfileDto dto = ProfileDto.builder()
                .firstName(user.getFirstName())
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

        if (user.getPasswordHash() != null && !passwordEncoder.matches(dto.getCurrentPassword(), user.getPasswordHash())) {
            // Umjesto prilagođene iznimke, bacamo standardnu koja signalizira problem s lozinkom
            throw new IllegalStateException("Trenutna lozinka nije ispravna.");
        }

        user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
        return Optional.of(true);
    }


    // Implementacija NOVE RUTE 1: AŽURIRANJE OBRAZOVANJA I RAZINA ZNANJA
    @Transactional
    public boolean updateStudentEducation(Long userId, StudentEducationUpdateDto dto) {
        Optional<Student> studentOpt = studentRepository.findById(userId);

        if (studentOpt.isEmpty()) {
            return false; // Profil studenta nije pronađen
        }
        Student student = studentOpt.get();
        student.setGrade(dto.getGrade());
        studentRepository.save(student);

        // 2. Ažuriranje student_subjects tablice (Razine znanja)
        // Pozovi pomoćnu funkciju za svaki predmet
        updateOrCreateStudentSubject(userId, "Matematika", dto.getKnowledgeLevelMath(), null);
        updateOrCreateStudentSubject(userId, "Fizika", dto.getKnowledgeLevelPhi(), null);
        updateOrCreateStudentSubject(userId, "Informatika", dto.getKnowledgeLevelInf(), null);

        return true;
    }

    // Implementacija NOVE RUTE 2: AŽURIRANJE CILJEVA UČENJA
    @Transactional
    public boolean updateStudentGoals(Long userId, StudentGoalsUpdateDto dto) {
        // 1. Provjeri postojanje studenta (za ResourceNotFoundException)
        if (!studentRepository.existsById(userId)) {
            return false;
        }

        // 2. Ažuriranje student_subjects tablice (Ciljevi učenja)
        // Pozovi pomoćnu funkciju za svaki predmet
        updateOrCreateStudentSubject(userId, "Matematika", null, dto.getGoalsMath());
        updateOrCreateStudentSubject(userId, "Fizika", null, dto.getGoalsPhi());
        updateOrCreateStudentSubject(userId, "Informatika", null, dto.getGoalsInf());

        return true;
    }

}

// Stara metoda koja više nije potrebna, ali je ostavljam ako je želite zadržati za druge pozive
    /*
    @Override
    @Transactional
    public void updateStudentProfile(Long userId, StudentProfileUpdateDto dto) throws ResourceNotFoundException {
        // ... (stara implementacija)
    }
    */

