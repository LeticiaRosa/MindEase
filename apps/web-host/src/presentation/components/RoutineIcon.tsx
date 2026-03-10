import { NotebookPen } from "lucide-react";
import { ROUTINE_ICONS } from "@/presentation/constants/routineIcons";

// ─── Helper component ─────────────────────────────────────────────────────────

interface RoutineIconProps {
  name: string;
  className?: string;
}

export function RoutineIcon({ name, className = "size-4" }: RoutineIconProps) {
  const Icon = ROUTINE_ICONS[name] ?? NotebookPen;
  return <Icon className={className} />;
}
