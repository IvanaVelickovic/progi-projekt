import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../pages/Login.tsx";
import { MemoryRouter } from "react-router-dom";
import api from "../api";
import { vi } from "vitest";
import type { Mock } from "vitest";

vi.mock("../api", () => ({
  default: {
    post: vi.fn(),
  },
}));

it("TC1 – uspješna prijava s ispravnim podacima", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(
    <MemoryRouter>
      <Login onSubmit={onSubmit} />
    </MemoryRouter>,
  );

  await user.type(
    screen.getByPlaceholderText(/e-mail adresa/i),
    "user@test.com",
  );
  await user.type(screen.getByPlaceholderText(/lozinka/i), "Password123");
  await user.click(screen.getByRole("button", { name: /prijava/i }));

  expect(onSubmit).toHaveBeenCalledWith("user@test.com", "Password123");
});

it("TC2 – prazna polja (HTML validacija)", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(
    <MemoryRouter>
      <Login onSubmit={onSubmit} />
    </MemoryRouter>,
  );

  await user.click(screen.getByRole("button", { name: /prijava/i }));

  expect(onSubmit).not.toHaveBeenCalled();
});

it("TC3 – loading state tijekom prijave", async () => {
  const user = userEvent.setup();

  const postMock = api.post as unknown as any;
  postMock.mockImplementation(
    () =>
      new Promise((resolve) =>
        setTimeout(
          () => resolve({ status: 200, data: { token: "token" } }),
          50,
        ),
      ),
  );

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

  await user.type(
    screen.getByPlaceholderText(/e-mail adresa/i),
    "user@test.com",
  );
  await user.type(screen.getByPlaceholderText(/lozinka/i), "Password123");

  expect(screen.getByRole("button", { name: /prijava/i })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /prijava/i }));

  expect(
    screen.getByRole("button", { name: /učitavanje/i }),
  ).toBeInTheDocument();

  await new Promise((r) => setTimeout(r, 60));

  expect(screen.getByRole("button", { name: /prijava/i })).toBeInTheDocument();
});

it("TC4 – backend error 401", async () => {
  const user = userEvent.setup();

  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  const postMock = api.post as unknown as Mock;
  postMock.mockRejectedValue({
    response: { status: 401 },
  });

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

  await user.type(
    screen.getByPlaceholderText(/e-mail adresa/i),
    "user@test.com",
  );
  await user.type(screen.getByPlaceholderText(/lozinka/i), "Password123");
  await user.click(screen.getByRole("button", { name: /prijava/i }));

  expect(alertMock).toHaveBeenCalled();

  alertMock.mockRestore();
});

it("TC5 – backend endpoint ne postoji (404)", async () => {
  const user = userEvent.setup();

  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  const postMock = api.post as unknown as any;
  postMock.mockRejectedValue({
    response: { status: 404 },
  });

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );

  await user.type(
    screen.getByPlaceholderText(/e-mail adresa/i),
    "user@test.com",
  );
  await user.type(screen.getByPlaceholderText(/lozinka/i), "Password123");
  await user.click(screen.getByRole("button", { name: /prijava/i }));

  expect(alertMock).toHaveBeenCalled();

  alertMock.mockRestore();
});
