export interface SessionSummary {
  id: number;
  sessionId: number;
  subject: string;
  date: string;
  durationMinutes: number;
  studentName: string;
  instructorName: string;
  role: "student" | "instructor";
}

export async function getStudentSummaries(): Promise<SessionSummary[]> {
  const res = await fetch("/api/student/summaries");
  return res.json();
}

export async function getInstructorSummaries(): Promise<SessionSummary[]> {
  const res = await fetch("/api/instructor/summaries");
  return res.json();
}
