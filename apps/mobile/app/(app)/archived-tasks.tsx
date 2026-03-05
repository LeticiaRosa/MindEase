import { View, Text, Pressable, FlatList, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { useArchivedTasks } from "@/presentation/hooks/useArchivedTasks";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

export default function ArchivedTasksScreen() {
  const { archivedTasks, isLoading, restoreTask } = useArchivedTasks();
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: resolvedColors.background }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: resolvedSpacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: resolvedColors.border,
        }}
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.xl,
            fontWeight: "700",
            color: resolvedColors.textPrimary,
          }}
        >
          Tarefas Arquivadas
        </Text>
        <Pressable onPress={() => router.back()} accessibilityLabel="Voltar">
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.primary,
            }}
          >
            ← Voltar
          </Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.mutedForeground,
            }}
          >
            Carregando…
          </Text>
        </View>
      ) : archivedTasks.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: resolvedSpacing.xl,
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.lg,
              color: resolvedColors.mutedForeground,
              textAlign: "center",
            }}
          >
            Nenhuma tarefa arquivada
          </Text>
          <Text
            style={{
              fontSize: resolvedFontSizes.sm,
              color: resolvedColors.mutedForeground,
              textAlign: "center",
              marginTop: resolvedSpacing.sm,
            }}
          >
            Tarefas arquivadas aparecerão aqui
          </Text>
        </View>
      ) : (
        <FlatList
          data={archivedTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: resolvedSpacing.lg,
            gap: resolvedSpacing.sm,
          }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: resolvedColors.card,
                borderRadius: resolvedBorderRadius.md,
                paddingVertical: resolvedSpacing.md,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1, marginRight: resolvedSpacing.sm }}>
                <Text
                  style={{
                    fontSize: resolvedFontSizes.base,
                    color: resolvedColors.textPrimary,
                    fontWeight: "500",
                  }}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                {item.description && (
                  <Text
                    style={{
                      fontSize: resolvedFontSizes.sm,
                      color: resolvedColors.mutedForeground,
                      marginTop: resolvedSpacing.xs,
                    }}
                    numberOfLines={1}
                  >
                    {item.description}
                  </Text>
                )}
              </View>
              <Pressable
                onPress={() => restoreTask(item.id, "todo")}
                accessibilityLabel={`Restaurar ${item.title}`}
                style={{
                  backgroundColor: resolvedColors.primary,
                  borderRadius: resolvedBorderRadius.sm,
                  paddingHorizontal: resolvedSpacing.md,
                  paddingVertical: resolvedSpacing.xs,
                }}
              >
                <Text
                  style={{
                    fontSize: resolvedFontSizes.sm,
                    color: resolvedColors.primaryForeground,
                    fontWeight: "600",
                  }}
                >
                  Restaurar
                </Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
