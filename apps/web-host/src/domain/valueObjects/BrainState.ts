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
  colour: string; // Tailwind bg colour class
}

export const BRAIN_STATE_OPTIONS: BrainStateOption[] = [
  {
    value: "focado",
    label: "Focado",
    emoji: "🟢",
    colour: "bg-green-100 border-green-400 text-green-800",
  },
  {
    value: "cansado",
    label: "Cansado",
    emoji: "🟡",
    colour: "bg-yellow-100 border-yellow-400 text-yellow-800",
  },
  {
    value: "sobrecarregado",
    label: "Sobrecarregado",
    emoji: "🔴",
    colour: "bg-red-100 border-red-400 text-red-800",
  },
  {
    value: "ansioso",
    label: "Ansioso",
    emoji: "🔵",
    colour: "bg-blue-100 border-blue-400 text-blue-800",
  },
  {
    value: "disperso",
    label: "Disperso",
    emoji: "🟣",
    colour: "bg-purple-100 border-purple-400 text-purple-800",
  },
];

export const BRAIN_STATE_SESSION_KEY = "mindease:brain-state";
