/* ================= MOCK DATA ZA TESTIRANJE SESSION SISTEMA ================= */

// ===== TIPOVI =====
export interface MockVideoSession {
  id: number;
  instructorName: string;
  subject: string;
  scheduledTime: string;
  duration: number;
  status: string;
  meetingUrl: string;
}

export interface MockInstructorVideoSession {
  id: number;
  studentName: string;
  subject: string;
  scheduledTime: string;
  duration: number;
  status: string;
  meetingUrl: string;
}

export interface MockSessionSummary {
  id: number;
  instructorName: string;
  subject: string;
  date: string;
  duration: number;
  status: "pending_review" | "completed";
}

export interface MockInstructorSessionSummary {
  id: number;
  studentName: string;
  subject: string;
  date: string;
  duration: number;
  status: "pending_review" | "completed";
}

export interface MockSessionDetail {
  id: number;
  instructorName: string;
  studentName: string;
  subject: string;
  scheduledTime: string;
  duration: number;
  status: string;
}

// ===== MOCK VIDEO SESSIONS ZA STUDENTA =====
export const mockStudentVideoSessions: MockVideoSession[] = [
  {
    id: 1,
    instructorName: "Dr. Ana Marić",
    subject: "Matematika - Integrali",
    scheduledTime: "2026-01-19T15:00:00",
    duration: 60,
    status: "scheduled",
    meetingUrl: "https://meet.jit.si/STEMTutoring-Session-1"
  },
  {
    id: 2,
    instructorName: "Prof. Marko Horvat",
    subject: "Fizika - Termodinamika",
    scheduledTime: "2026-01-19T17:30:00",
    duration: 45,
    status: "scheduled",
    meetingUrl: "https://meet.jit.si/STEMTutoring-Session-2"
  },
  {
    id: 3,
    instructorName: "Dr. Petra Kovač",
    subject: "Kemija - Organske reakcije",
    scheduledTime: "2026-01-20T14:00:00",
    duration: 60,
    status: "scheduled",
    meetingUrl: "https://meet.jit.si/STEMTutoring-Session-3"
  }
];

// ===== MOCK VIDEO SESSIONS ZA INSTRUKTORA =====
export const mockInstructorVideoSessions: MockInstructorVideoSession[] = [
  {
    id: 4,
    studentName: "Ivan Novak",
    subject: "Matematika - Derivacije",
    scheduledTime: "2026-01-19T16:00:00",
    duration: 60,
    status: "scheduled",
    meetingUrl: "https://meet.jit.si/STEMTutoring-Session-4"
  },
  {
    id: 5,
    studentName: "Maja Tomić",
    subject: "Fizika - Kinematika",
    scheduledTime: "2026-01-19T18:00:00",
    duration: 45,
    status: "scheduled",
    meetingUrl: "https://meet.jit.si/STEMTutoring-Session-5"
  },
  {
    id: 6,
    studentName: "Luka Babić",
    subject: "Matematika - Trigonometrija",
    scheduledTime: "2026-01-20T15:30:00",
    duration: 60,
    status: "scheduled",
    meetingUrl: "https://meet.jit.si/STEMTutoring-Session-6"
  }
];

// ===== MOCK SESSION SUMMARIES ZA STUDENTA =====
export const mockStudentSessionSummaries: MockSessionSummary[] = [
  {
    id: 101,
    instructorName: "Dr. Ana Marić",
    subject: "Matematika - Derivacije",
    date: "15. siječnja 2026",
    duration: 58,
    status: "completed"
  },
  {
    id: 102,
    instructorName: "Prof. Marko Horvat",
    subject: "Fizika - Optika",
    date: "14. siječnja 2026",
    duration: 45,
    status: "pending_review"
  },
  {
    id: 103,
    instructorName: "Dr. Petra Kovač",
    subject: "Kemija - Anorganske kiseline",
    date: "12. siječnja 2026",
    duration: 62,
    status: "completed"
  },
  {
    id: 104,
    instructorName: "Dr. Ana Marić",
    subject: "Matematika - Integrali",
    date: "10. siječnja 2026",
    duration: 53,
    status: "pending_review"
  }
];

// ===== MOCK SESSION SUMMARIES ZA INSTRUKTORA =====
export const mockInstructorSessionSummaries: MockInstructorSessionSummary[] = [
  {
    id: 201,
    studentName: "Ivan Novak",
    subject: "Matematika - Linearna algebra",
    date: "16. siječnja 2026",
    duration: 61,
    status: "completed"
  },
  {
    id: 202,
    studentName: "Maja Tomić",
    subject: "Fizika - Elektromagnetizam",
    date: "15. siječnja 2026",
    duration: 47,
    status: "pending_review"
  },
  {
    id: 203,
    studentName: "Luka Babić",
    subject: "Matematika - Kompleksni brojevi",
    date: "13. siječnja 2026",
    duration: 59,
    status: "completed"
  },
  {
    id: 204,
    studentName: "Ana Jurić",
    subject: "Matematika - Vektori",
    date: "11. siječnja 2026",
    duration: 44,
    status: "pending_review"
  },
  {
    id: 205,
    studentName: "Petar Šimić",
    subject: "Fizika - Mehanika",
    date: "9. siječnja 2026",
    duration: 56,
    status: "completed"
  }
];

// ===== MOCK SESSION DETAILS (za VideoSession stranicu) =====
export const mockSessionDetails = {
  '1': {
    id: 1,
    instructorName: "Dr. Ana Marić",
    studentName: "Trenutni Student",
    subject: "Matematika - Integrali",
    scheduledTime: "2026-01-19T15:00:00",
    duration: 60,
    status: "scheduled"
  },
  '2': {
    id: 2,
    instructorName: "Prof. Marko Horvat",
    studentName: "Trenutni Student",
    subject: "Fizika - Termodinamika",
    scheduledTime: "2026-01-19T17:30:00",
    duration: 45,
    status: "scheduled"
  },
  '3': {
    id: 3,
    instructorName: "Dr. Petra Kovač",
    studentName: "Trenutni Student",
    subject: "Kemija - Organske reakcije",
    scheduledTime: "2026-01-20T14:00:00",
    duration: 60,
    status: "scheduled"
  },
  '4': {
    id: 4,
    instructorName: "Trenutni Instruktor",
    studentName: "Ivan Novak",
    subject: "Matematika - Derivacije",
    scheduledTime: "2026-01-19T16:00:00",
    duration: 60,
    status: "scheduled"
  },
  '5': {
    id: 5,
    instructorName: "Trenutni Instruktor",
    studentName: "Maja Tomić",
    subject: "Fizika - Kinematika",
    scheduledTime: "2026-01-19T18:00:00",
    duration: 45,
    status: "scheduled"
  },
  '6': {
    id: 6,
    instructorName: "Trenutni Instruktor",
    studentName: "Luka Babić",
    subject: "Matematika - Trigonometrija",
    scheduledTime: "2026-01-20T15:30:00",
    duration: 60,
    status: "scheduled"
  }
} as Record<string, MockSessionDetail>;