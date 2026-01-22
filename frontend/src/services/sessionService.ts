/* ================= SESSION SERVICE ================= */
// Servis za dohvaćanje video sesija sa backenda

import api from "../api";


// ===== TIPOVI =====
export interface VideoSession {
  reservationId: number;
  InstructorName: string;
  subject: string;
  date: string;
  time: string;
  durationMin: number;
  status: "pending" | "live" | "completed";
}

export interface InstructorVideoSession {
  reservationId: number;
  studentNames: string[]; // Lista studenata koji su rezervirali termin
  subject: string;
  date: string;
  time: string;
  durationMin: number;
  status: "pending" | "live" | "completed";
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
}

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
export const getVideoSessionById = async (reservationId: string) => {
  
 
  const response = await api.get(`/api/student/video-sessions/${reservationId}`);
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
    reservationId: data.reservationId,
    tutorName: data.instructorName,
    subject: data.subject,
    date: date,
    time: time,
    studentName: data.studentName,
  };

};

// ===== OZNAČAVANJE SESIJE KAO ZAVRŠENE =====
export const completeVideoSession = async (reservationId: string, duration: number) => {
  
  try {
    const response = await api.post(`/api/student/video-sessions/${reservationId}/complete`, {
      duration,
    });
    return response.data;
  } catch (error) {
    console.error("Greška pri završavanju sesije:", error);
    throw error;
  }

};

// ===== ZAVRŠETAK VIDEO SESIJE I DOHVAĆANJE REDIRECT URL-a =====
export const endVideoSession = async (reservationId: string) => {
  try {
    const response = await api.post(`/api/video-sessions/${reservationId}/end`);
    return response.data; // { redirect_to: "/payment/12" } ili { redirect_to: "/dashboard" }
  } catch (error) {
    console.error("Greška pri završavanju sesije:", error);
    throw error;
  }

};

// ===== DOHVAĆANJE JAAS JWT TOKENA =====
export const getJaasToken = async (reservationId: string) => {
  

  
  try {
    const response = await api.get(`/api/lessons/${reservationId}/jaas-token/`);
    return response.data; 
  } catch (error) {
    console.error("Greška pri dohvaćanju JaaS tokena:", error);
    throw error;
  }

};

// ===== DOHVAĆANJE SESSION SUMMARIES (STUDENT) =====
export const getStudentSessionSummaries = async () => {
  
  try {
    const response = await api.get('/api/student/session-summaries');
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    console.warn("Backend nije vratio ispravan format podataka");
    return [];
  } catch (error) {
    console.error("Greška pri dohvaćanju session summaries:", error);
    return [];
  }

};

// ===== DOHVAĆANJE SESSION SUMMARIES (INSTRUCTOR) =====
export const getInstructorSessionSummaries = async () => {
 
  try {
    const response = await api.get('/api/instructor/session-summaries');
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    console.warn("Backend nije vratio ispravan format podataka");
    return [];
  } catch (error) {
    console.error("Greška pri dohvaćanju session summaries:", error);
    return [];
  }

};