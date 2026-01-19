import api from "../../api";

export interface InstructorSummary{
    photo: string;
    firstName: string;
    lastName: string;
    averageRating: number;
    reviewCount: number;
    id: string;
}

export function getEmptyInstructorSummary(): InstructorSummary {
    return {
        photo: "",
        firstName: "",
        lastName: "",
        averageRating: 0,
        reviewCount: 0,
        id: "",
  }
}

export async function fetchInstructorSummary(instructorId: string | undefined): Promise<InstructorSummary>{
    const response = await api.get(`/api/instructors/${instructorId}/summary`);
    const data = response.data;
    return data;
}



export interface InstructorData {
  introVideoUrl: string;
  expertiseAreas: string;
  hourlyRate: number;
  latitude: number | null;
  longitude: number | null;
  biography: string;
}

export function getEmptyInstructorObject(): InstructorData {
    return {
        introVideoUrl: "",
        expertiseAreas: "",
        hourlyRate: 0,
        latitude: null, //Zagreb: 45.80
        longitude:  null, //Zagreb: 15.97
        biography: "",
  }
}

export async function fetchInstructorData(instructorId: string | undefined): Promise<InstructorData>{
    const response = await api.get(`/api/instructors/${instructorId}`);
    const data = response.data;
    return data;
}