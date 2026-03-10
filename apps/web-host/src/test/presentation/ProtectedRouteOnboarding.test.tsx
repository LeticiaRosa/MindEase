import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/presentation/components/ProtectedRoute";

let shouldShowOnboarding = true;

vi.mock("auth/auth", () => ({
  useAuth: () => ({ user: { id: "user-1" }, loading: false }),
}));

vi.mock("@/presentation/contexts/OnboardingContext", () => ({
  useOnboarding: () => ({
    isHydrated: true,
    shouldShowOnboarding,
  }),
}));

vi.mock("@/presentation/components/GuidedOnboardingFlow", () => ({
  GuidedOnboardingFlow: () => <div data-testid="guided-onboarding" />,
}));

vi.mock("@/presentation/components/BrainTodayModal", () => ({
  BrainTodayModal: () => <div data-testid="brain-today" />,
}));

describe("ProtectedRoute onboarding gate", () => {
  it("shows guided onboarding and defers brain today modal while onboarding is pending", () => {
    shouldShowOnboarding = true;

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("guided-onboarding")).toBeInTheDocument();
    expect(screen.queryByTestId("brain-today")).not.toBeInTheDocument();
    expect(screen.queryByText("dashboard")).not.toBeInTheDocument();
  });

  it("shows brain today and dashboard when onboarding is completed", () => {
    shouldShowOnboarding = false;

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("guided-onboarding")).not.toBeInTheDocument();
    expect(screen.getByTestId("brain-today")).toBeInTheDocument();
    expect(screen.getByText("dashboard")).toBeInTheDocument();
  });
});
