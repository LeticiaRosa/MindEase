import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@repo/ui";
import { useActivitySignals } from "@/presentation/contexts/ActivitySignalsContext";
import { useAlertPreferences } from "@/presentation/contexts/AlertPreferencesContext";
import { useBrainToday } from "@/presentation/contexts/BrainTodayContext";
import { evaluateAlerts } from "@/application/services/AlertEngineService";
import type { AlertPayload } from "@/domain/entities/AlertPayload";
import type { AlertTrigger } from "@/domain/valueObjects/AlertTypes";

const TICK_INTERVAL_MS = 60_000; // 1 minute
const COOL_DOWN_MS = 15 * 60_000; // 15 minutes per trigger

interface AlertEngineState {
  bannerActive: boolean;
  bannerMessage: string;
  modalOpen: boolean;
  modalMessage: string;
  currentPayload: AlertPayload | null;
}

interface UseAlertEngineOptions {
  /** Injectable clock function for deterministic testing. Defaults to Date.now. */
  clockFn?: () => number;
}

export function useAlertEngine(options: UseAlertEngineOptions = {}) {
  const { clockFn = Date.now } = options;
  const { signals } = useActivitySignals();
  const { preferences } = useAlertPreferences();
  const { brainState } = useBrainToday();
  const { toast } = useToast();

  const lastFiredAt = useRef<Partial<Record<AlertTrigger, number>>>({});
  const [state, setState] = useState<AlertEngineState>({
    bannerActive: false,
    bannerMessage: "",
    modalOpen: false,
    modalMessage: "",
    currentPayload: null,
  });

  const dispatch = useCallback(
    (payload: AlertPayload) => {
      lastFiredAt.current[payload.trigger] = clockFn();

      switch (payload.channel) {
        case "toast":
          toast.success(payload.message, {
            duration: 6000,
            position: "bottom-right",
          });
          break;
        case "icon":
          setState((prev) => ({
            ...prev,
            bannerActive: true,
            bannerMessage: payload.message,
            currentPayload: payload,
          }));
          // Auto-clear after 30 s
          setTimeout(() => {
            setState((prev) => ({ ...prev, bannerActive: false }));
          }, 30_000);
          break;
        case "modal":
          setState((prev) => ({
            ...prev,
            modalOpen: true,
            modalMessage: payload.message,
            currentPayload: payload,
          }));
          break;
      }
    },
    [clockFn, toast],
  );

  useEffect(() => {
    const tick = () => {
      const payload = evaluateAlerts(
        signals,
        preferences,
        brainState,
        lastFiredAt.current,
        COOL_DOWN_MS,
        clockFn,
      );
      if (payload) dispatch(payload);
    };

    const id = setInterval(tick, TICK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [signals, preferences, brainState, dispatch, clockFn]);

  const dismissBanner = useCallback(() => {
    setState((prev) => ({ ...prev, bannerActive: false }));
  }, []);

  const dismissModal = useCallback(() => {
    setState((prev) => ({ ...prev, modalOpen: false }));
  }, []);

  return {
    bannerActive: state.bannerActive,
    bannerMessage: state.bannerMessage,
    modalOpen: state.modalOpen,
    modalMessage: state.modalMessage,
    dismissBanner,
    dismissModal,
  };
}
