import api from "../api";

export interface SessionSummary {
  summaryId: number;
  reservationId: number;
  subject: string;
  date: string;
  durationMin: number;

  instructorName: string;
  studentNames: string[];

  role: string;
}

export async function getStudentSummaries(): Promise<SessionSummary[]> {
  const res = await api.get("/api/student/summaries");
  return res.data;
}

export async function getInstructorSummaries(): Promise<SessionSummary[]> {
  const res = await api.get("/api/instructor/summaries");
  return res.data;
}