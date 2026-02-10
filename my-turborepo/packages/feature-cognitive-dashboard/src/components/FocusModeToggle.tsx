import { StyleSheet, Text, Pressable, View } from "react-native";

interface FocusModeToggleProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

export function FocusModeToggle({ enabled, onToggle }: FocusModeToggleProps) {
  return (
    <Pressable
      style={[styles.toggle, enabled && styles.toggleActive]}
      onPress={() => onToggle(!enabled)}
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      accessibilityLabel="Modo de Foco"
    >
      <View style={[styles.thumb, enabled && styles.thumbActive]} />
      <Text style={[styles.label, enabled && styles.labelActive]}>
        {enabled ? "Ativado" : "Desativado"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 24,
    padding: 4,
    width: 180,
  },
  toggleActive: {
    backgroundColor: "#6C63FF",
  },
  thumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  thumbActive: {
    marginLeft: "auto",
    marginRight: 0,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    paddingHorizontal: 8,
  },
  labelActive: {
    color: "#fff",
  },
});
