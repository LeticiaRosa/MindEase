import { StyleSheet, Text, View, Pressable } from "react-native";

interface ComplexitySliderProps {
  value: number; // 0 = simples, 1 = padrão, 2 = detalhado
  onChange: (value: number) => void;
}

const levels = ["Simples", "Padrão", "Detalhado"];

export function ComplexitySlider({ value, onChange }: ComplexitySliderProps) {
  return (
    <View style={styles.container}>
      {levels.map((label, index) => (
        <Pressable
          key={label}
          style={[styles.option, value === index && styles.optionActive]}
          onPress={() => onChange(index)}
          accessibilityRole="button"
          accessibilityState={{ selected: value === index }}
          accessibilityLabel={`Nível de complexidade: ${label}`}
        >
          <Text
            style={[
              styles.optionText,
              value === index && styles.optionTextActive,
            ]}
          >
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  optionActive: {
    backgroundColor: "#6C63FF",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  optionTextActive: {
    color: "#fff",
  },
});
