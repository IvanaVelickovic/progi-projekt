import api from "../api";

// ===== TIPOVI =====
export interface VideoSession {
  id: number;
  studentName: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  status: "upcoming" | "live" | "completed";
}

export interface InstructorVideoSession {
  id: number;
  students: string[]; // Lista studenata koji su rezervirali termin
  subject: string;
  date: string;
  time: string;
  duration: number;
  status: "upcoming" | "live" | "completed";
  maxParticipants: number; // Maksimalan broj studenata
}

// ===== DOHVAĆANJE STUDENTSKIH VIDEO SESIJA =====
export const getStudentVideoSessions = async (): Promise<VideoSession[]> => {
  try {
    const response = await api.get('/api/student/video-sessions');
    // Validacija odgovora
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    console.warn("Backend nije vratio ispravan format podataka");
    return [];
  } catch (error) {
    console.error("Greška pri dohvaćanju studentskih video sesija:", error);
    return [];
  }
};

// ===== DOHVAĆANJE INSTRUKTORSKIH VIDEO SESIJA =====
export const getInstructorVideoSessions = async (): Promise<InstructorVideoSession[]> => {
  try {
    const response = await api.get('/api/instructor/video-sessions');
    // Validacija odgovora
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    console.warn("Backend nije vratio ispravan format podataka");
    return [];
  } catch (error) {
    console.error("Greška pri dohvaćanju instruktorskih video sesija:", error);
    return [];
  }
};

// ===== DOHVAĆANJE POJEDINAČNE VIDEO SESIJE =====
export const getVideoSessionById = async (id: string) => {
  const response = await api.get(`/api/student/video-session/${id}`);
  const data = response.data;
  
  // Formatiraj datum i vrijeme
  const dateTime = new Date(data.dateTime);
  const date = dateTime.toLocaleDateString('hr-HR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const time = dateTime.toLocaleTimeString('hr-HR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return {
    id: data.id,
    tutorName: data.instructorName,
    subject: data.subject,
    date: date,
    time: time,
    studentName: data.studentName,
  };
};