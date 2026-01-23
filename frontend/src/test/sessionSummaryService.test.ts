import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../api";
import {
  getStudentSummaries,
  getInstructorSummaries,
  type SessionSummary,
} from "../services/sessionSummaryService";

/* =========================================================
   MOCK API
   ========================================================= */

vi.mock("../api", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("sessionSummaryService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* =========================================================
     getStudentSummaries
     ========================================================= */

  it("TC1 – redovni slučaj: dohvaćanje sažetaka za studenta", async () => {
    const mockData: SessionSummary[] = [
      {
        summaryId: 1,
        reservationId: 10,
        subject: "Matematika",
        date: "2025-01-05",
        durationMin: 60,
        instructorName: "Marko",
        studentNames: ["Ivan"],
        role: "student",
      },
    ];

    (api.get as any).mockResolvedValueOnce({ data: mockData });

    const result = await getStudentSummaries();

    expect(api.get).toHaveBeenCalledWith("/api/student/summaries");
    expect(result).toEqual(mockData);
  });

  it("TC2 – rubni uvjet: backend vraća krivi format → prazan array", async () => {
    (api.get as any).mockResolvedValueOnce({ data: {} });

    const result = await getStudentSummaries();

    expect(result).toEqual([]);
  });

  it("TC3 – rubni uvjet: backend error → prazan array", async () => {
    (api.get as any).mockRejectedValueOnce(new Error("Network error"));

    const result = await getStudentSummaries();

    expect(result).toEqual([]);
  });

  /* =========================================================
     getInstructorSummaries
     ========================================================= */

  it("TC4 – redovni slučaj: dohvaćanje sažetaka za instruktora", async () => {
    const mockData: SessionSummary[] = [
      {
        summaryId: 2,
        reservationId: 20,
        subject: "Fizika",
        date: "2025-01-07",
        durationMin: 45,
        instructorName: "Petra",
        studentNames: ["Ana", "Luka"],
        role: "instructor",
      },
    ];

    (api.get as any).mockResolvedValueOnce({ data: mockData });

    const result = await getInstructorSummaries();

    expect(api.get).toHaveBeenCalledWith("/api/instructor/summaries");
    expect(result).toEqual(mockData);
  });

  it("TC5 – rubni uvjet: backend vraća null → prazan array", async () => {
    (api.get as any).mockResolvedValueOnce({ data: null });

    const result = await getInstructorSummaries();

    expect(result).toEqual([]);
  });

  it("TC6 – rubni uvjet: backend error → prazan array", async () => {
    (api.get as any).mockRejectedValueOnce(new Error("Network error"));

    const result = await getInstructorSummaries();

    expect(result).toEqual([]);
  });
});
