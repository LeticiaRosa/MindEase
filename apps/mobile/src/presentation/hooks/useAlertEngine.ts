import { useState, useEffect, useRef } from "react";

const DEFAULT_INTERVAL_MINUTES = 25;

interface AlertEngineState {
  bannerActive: boolean;
  bannerMessage: string;
  dismissBanner: () => void;
}

const ALERT_MESSAGES = [
  "Hora de uma pequena pausa. Respire fundo por 30 segundos.",
  "Você está trabalhando há um tempinho. Que tal levantar e se alongar?",
  "Lembrete gentil: hidrate-se! Beba um copo d'água.",
  "Pausa rápida: olhe para longe por 20 segundos para descansar os olhos.",
];

function getRandomMessage(): string {
  const index = Math.floor(Math.random() * ALERT_MESSAGES.length);
  return ALERT_MESSAGES[index]!;
}

export function useAlertEngine(
  intervalMinutes = DEFAULT_INTERVAL_MINUTES,
): AlertEngineState {
  const [bannerActive, setBannerActive] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(
      () => {
        setBannerMessage(getRandomMessage());
        setBannerActive(true);
      },
      intervalMinutes * 60 * 1000,
    );

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [intervalMinutes]);

  function dismissBanner() {
    setBannerActive(false);
  }

  return { bannerActive, bannerMessage, dismissBanner };
}
