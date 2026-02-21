import { beforeEach, describe, it, expect, vi } from "vitest";
import { RecordBrainState } from "@/application/useCases/RecordBrainState";
import { BRAIN_STATE_SESSION_KEY } from "@/domain/valueObjects/BrainState";

// Lightweight sessionStorage mock
const sessionStorageStore: Record<string, string> = {};
const sessionStorageMock = {
  getItem: vi.fn((key: string) => sessionStorageStore[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    sessionStorageStore[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete sessionStorageStore[key];
  }),
  clear: vi.fn(() => {
    Object.keys(sessionStorageStore).forEach(
      (k) => delete sessionStorageStore[k],
    );
  }),
};
vi.stubGlobal("sessionStorage", sessionStorageMock);

describe("RecordBrainState", () => {
  beforeEach(() => {
    sessionStorageMock.clear();
    vi.clearAllMocks();
  });

  it("execute writes the brain state to sessionStorage", () => {
    RecordBrainState.execute("ansioso");
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
      BRAIN_STATE_SESSION_KEY,
      "ansioso",
    );
  });

  it("skip writes nothing to sessionStorage", () => {
    RecordBrainState.skip();
    expect(sessionStorageMock.setItem).not.toHaveBeenCalled();
  });

  it("read returns the stored brain state", () => {
    sessionStorageStore[BRAIN_STATE_SESSION_KEY] = "focado";
    expect(RecordBrainState.read()).toBe("focado");
  });

  it("read returns null when no state is stored", () => {
    expect(RecordBrainState.read()).toBeNull();
  });
});
