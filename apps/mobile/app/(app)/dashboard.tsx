import { useState } from "react";
import {
  ScrollView,
  View,
  RefreshControl,
  Text,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Circle,
  Zap,
  CheckCircle2,
  Settings,
  type LucideIcon,
} from "lucide-react-native";
import { useAuth } from "@/presentation/hooks/useAuth";
import { useTaskKanban } from "@/presentation/hooks/useTaskKanban";
import { useRoutines } from "@/presentation/hooks/useRoutines";
import { useAlertEngine } from "@/presentation/hooks/useAlertEngine";
import { useActiveRoutine } from "@/presentation/contexts/ActiveRoutineContext";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";
import { DashboardHeader } from "@/presentation/components/DashboardHeader";
import { BrainTodayBottomSheet } from "@/presentation/components/BrainTodayBottomSheet";
import { RoutineSelector } from "@/presentation/components/RoutineSelector";
import { TaskGroup } from "@/presentation/components/TaskGroup";
import { CognitiveAlertModal } from "@/presentation/components/CognitiveAlertModal";

type TabId = "todo" | "in_progress" | "done" | "settings";

interface TabDef {
  id: TabId;
  label: string;
  Icon: LucideIcon;
}

const TABS: TabDef[] = [
  { id: "todo", label: "A Fazer", Icon: Circle },
  { id: "in_progress", label: "Fazendo", Icon: Zap },
  { id: "done", label: "Concluído", Icon: CheckCircle2 },
  { id: "settings", label: "Config.", Icon: Settings },
];

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState<TabId>("todo");

  const router = useRouter();
  const { user } = useAuth();
  const { routines, isLoading: routinesLoading } = useRoutines();
  const { activeRoutineId, setActiveRoutineId } = useActiveRoutine();
  const {
    resolvedColors,
    resolvedSpacing,
    resolvedFontSizes,
    resolvedBorderRadius,
  } = useTheme();

  // Default to first routine if none selected
  const effectiveRoutineId = activeRoutineId ?? routines[0]?.id ?? "";

  const {
    tasks: _tasks,
    isLoading: tasksLoading,
    tasksByStatus,
    createTask,
    updateTask,
    deleteTask,
    archiveTask,
  } = useTaskKanban(effectiveRoutineId);

  const {
    bannerActive,
    bannerMessage,
    modalPayload,
    dismissBanner,
    dismissModal,
  } = useAlertEngine();

  const todoTasks = tasksByStatus("todo");
  const inProgressTasks = tasksByStatus("in_progress");
  const doneTasks = tasksByStatus("done");

  return (
    <View style={{ flex: 1, backgroundColor: resolvedColors.background }}>
      {user && (
        <DashboardHeader
          user={user}
          alertMessage={bannerActive ? bannerMessage : undefined}
          onDismissAlert={dismissBanner}
        />
      )}

      {/* Routine selector — hidden on settings tab */}
      {activeTab !== "settings" && routines.length > 0 && (
        <View
          style={{
            paddingHorizontal: resolvedSpacing.md,
            paddingTop: resolvedSpacing.xs,
          }}
        >
          <RoutineSelector
            routines={routines}
            activeRoutineId={effectiveRoutineId}
            onSelect={setActiveRoutineId}
            onManage={() => router.push("/(app)/manage-routines")}
          />
        </View>
      )}

      {/* Tab content */}
      {activeTab === "settings" ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: resolvedSpacing.md,
            paddingBottom: resolvedSpacing["3xl"],
            gap: resolvedSpacing.sm,
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.lg,
              fontWeight: "600",
              color: resolvedColors.textPrimary,
              marginBottom: resolvedSpacing.sm,
            }}
          >
            Configurações
          </Text>

          {(
            [
              {
                label: "Gerenciar Rotinas",
                route: "/(app)/manage-routines" as const,
              },
              {
                label: "Tarefas Arquivadas",
                route: "/(app)/archived-tasks" as const,
              },
              {
                label: "Alertas Cognitivos",
                route: "/(app)/cognitive-alert-config" as const,
              },
            ] as const
          ).map(({ label, route }) => (
            <Pressable
              key={route}
              onPress={() => router.push(route)}
              accessibilityRole="button"
              style={({ pressed }) => ({
                padding: resolvedSpacing.md,
                borderRadius: resolvedBorderRadius.md,
                backgroundColor: pressed
                  ? resolvedColors.muted
                  : resolvedColors.card,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              })}
            >
              <Text
                style={{
                  fontSize: resolvedFontSizes.base,
                  color: resolvedColors.textPrimary,
                }}
              >
                {label}
              </Text>
              <Text
                style={{
                  fontSize: resolvedFontSizes.base,
                  color: resolvedColors.mutedForeground,
                }}
              >
                →
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: resolvedSpacing.md,
            paddingBottom: resolvedSpacing["3xl"],
          }}
          refreshControl={
            <RefreshControl
              refreshing={tasksLoading}
              onRefresh={() => {}}
              tintColor={resolvedColors.primary}
            />
          }
        >
          {activeTab === "todo" && (
            <TaskGroup
              title="A Fazer"
              tasks={todoTasks}
              showCreate
              onCreateTask={createTask}
              onDeleteTask={deleteTask}
              onArchiveTask={archiveTask}
              onUpdateTask={updateTask}
              emptyMessage="Nenhuma tarefa pendente"
            />
          )}
          {activeTab === "in_progress" && (
            <TaskGroup
              title="Fazendo"
              tasks={inProgressTasks}
              onDeleteTask={deleteTask}
              onArchiveTask={archiveTask}
              onUpdateTask={updateTask}
              emptyMessage="Nenhuma tarefa em andamento"
            />
          )}
          {activeTab === "done" && (
            <TaskGroup
              title="Concluído"
              tasks={doneTasks}
              onDeleteTask={deleteTask}
              onArchiveTask={archiveTask}
              onUpdateTask={updateTask}
              emptyMessage="Nenhuma tarefa concluída"
            />
          )}
        </ScrollView>
      )}

      {/* Bottom tab bar */}
      <View
        style={{
          flexDirection: "row",
          borderTopWidth: 1,
          borderTopColor: resolvedColors.muted,
          backgroundColor: resolvedColors.background,
        }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          const color = isActive
            ? resolvedColors.primary
            : resolvedColors.mutedForeground;
          return (
            <Pressable
              key={id}
              onPress={() => setActiveTab(id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={label}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: resolvedSpacing.sm,
                gap: 4,
              }}
            >
              {isActive && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "20%",
                    right: "20%",
                    height: 2,
                    borderRadius: 1,
                    backgroundColor: resolvedColors.primary,
                  }}
                />
              )}
              <Icon
                size={20}
                color={color}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <Text
                style={{
                  fontSize: resolvedFontSizes.xs,
                  color,
                  fontWeight: isActive ? "600" : "400",
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Brain Today check-in */}
      <BrainTodayBottomSheet />

      {/* Alert modal */}
      {modalPayload && (
        <CognitiveAlertModal payload={modalPayload} onDismiss={dismissModal} />
      )}
    </View>
  );
}
