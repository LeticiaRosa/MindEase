import { getLucideIcon, DEFAULT_ROUTINE_ICON } from "@/lib/routineIcons";
import { NotebookPen } from "lucide-react-native";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

// ─── Helper component (mirrors web-host RoutineIcon) ─────────────────────────

interface RoutineIconProps {
  name: string;
  size?: number;
  color?: string;
}

export function RoutineIcon({ name, size = 20, color }: RoutineIconProps) {
  const { resolvedColors } = useTheme();
  const iconColor = color ?? resolvedColors.foreground;
  const Icon =
    getLucideIcon(name) ?? getLucideIcon(DEFAULT_ROUTINE_ICON) ?? NotebookPen;
  return <Icon size={size} color={iconColor} accessibilityElementsHidden />;
}
