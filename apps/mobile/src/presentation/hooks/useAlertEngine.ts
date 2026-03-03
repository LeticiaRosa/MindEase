import { useState, useEffect, useRef, useCallback } from "react";
import { useAlertPreferences } from "@/presentation/contexts/AlertPreferencesContext";
import { useActivitySignals } from "@/presentation/contexts/ActivitySignalsContext";
import { useBrainToday } from "@/presentation/contexts/BrainTodayContext";
import { evaluateAlerts } from "@/application/services/AlertEngineService";
import type { AlertPayload } from "@/domain/entities/AlertPayload";
import type { AlertTrigger } from "@/domain/valueObjects/AlertTypes";

const DEFAULT_INTERVAL_MS = 60_000; // check every minute

interface AlertEngineState {
  bannerActive: boolean;
  bannerMessage: string;
  modalPayload: AlertPayload | null;
  dismissBanner: () => void;
  dismissModal: () => void;
}

export function useAlertEngine(): AlertEngineState {
  const { preferences } = useAlertPreferences();
  const { signals } = useActivitySignals();
  const { brainState } = useBrainToday();
  const [bannerActive, setBannerActive] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [modalPayload, setModalPayload] = useState<AlertPayload | null>(null);
  const cooldownMapRef = useRef<Partial<Record<AlertTrigger, number>>>({});

  const evaluate = useCallback(() => {
    if (!preferences || !signals) return;

    const payload = evaluateAlerts(
      signals,
      preferences,
      brainState ?? null,
      cooldownMapRef.current,
    );

    if (payload) {
      if (payload.channel === "modal") {
        setModalPayload(payload);
      } else {
        setBannerMessage(payload.message);
        setBannerActive(true);
      }
      cooldownMapRef.current[payload.trigger] = Date.now();
    }
  }, [preferences, signals, brainState]);

  useEffect(() => {
    const id = setInterval(evaluate, DEFAULT_INTERVAL_MS);
    return () => clearInterval(id);
  }, [evaluate]);

  const dismissBanner = useCallback(() => setBannerActive(false), []);
  const dismissModal = useCallback(() => setModalPayload(null), []);

  return {
    bannerActive,
    bannerMessage,
    modalPayload,
    dismissBanner,
    dismissModal,
  };
}
