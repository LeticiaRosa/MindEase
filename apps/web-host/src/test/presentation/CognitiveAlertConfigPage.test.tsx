import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CognitiveAlertConfigPage from "@/presentation/pages/CognitiveAlertConfigPage";
import { DEFAULT_ALERT_PREFERENCES } from "@/domain/entities/AlertPreferences";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockSavePreferences = vi.fn();
const mockNavigate = vi.fn();

vi.mock("@/presentation/contexts/AlertPreferencesContext", () => ({
  useAlertPreferences: () => ({
    preferences: DEFAULT_ALERT_PREFERENCES,
    savePreferences: mockSavePreferences,
  }),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react-router-dom")>();
  return { ...mod, useNavigate: () => mockNavigate };
});

// Sonner toast mock
vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
}));

// ─── Test helpers ─────────────────────────────────────────────────────────────

function renderPage() {
  return render(
    <MemoryRouter>
      <CognitiveAlertConfigPage />
    </MemoryRouter>,
  );
}

describe("CognitiveAlertConfigPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows trigger selection on the first step", () => {
    renderPage();
    expect(screen.getByText("Quando alertar")).toBeInTheDocument();
    expect(
      screen.getByText(/muito tempo na mesma tarefa/i),
    ).toBeInTheDocument();
  });

  it('"Próximo" button advances to the tone step', () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /próximo/i }));
    expect(screen.getByText("Tom das mensagens")).toBeInTheDocument();
  });

  it("shows validation error when no triggers are selected and user advances", async () => {
    renderPage();
    // Deselect all default triggers
    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((cb) => {
      if ((cb as HTMLInputElement).checked) fireEvent.click(cb);
    });
    fireEvent.click(screen.getByRole("button", { name: /próximo/i }));
    // The next button should stay disabled when no triggers are selected
    // (button has disabled attribute when selectedTriggers.length === 0)
    const nextBtn = screen.getByRole("button", { name: /próximo/i });
    expect(nextBtn).toBeDisabled();
  });

  it("submits and calls savePreferences on the final step", async () => {
    renderPage();
    // Step 1 → 2
    fireEvent.click(screen.getByRole("button", { name: /próximo/i }));
    // Step 2 → 3
    fireEvent.click(screen.getByRole("button", { name: /próximo/i }));
    // Submit
    fireEvent.click(
      screen.getByRole("button", { name: /salvar preferências/i }),
    );
    await waitFor(() => {
      expect(mockSavePreferences).toHaveBeenCalledOnce();
    });
  });
});
