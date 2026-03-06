import {
  View,
  Text,
  Pressable,
  ScrollView,
  Switch,
  SafeAreaView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { PageHeader } from "@/presentation/components/PageHeader";
import { useAlertPreferences } from "@/presentation/contexts/AlertPreferencesContext";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import type {
  AlertTone,
  AlertIntensity,
  AlertTrigger,
} from "@/domain/valueObjects/AlertTypes";
import {
  ALERT_TONE_LABELS,
  ALERT_INTENSITY_LABELS,
  ALERT_TRIGGER_LABELS,
} from "@/domain/valueObjects/AlertTypes";

const TONES: AlertTone[] = ["direto", "acolhedor", "reflexivo", "sugestao"];
const INTENSITIES: AlertIntensity[] = ["discreto", "moderado", "ativo"];
const TRIGGERS: AlertTrigger[] = [
  "same-task-too-long",
  "task-switching",
  "inactivity",
  "time-overrun",
  "complex-task",
];

export default function CognitiveAlertConfigScreen() {
  const { preferences, savePreferences } = useAlertPreferences();
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  const toggleTrigger = (trigger: AlertTrigger) => {
    const current = preferences.triggers;
    const next = current.includes(trigger)
      ? current.filter((t) => t !== trigger)
      : [...current, trigger];
    savePreferences({ ...preferences, triggers: next });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: resolvedColors.background }}
    >
      <PageHeader title=" Alertas Cognitivos " />

      {/* Tone */}
      <ScrollView
        contentContainerStyle={{
          padding: resolvedSpacing.lg,
          gap: resolvedSpacing.xl,
        }}
      >
        <View style={{ gap: resolvedSpacing.sm }}>
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              fontWeight: "600",
              color: resolvedColors.textPrimary,
            }}
          >
            Tom das Mensagens
          </Text>
          {TONES.map((tone) => (
            <Pressable
              key={tone}
              onPress={() => savePreferences({ ...preferences, tone })}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: resolvedSpacing.sm,
                backgroundColor:
                  preferences.tone === tone
                    ? resolvedColors.accent
                    : resolvedColors.card,
                borderWidth: 1,
                borderColor:
                  preferences.tone === tone
                    ? resolvedColors.ring
                    : resolvedColors.border,
                borderRadius: resolvedBorderRadius.md,
                padding: resolvedSpacing.md,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: resolvedColors.ring,
                  backgroundColor:
                    preferences.tone === tone
                      ? resolvedColors.ring
                      : "transparent",
                }}
              />
              <Text
                style={{
                  fontSize: resolvedFontSizes.sm,
                  color: resolvedColors.textPrimary,
                }}
              >
                {ALERT_TONE_LABELS[tone]}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Intensity */}
        <View style={{ gap: resolvedSpacing.sm }}>
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              fontWeight: "600",
              color: resolvedColors.textPrimary,
            }}
          >
            Intensidade
          </Text>
          {INTENSITIES.map((intensity) => (
            <Pressable
              key={intensity}
              onPress={() => savePreferences({ ...preferences, intensity })}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: resolvedSpacing.sm,
                backgroundColor:
                  preferences.intensity === intensity
                    ? resolvedColors.accent
                    : resolvedColors.card,
                borderWidth: 1,
                borderColor:
                  preferences.intensity === intensity
                    ? resolvedColors.ring
                    : resolvedColors.border,
                borderRadius: resolvedBorderRadius.md,
                padding: resolvedSpacing.md,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: resolvedColors.ring,
                  backgroundColor:
                    preferences.intensity === intensity
                      ? resolvedColors.ring
                      : "transparent",
                }}
              />
              <Text
                style={{
                  fontSize: resolvedFontSizes.sm,
                  color: resolvedColors.textPrimary,
                }}
              >
                {ALERT_INTENSITY_LABELS[intensity]}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Triggers */}
        <View style={{ gap: resolvedSpacing.sm }}>
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              fontWeight: "600",
              color: resolvedColors.textPrimary,
            }}
          >
            Gatilhos Ativos
          </Text>
          {TRIGGERS.map((trigger) => (
            <View
              key={trigger}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: resolvedColors.card,
                borderRadius: resolvedBorderRadius.md,
                padding: resolvedSpacing.md,
              }}
            >
              <Text
                style={{
                  fontSize: resolvedFontSizes.sm,
                  color: resolvedColors.textPrimary,
                  flex: 1,
                }}
              >
                {ALERT_TRIGGER_LABELS[trigger]}
              </Text>
              <Switch
                value={preferences.triggers.includes(trigger)}
                onValueChange={() => toggleTrigger(trigger)}
                trackColor={{
                  false: resolvedColors.muted,
                  true: resolvedColors.primary,
                }}
                thumbColor={resolvedColors.background}
              />
            </View>
          ))}
        </View>

        {/* Thresholds */}
        <View style={{ gap: resolvedSpacing.md }}>
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              fontWeight: "600",
              color: resolvedColors.textPrimary,
            }}
          >
            Limites
          </Text>

          <View style={{ gap: resolvedSpacing.xs }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: resolvedFontSizes.sm,
                  color: resolvedColors.textPrimary,
                }}
              >
                Tempo na mesma tarefa
              </Text>
              <Text
                style={{
                  fontSize: resolvedFontSizes.sm,
                  color: resolvedColors.mutedForeground,
                }}
              >
                {preferences.sameTaskThresholdMin} min
              </Text>
            </View>
            <Slider
              value={preferences.sameTaskThresholdMin}
              minimumValue={5}
              maximumValue={120}
              step={5}
              onSlidingComplete={(v) =>
                savePreferences({ ...preferences, sameTaskThresholdMin: v })
              }
              minimumTrackTintColor={resolvedColors.primary}
              maximumTrackTintColor={resolvedColors.muted}
              thumbTintColor={resolvedColors.primary}
            />
          </View>

          <View style={{ gap: resolvedSpacing.xs }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: resolvedFontSizes.sm,
                  color: resolvedColors.textPrimary,
                }}
              >
                Trocas de tarefa
              </Text>
              <Text
                style={{
                  fontSize: resolvedFontSizes.sm,
                  color: resolvedColors.mutedForeground,
                }}
              >
                {preferences.taskSwitchThreshold} trocas
              </Text>
            </View>
            <Slider
              value={preferences.taskSwitchThreshold}
              minimumValue={1}
              maximumValue={10}
              step={1}
              onSlidingComplete={(v) =>
                savePreferences({ ...preferences, taskSwitchThreshold: v })
              }
              minimumTrackTintColor={resolvedColors.primary}
              maximumTrackTintColor={resolvedColors.muted}
              thumbTintColor={resolvedColors.primary}
            />
          </View>

          <View style={{ gap: resolvedSpacing.xs }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: resolvedFontSizes.sm,
                  color: resolvedColors.textPrimary,
                }}
              >
                Inatividade
              </Text>
              <Text
                style={{
                  fontSize: resolvedFontSizes.sm,
                  color: resolvedColors.mutedForeground,
                }}
              >
                {preferences.inactivityThresholdMin} min
              </Text>
            </View>
            <Slider
              value={preferences.inactivityThresholdMin}
              minimumValue={2}
              maximumValue={30}
              step={1}
              onSlidingComplete={(v) =>
                savePreferences({ ...preferences, inactivityThresholdMin: v })
              }
              minimumTrackTintColor={resolvedColors.primary}
              maximumTrackTintColor={resolvedColors.muted}
              thumbTintColor={resolvedColors.primary}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
