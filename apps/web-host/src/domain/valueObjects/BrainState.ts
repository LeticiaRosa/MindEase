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
  darkColour: string; // Tailwind bg colour class for dark mode
}

export const BRAIN_STATE_OPTIONS: BrainStateOption[] = [
  {
    value: "focado",
    label: "Focado",
    emoji: "",
    colour: "bg-green-50 border-green-200 text-green-800",
    darkColour: "bg-green-900/20 border-green-700/50 text-green-300",
  },
  {
    value: "cansado",
    label: "Cansado",
    emoji: "",
    colour: "bg-yellow-50 border-yellow-200 text-yellow-800",
    darkColour: "bg-yellow-900/20 border-yellow-700/50 text-yellow-300",
  },
  {
    value: "sobrecarregado",
    label: "Sobrecarregado",
    emoji: "",
    colour: "bg-red-50 border-red-200 text-red-800",
    darkColour: "bg-red-900/20 border-red-700/50 text-red-300",
  },
  {
    value: "ansioso",
    label: "Ansioso",
    emoji: "",
    colour: "bg-blue-50 border-blue-200 text-blue-800",
    darkColour: "bg-blue-900/20 border-blue-700/50 text-blue-300",
  },
  {
    value: "disperso",
    label: "Disperso",
    emoji: "",
    colour: "bg-purple-50 border-purple-200 text-purple-800",
    darkColour: "bg-purple-900/20 border-purple-700/50 text-purple-300",
  },
];

export const BRAIN_STATE_SESSION_KEY = "mindease:brain-state";
