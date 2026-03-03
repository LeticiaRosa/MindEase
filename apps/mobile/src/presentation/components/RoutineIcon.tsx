import { Text } from "react-native";

const DEFAULT_ICON = "📋";

interface RoutineIconProps {
  icon?: string;
  size?: number;
  color?: string;
}

export function RoutineIcon({ icon, size = 20, color }: RoutineIconProps) {
  return (
    <Text
      style={{
        fontSize: size,
        color,
        lineHeight: size * 1.2,
      }}
      accessibilityElementsHidden
    >
      {icon || DEFAULT_ICON}
    </Text>
  );
}
