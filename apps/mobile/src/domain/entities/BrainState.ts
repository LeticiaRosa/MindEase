export type BrainStateValue =
  | "focado"
  | "cansado"
  | "sobrecarregado"
  | "ansioso"
  | "disperso";

export interface BrainStateOption {
  value: BrainStateValue;
  label: string;
  emoji: string;
  color: string;
  description: string;
}

export const BRAIN_STATE_OPTIONS: BrainStateOption[] = [
  {
    value: "focado",
    label: "Focado",
    emoji: "🎯",
    color: "#22c55e",
    description: "Energia e clareza",
  },
  {
    value: "cansado",
    label: "Cansado",
    emoji: "😴",
    color: "#eab308",
    description: "Precisando de ritmo lento",
  },
  {
    value: "sobrecarregado",
    label: "Sobrecarregado",
    emoji: "🤯",
    color: "#ef4444",
    description: "Muita coisa de uma vez",
  },
  {
    value: "ansioso",
    label: "Ansioso",
    emoji: "😰",
    color: "#3b82f6",
    description: "Difícil de parar os pensamentos",
  },
  {
    value: "disperso",
    label: "Disperso",
    emoji: "🌀",
    color: "#a855f7",
    description: "Difícil de manter o foco",
  },
];

export const BRAIN_STATE_STORAGE_KEY = "mindease:brain-today";
