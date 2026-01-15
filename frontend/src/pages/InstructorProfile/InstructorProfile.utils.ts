import api from "../../api";

export interface InstructorSummary{
    photo: string;
    firstName: string;
    lastName: string;
    rating: number;
    reviewsCount: number;
    instructorId: string;
}

export function getEmptyInstructorSummary(): InstructorSummary {
    return {
        photo: "",
        firstName: "",
        lastName: "",
        rating: 0,
        reviewsCount: 0,
        instructorId: "",
  }
}

export async function fetchInstructorSummary(instructorId: string | undefined): Promise<InstructorSummary>{
    const response = await api.get(`/api/instructors/${instructorId}/summary`);
    const data = response.data;
    return data;
}



export interface InstructorData {
  introVideoUrl: string;
  expertise: string;
  price: number;
  lat: number;
  lng: number;
  biography: string;
}

export function getEmptyInstructorObject(): InstructorData {
    return {
        introVideoUrl: "",
        expertise: "",
        price: 0,
        lat: 0, //Zagreb: 45.80
        lng: 0, //Zagreb: 15.97
        biography: "",
  }
}

export async function fetchInstructorData(instructorId: string | undefined): Promise<InstructorData>{
    const response = await api.get(`/api/instructors/${instructorId}`);
    const data = response.data;
    return data;
}