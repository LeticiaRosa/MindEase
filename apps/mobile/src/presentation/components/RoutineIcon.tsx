import { getLucideIcon, DEFAULT_ROUTINE_ICON } from "@/lib/routineIcons";
import { NotebookPen } from "lucide-react-native";

// ─── Helper component (mirrors web-host RoutineIcon) ─────────────────────────

interface RoutineIconProps {
  name: string;
  size?: number;
  color?: string;
}

export function RoutineIcon({
  name,
  size = 20,
  color = "#000",
}: RoutineIconProps) {
  const Icon =
    getLucideIcon(name) ?? getLucideIcon(DEFAULT_ROUTINE_ICON) ?? NotebookPen;
  return <Icon size={size} color={color} accessibilityElementsHidden />;
}
