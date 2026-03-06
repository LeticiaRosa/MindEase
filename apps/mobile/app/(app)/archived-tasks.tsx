import { View, Text, Pressable, FlatList, SafeAreaView } from "react-native";
import { PageHeader } from "@/presentation/components/PageHeader";
import { useArchivedTasks } from "@/presentation/hooks/useArchivedTasks";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { ArchiveRestore } from "lucide-react-native";

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
      <PageHeader title="Tarefas Arquivadas" />
      <FlatList
        data={isLoading ? [] : archivedTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          gap: resolvedSpacing.sm,
          padding: resolvedSpacing.xs,
        }}
        ListHeaderComponent={
          !isLoading ? (
            <Text
              style={{
                fontSize: resolvedFontSizes.sm,
                color: resolvedColors.mutedForeground,
                textAlign: "left",
                margin: resolvedSpacing.md,
              }}
            >
              {archivedTasks.length}{" "}
              {archivedTasks.length === 1 ? "task" : "tasks"} archived. Select a
              status to restore any task back to the board.
            </Text>
          ) : null
        }
        ListEmptyComponent={
          isLoading ? (
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
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
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
          )
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: resolvedColors.card,
              borderRadius: resolvedBorderRadius.md,
              paddingVertical: resolvedSpacing.md,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: resolvedSpacing.md,
              borderWidth: 1,
              borderColor: resolvedColors.border,
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
              <Text
                style={{
                  fontSize: resolvedFontSizes.sm,
                  color: resolvedColors.mutedForeground,
                  marginTop: 2,
                }}
              >
                {"Arquivado em "}
                {new Date(item.statusUpdatedAt).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>
            <Pressable
              onPress={() => restoreTask(item.id, "todo")}
              accessibilityLabel={`Restaurar ${item.title}`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: resolvedSpacing.xs,
                backgroundColor: resolvedColors.background,
                borderWidth: 1,
                borderColor: resolvedColors.border,
                borderRadius: resolvedBorderRadius.sm,
                paddingHorizontal: resolvedSpacing.sm,
                paddingVertical: 4,
              }}
            >
              <ArchiveRestore size={14} color={resolvedColors.textPrimary} />
              <Text
                style={{
                  fontSize: resolvedFontSizes.xs,
                  color: resolvedColors.textPrimary,
                  fontWeight: "500",
                }}
              >
                Restaurar
              </Text>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
