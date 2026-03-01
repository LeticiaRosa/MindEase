import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, fontSizes, spacing, borderRadius } from "@repo/ui/theme";

const STORAGE_KEY = "mindease:brain-state";

type BrainState =
  | "focado"
  | "cansado"
  | "sobrecarregado"
  | "ansioso"
  | "disperso";

const BRAIN_STATE_OPTIONS: {
  value: BrainState;
  label: string;
  color: string;
  description: string;
}[] = [
  {
    value: "focado",
    label: "Focado",
    color: "#22c55e",
    description: "Energia e clareza",
  },
  {
    value: "cansado",
    label: "Cansado",
    color: "#eab308",
    description: "Precisando de ritmo lento",
  },
  {
    value: "sobrecarregado",
    label: "Sobrecarregado",
    color: "#ef4444",
    description: "Muita coisa de uma vez",
  },
  {
    value: "ansioso",
    label: "Ansioso",
    color: "#3b82f6",
    description: "Difícil de parar os pensamentos",
  },
  {
    value: "disperso",
    label: "Disperso",
    color: "#a855f7",
    description: "Difícil de manter o foco",
  },
];

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0]!;
}

interface BrainTodayBottomSheetProps {
  onDismiss: (state: BrainState | null) => void;
}

export function BrainTodayBottomSheet({
  onDismiss,
}: BrainTodayBottomSheetProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const todayKey = getTodayKey();
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value === todayKey) {
        // Already answered today
        return;
      }
      setVisible(true);
    });
  }, []);

  async function selectState(state: BrainState) {
    await AsyncStorage.setItem(STORAGE_KEY, getTodayKey());
    setVisible(false);
    onDismiss(state);
  }

  async function skip() {
    setVisible(false);
    onDismiss(null);
  }

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Como está seu cérebro hoje?</Text>
          <Text style={styles.subtitle}>
            Escolha o estado que mais se parece com o seu momento agora.
          </Text>

          <View style={styles.options}>
            {BRAIN_STATE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.option, { borderLeftColor: opt.color }]}
                onPress={() => selectState(opt.value)}
                accessibilityLabel={`${opt.label}: ${opt.description}`}
              >
                <Text style={[styles.optionLabel, { color: opt.color }]}>
                  {opt.label}
                </Text>
                <Text style={styles.optionDescription}>{opt.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={skip}
            style={styles.skipButton}
            accessibilityLabel="Pular por hoje"
          >
            <Text style={styles.skipText}>Pular por hoje</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.xl,
    paddingBottom: spacing["3xl"],
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  options: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  option: {
    padding: spacing.md,
    backgroundColor: colors.muted,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
  },
  optionLabel: {
    fontSize: fontSizes.base,
    fontWeight: "600",
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  skipButton: {
    alignItems: "center",
    padding: spacing.md,
  },
  skipText: {
    fontSize: fontSizes.base,
    color: colors.mutedForeground,
  },
});
