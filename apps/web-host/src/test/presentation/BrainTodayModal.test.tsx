import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrainTodayModal } from "@/presentation/components/BrainTodayModal";
import type { BrainStateValue } from "@/domain/valueObjects/BrainState";
import { BRAIN_STATE_SESSION_KEY } from "@/domain/valueObjects/BrainState";
import { CalibrateAlertPreferencesFromBrainState } from "@/application/useCases/CalibrateAlertPreferencesFromBrainState";

// Mock the BrainTodayContext
const mockRecordState = vi.fn();
const mockSkip = vi.fn();
const mockSavePreferences = vi.fn();

vi.mock("@/presentation/contexts/BrainTodayContext", () => ({
  useBrainToday: () => ({
    brainState: null,
    recordState: mockRecordState,
    skip: mockSkip,
  }),
  hasBrainStateForSession: () => false,
}));

vi.mock("@/presentation/contexts/AlertPreferencesContext", () => ({
  useAlertPreferences: () => ({
    preferences: null,
    savePreferences: mockSavePreferences,
  }),
}));

describe("BrainTodayModal", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("renders all five cognitive state options", () => {
    render(<BrainTodayModal />);
    expect(screen.getByRole("button", { name: /focado/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cansado/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sobrecarregado/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ansioso/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /disperso/i }),
    ).toBeInTheDocument();
  });

  it("calls recordState when a brain state is selected", () => {
    render(<BrainTodayModal />);
    fireEvent.click(screen.getByRole("button", { name: /focado/i }));
    expect(mockRecordState).toHaveBeenCalledWith(
      "focado" satisfies BrainStateValue,
    );
  });

  it("applies calibrated alert preferences when a brain state is selected", () => {
    render(<BrainTodayModal />);
    fireEvent.click(screen.getByRole("button", { name: /ansioso/i }));

    expect(mockSavePreferences).toHaveBeenCalledWith(
      CalibrateAlertPreferencesFromBrainState.execute(
        "ansioso" satisfies BrainStateValue,
      ),
    );
  });

  it('calls skip when "Pular por hoje" is activated', () => {
    render(<BrainTodayModal />);
    fireEvent.click(screen.getByRole("button", { name: /pular por hoje/i }));
    expect(mockSkip).toHaveBeenCalled();
    expect(mockRecordState).not.toHaveBeenCalled();
    expect(mockSavePreferences).not.toHaveBeenCalled();
  });

  it("does not render when brain state is already set in sessionStorage", () => {
    sessionStorage.setItem(BRAIN_STATE_SESSION_KEY, "focado");
    render(<BrainTodayModal />);
    expect(
      screen.queryByText("Como seu cérebro está hoje?"),
    ).not.toBeInTheDocument();
  });
});
