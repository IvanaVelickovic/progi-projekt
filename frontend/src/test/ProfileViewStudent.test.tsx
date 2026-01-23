import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProfileViewStudent from "../pages/ProfileViewStudent";
import api from "../api";

vi.mock("../api", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("ProfileViewStudent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC1 – redovni slučaj: učitavanje podataka studenta", async () => {
    (api.get as any).mockResolvedValueOnce({
      data: {
        first_name: "Ivan",
        last_name: "Ivić",
        grade: "Srednja škola",
        knowledge_data_math: "osnovno",
        knowledge_data_phi: "srednje",
        knowledge_data_inf: "napredno",
        learning_goals_math: "poboljšati algebru",
        learning_goals_phi: "razumjeti fiziku",
        learning_goals_inf: "programiranje",
      },
    });

    render(
      <MemoryRouter initialEntries={["/profile/student/5"]}>
        <Routes>
          <Route path="/profile/student/:id" element={<ProfileViewStudent />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Ivan Ivić")).toBeInTheDocument();
    });

    expect(screen.getByText("Srednja škola")).toBeInTheDocument();
    expect(screen.getByText("osnovno")).toBeInTheDocument();
    expect(screen.getByText("poboljšati algebru")).toBeInTheDocument();
  });

  it("TC2 – rubni uvjet: backend vraća nepotpune podatke (null)", async () => {
    (api.get as any).mockResolvedValueOnce({
      data: {
        first_name: "Ana",
        last_name: "Anić",
        grade: null,
        knowledge_data_math: null,
        knowledge_data_phi: "osnovno",
        knowledge_data_inf: null,
        learning_goals_math: null,
        learning_goals_phi: "poboljšati fiziku",
        learning_goals_inf: null,
      },
    });

    render(
      <MemoryRouter initialEntries={["/profile/student/10"]}>
        <Routes>
          <Route path="/profile/student/:id" element={<ProfileViewStudent />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Ana Anić")).toBeInTheDocument();
    });

    expect(screen.getByText("osnovno")).toBeInTheDocument(); //komponenta se ne smije rušiti
  });
});
