import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../api";
import {
  getStudentVideoSessions,
  getInstructorVideoSessions,
  getVideoSessionById,
} from "../services/sessionService";


vi.mock("../api", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("sessionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

 
  it("TC1 – redovni slučaj: dohvaćanje studentskih video sesija", async () => {
    const mockData = [
      {
        reservationId: 1,
        instructorName: "Marko",
        subject: "Matematika",
        date: "2025-01-01",
        time: "10:00",
        durationMin: 60,
        status: "pending",
      },
    ];

    (api.get as any).mockResolvedValueOnce({ data: mockData });

    const result = await getStudentVideoSessions();

    expect(api.get).toHaveBeenCalledWith("/api/student/video-sessions");
    expect(result).toEqual(mockData);
  });

  it("TC2 – rubni uvjet: backend vraća krivi format → prazan array", async () => {
    (api.get as any).mockResolvedValueOnce({ data: {} });

    const result = await getStudentVideoSessions();

    expect(result).toEqual([]);
  });

  it("TC3 – rubni uvjet: backend error → prazan array", async () => {
    (api.get as any).mockRejectedValueOnce(new Error("Network error"));

    const result = await getStudentVideoSessions();

    expect(result).toEqual([]);
  });

 

  it("TC4 – redovni slučaj: dohvaćanje instruktorskih video sesija", async () => {
    const mockData = [
      {
        reservationId: 2,
        studentNames: ["Ana", "Ivan"],
        subject: "Fizika",
        date: "2025-01-02",
        time: "12:00",
        durationMin: 45,
        status: "live",
      },
    ];

    (api.get as any).mockResolvedValueOnce({ data: mockData });

    const result = await getInstructorVideoSessions();

    expect(api.get).toHaveBeenCalledWith("/api/instructor/video-sessions");
    expect(result).toEqual(mockData);
  });


  it("TC5 – formatira datum i vrijeme iz dateTime polja", async () => {
    (api.get as any).mockResolvedValueOnce({
      data: {
        reservationId: 3,
        instructorName: "Petra",
        subject: "Kemija",
        studentName: "Luka",
        dateTime: "2025-01-10T14:30:00Z",
      },
    });

    const result = await getVideoSessionById("3", "2");

    expect(api.get).toHaveBeenCalledWith(
      "/api/student/video-sessions/3"
    );

    expect(result).toEqual({
      reservationId: 3,
      participationId: 2,
      tutorName: "Petra",
      subject: "Kemija",
      studentName: "Luka",
      date: expect.any(String),
      time: expect.any(String),
    });
  });
});
