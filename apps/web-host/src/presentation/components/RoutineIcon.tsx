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
} from "lucide-react";

// ─── Icon registry ────────────────────────────────────────────────────────────

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

// ─── Helper component ─────────────────────────────────────────────────────────

interface RoutineIconProps {
  name: string;
  className?: string;
}

export function RoutineIcon({ name, className = "size-4" }: RoutineIconProps) {
  const Icon = ROUTINE_ICONS[name] ?? NotebookPen;
  return <Icon className={className} />;
}
