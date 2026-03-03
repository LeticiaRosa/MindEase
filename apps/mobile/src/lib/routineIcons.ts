import {
  NotebookPen,
  BriefcaseBusiness,
  GraduationCap,
  BookOpen,
  Code,
  Dumbbell,
  Music,
  Palette,
  HeartPulse,
  Home,
  Coffee,
  Lightbulb,
  type LucideIcon,
} from "lucide-react-native";

// ─── Icon registry (mirrors web-host RoutineIcon) ─────────────────────────────

export const ROUTINE_ICONS: Record<string, LucideIcon> = {
  "notebook-pen": NotebookPen,
  "briefcase-business": BriefcaseBusiness,
  "graduation-cap": GraduationCap,
  "book-open": BookOpen,
  code: Code,
  dumbbell: Dumbbell,
  music: Music,
  palette: Palette,
  "heart-pulse": HeartPulse,
  home: Home,
  coffee: Coffee,
  lightbulb: Lightbulb,
} as const;

export const DEFAULT_ROUTINE_ICON = "notebook-pen";

export const ROUTINE_ICON_LABELS: Record<string, string> = {
  "notebook-pen": "Caderno",
  "briefcase-business": "Trabalho",
  "graduation-cap": "Educação",
  "book-open": "Leitura",
  code: "Programação",
  dumbbell: "Exercício",
  music: "Música",
  palette: "Arte",
  "heart-pulse": "Saúde",
  home: "Casa",
  coffee: "Café",
  lightbulb: "Ideia",
};

export type RoutineIconName = keyof typeof ROUTINE_ICONS;

export const ROUTINE_ICON_NAMES = Object.keys(
  ROUTINE_ICONS,
) as RoutineIconName[];

export function getLucideIcon(name: string): LucideIcon | null {
  return ROUTINE_ICONS[name] ?? null;
}
