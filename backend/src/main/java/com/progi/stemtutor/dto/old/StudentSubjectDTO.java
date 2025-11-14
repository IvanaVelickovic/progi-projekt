//package com.progi.stemtutor.dto.old;
//
//import com.progi.stemtutor.model.StudentSubject;
//
//public record StudentSubjectDTO(
//        Long subjectId,
//        String subjectName,
//        String knowledgeLevel,
//        String learningGoals
//) {
//    public static StudentSubjectDTO fromEntity(StudentSubject ss) {
//        return new StudentSubjectDTO(
//                ss.getSubject().getId(),
//                ss.getSubject().getSubjectName(),
//                ss.getKnowledgeLevel(),
//                ss.getLearningGoals()
//        );
//    }
//}
