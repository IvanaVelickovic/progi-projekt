import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Search from "../pages/Search";
import api from "../api";

vi.mock("../api", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("../components/StudentSchedule", () => ({
  default: ({ appointments }: any) => (
    <div data-testid="schedule">{appointments.length}</div>
  ),
}));

describe("Search komponenta", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("TC-1: Rubni uvjet – radijus lokacije 0 (rubni uvjet)", async () => {
    (api.get as any).mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>,
    );

    const submitBtn = screen.getByText("Primijeni filtere");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });

    const callArgs = (api.get as any).mock.calls[0][1].params;
    expect(callArgs.lat).toBeUndefined();
    expect(callArgs.lng).toBeUndefined();
  });

  it("TC-2: Greška API-ja (izazivanje pogreške)", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (api.get as any).mockRejectedValueOnce(new Error("API error"));

    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
