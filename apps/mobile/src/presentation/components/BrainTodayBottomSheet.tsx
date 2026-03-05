import { View, Text, Pressable, Modal } from "react-native";
import { useBrainToday } from "@/presentation/contexts/BrainTodayContext";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import {
  BRAIN_STATE_OPTIONS,
  type BrainStateValue,
} from "@/domain/entities/BrainState";

export function BrainTodayBottomSheet() {
  const { brainState, hasAnsweredToday, setBrainState, skip } = useBrainToday();
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  if (hasAnsweredToday) return null;

  return (
    <Modal visible animationType="slide" transparent statusBarTranslucent>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.35)",
        }}
      >
        <View
          style={{
            backgroundColor: resolvedColors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: resolvedSpacing.xl,
            paddingBottom: resolvedSpacing["3xl"],
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.xl,
              fontWeight: "700",
              color: resolvedColors.textPrimary,
              marginBottom: resolvedSpacing.sm,
            }}
          >
            Como está seu cérebro hoje?
          </Text>
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.textSecondary,
              marginBottom: resolvedSpacing.xl,
            }}
          >
            Escolha o estado que mais se parece com o seu momento agora.
          </Text>

          <View
            style={{
              gap: resolvedSpacing.sm,
              marginBottom: resolvedSpacing.xl,
            }}
          >
            {BRAIN_STATE_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => setBrainState(opt.value)}
                accessibilityLabel={`${opt.label}: ${opt.description}`}
                style={{
                  padding: resolvedSpacing.md,
                  backgroundColor: resolvedColors.muted,
                  borderRadius: resolvedBorderRadius.md,
                  borderLeftWidth: 4,
                  borderLeftColor: resolvedColors[opt.color],
                  flexDirection: "row",
                  alignItems: "center",
                  gap: resolvedSpacing.sm,
                }}
              >
                <Text style={{ fontSize: 22 }}>{opt.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: resolvedFontSizes.base,
                      fontWeight: "600",
                      color: resolvedColors[opt.color],
                      marginBottom: 2,
                    }}
                  >
                    {opt.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: resolvedFontSizes.sm,
                      color: resolvedColors.textSecondary,
                    }}
                  >
                    {opt.description}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={skip}
            accessibilityLabel="Pular por hoje"
            style={{ alignItems: "center", padding: resolvedSpacing.md }}
          >
            <Text
              style={{
                fontSize: resolvedFontSizes.base,
                color: resolvedColors.mutedForeground,
              }}
            >
              Pular por hoje
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
