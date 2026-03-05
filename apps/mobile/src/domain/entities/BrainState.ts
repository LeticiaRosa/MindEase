export type BrainStateValue =
  | "focado"
  | "cansado"
  | "sobrecarregado"
  | "ansioso"
  | "disperso";

export type BrainStateColorToken =
  | "success"
  | "secondary"
  | "destructive"
  | "info"
  | "creative";

export interface BrainStateOption {
  value: BrainStateValue;
  label: string;
  emoji: string;
  color: BrainStateColorToken;
  description: string;
}

export const BRAIN_STATE_OPTIONS: BrainStateOption[] = [
  {
    value: "focado",
    label: "Focado",
    emoji: "🎯",
    color: "success",
    description: "Energia e clareza",
  },
  {
    value: "cansado",
    label: "Cansado",
    emoji: "😴",
    color: "secondary",
    description: "Precisando de ritmo lento",
  },
  {
    value: "sobrecarregado",
    label: "Sobrecarregado",
    emoji: "🤯",
    color: "destructive",
    description: "Muita coisa de uma vez",
  },
  {
    value: "ansioso",
    label: "Ansioso",
    emoji: "😰",
    color: "info",
    description: "Difícil de parar os pensamentos",
  },
  {
    value: "disperso",
    label: "Disperso",
    emoji: "🌀",
    color: "creative",
    description: "Difícil de manter o foco",
  },
];

export const BRAIN_STATE_STORAGE_KEY = "mindease:brain-today";
