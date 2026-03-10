import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react-native";
import { PageHeader } from "@/presentation/components/PageHeader";
import { useRoutines } from "@/presentation/hooks/useRoutines";
import { RoutineIcon } from "@/presentation/components/RoutineIcon";
import { IconPicker } from "@/presentation/components/IconPicker";
import { ConfirmDeleteDialog } from "@/presentation/components/ConfirmDeleteDialog";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

export default function ManageRoutinesScreen() {
  const {
    routines,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    reorderRoutines,
  } = useRoutines();
  const {
    resolvedColors,
    resolvedFontSizes,
    resolvedSpacing,
    resolvedBorderRadius,
  } = useTheme();

  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState<string | undefined>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState<string | undefined>();

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    createRoutine(trimmed, newIcon);
    setNewName("");
    setNewIcon(undefined);
  };

  const handleStartEdit = (routine: {
    id: string;
    name: string;
    icon?: string;
  }) => {
    setEditingId(routine.id);
    setEditName(routine.name);
    setEditIcon(routine.icon);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editName.trim()) return;
    updateRoutine(editingId, {
      name: editName.trim(),
      icon: editIcon,
    });
    setEditingId(null);
  };

  const moveUp = (routine: { id: string; position: number }) => {
    const idx = routines.findIndex((r) => r.id === routine.id);
    if (idx <= 0) return;
    const prev = routines[idx - 1];
    reorderRoutines([
      { id: routine.id, position: prev.position },
      { id: prev.id, position: routine.position },
    ]);
  };

  const moveDown = (routine: { id: string; position: number }) => {
    const idx = routines.findIndex((r) => r.id === routine.id);
    if (idx >= routines.length - 1) return;
    const next = routines[idx + 1];
    reorderRoutines([
      { id: routine.id, position: next.position },
      { id: next.id, position: routine.position },
    ]);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState("");

  const handleDelete = (id: string, name: string) => {
    setConfirmDeleteName(name);
    setConfirmDeleteId(id);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: resolvedColors.background }}
    >
      <PageHeader title={"Gerenciar Kanbans"} />

      {/* Create form */}
      <ScrollView
        contentContainerStyle={{
          gap: resolvedSpacing.md,
        }}
      >
        <View
          style={{
            backgroundColor: resolvedColors.card,
            borderRadius: resolvedBorderRadius.lg,
            gap: resolvedSpacing.xs,
            padding: resolvedSpacing.md,
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.sm,
              color: resolvedColors.mutedForeground,
              paddingBottom: resolvedSpacing.md,
            }}
          >
            Personalize suas rotinas do jeito que quiser! Adicione quantos
            Kanbans precisar para organizar suas tarefas de forma eficiente.
          </Text>
          <Text
            style={{
              fontSize: resolvedFontSizes.lg,
              fontWeight: "600",
              color: resolvedColors.textPrimary,
              paddingBottom: resolvedSpacing.md,
            }}
          >
            Nova Rotina
          </Text>
          <Text
            style={{
              fontSize: resolvedFontSizes.md,
              fontWeight: "600",
              color: resolvedColors.textPrimary,
            }}
          >
            Nome
          </Text>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="Ex: Estudos, Projetos pessoais..."
            placeholderTextColor={resolvedColors.mutedForeground}
            style={{
              backgroundColor: resolvedColors.background,
              borderWidth: 1,
              borderColor: resolvedColors.border,
              borderRadius: resolvedBorderRadius.md,
              paddingHorizontal: resolvedSpacing.md,
              paddingVertical: resolvedSpacing.sm,
              fontSize: resolvedFontSizes.base,
              color: resolvedColors.textPrimary,
            }}
          />
          <Text
            style={{
              fontSize: resolvedFontSizes.md,
              fontWeight: "600",
              color: resolvedColors.textPrimary,
              paddingTop: resolvedSpacing.md,
            }}
          >
            Ícone
          </Text>
          <IconPicker selected={newIcon} onSelect={setNewIcon} />
          <View style={{ paddingTop: resolvedSpacing.lg }}>
            <Pressable
              onPress={handleCreate}
              disabled={!newName.trim()}
              style={{
                backgroundColor: newName.trim()
                  ? resolvedColors.primary
                  : resolvedColors.muted,
                borderRadius: resolvedBorderRadius.md,
                paddingVertical: resolvedSpacing.md,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: resolvedFontSizes.base,
                  fontWeight: "600",
                  color: newName.trim()
                    ? resolvedColors.primaryForeground
                    : resolvedColors.mutedForeground,
                }}
              >
                Adicionar Kanban
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Existing routines */}

        <View
          style={{
            gap: resolvedSpacing.md,
            padding: resolvedSpacing.md,
          }}
        >
          <Text
            style={{
              fontSize: resolvedFontSizes.lg,
              fontWeight: "600",
              color: resolvedColors.textPrimary,
            }}
          >
            Seus Kanbans ({routines.length})
          </Text>

          {routines.map((routine) => (
            <View
              key={routine.id}
              style={{
                backgroundColor: resolvedColors.card,
                borderRadius: resolvedBorderRadius.lg,
                borderWidth: 1,
                borderColor: resolvedColors.border,
                padding: resolvedSpacing.md,
                gap: resolvedSpacing.sm,
              }}
            >
              {editingId === routine.id ? (
                <>
                  <TextInput
                    value={editName}
                    onChangeText={setEditName}
                    autoFocus
                    style={{
                      backgroundColor: resolvedColors.background,
                      borderWidth: 1,
                      borderColor: resolvedColors.ring,
                      borderRadius: resolvedBorderRadius.md,
                      paddingHorizontal: resolvedSpacing.md,
                      paddingVertical: resolvedSpacing.sm,
                      fontSize: resolvedFontSizes.base,
                      color: resolvedColors.textPrimary,
                    }}
                  />
                  <IconPicker selected={editIcon} onSelect={setEditIcon} />
                  <View
                    style={{ flexDirection: "row", gap: resolvedSpacing.sm }}
                  >
                    <Pressable
                      onPress={handleSaveEdit}
                      style={{
                        flex: 1,
                        backgroundColor: resolvedColors.primary,
                        borderRadius: resolvedBorderRadius.md,
                        paddingVertical: resolvedSpacing.sm,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: resolvedColors.primaryForeground,
                          fontWeight: "600",
                          fontSize: resolvedFontSizes.sm,
                        }}
                      >
                        Salvar
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setEditingId(null)}
                      style={{
                        flex: 1,
                        backgroundColor: resolvedColors.muted,
                        borderRadius: resolvedBorderRadius.md,
                        paddingVertical: resolvedSpacing.sm,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: resolvedColors.mutedForeground,
                          fontWeight: "600",
                          fontSize: resolvedFontSizes.sm,
                        }}
                      >
                        Cancelar
                      </Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <View style={{ gap: resolvedSpacing.sm }}>
                  {/* Icon + name */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: resolvedSpacing.sm,
                    }}
                  >
                    <RoutineIcon
                      name={routine.icon ?? "notebook-pen"}
                      size={24}
                    />
                    <Text
                      style={{
                        fontSize: resolvedFontSizes.base,
                        fontWeight: "500",
                        color: resolvedColors.textPrimary,
                        flex: 1,
                      }}
                      numberOfLines={1}
                    >
                      {routine.name}
                    </Text>
                  </View>

                  {/* Action buttons */}
                  <View
                    style={{
                      flexDirection: "row",
                      gap: resolvedSpacing.sm,
                      justifyContent: "flex-end",
                      alignContent: "flex-end",
                    }}
                  >
                    <Pressable
                      onPress={() => moveUp(routine)}
                      disabled={
                        routines.findIndex((r) => r.id === routine.id) === 0
                      }
                      accessibilityLabel={`Mover ${routine.name} para cima`}
                      style={{
                        padding: resolvedSpacing.md - 2,
                        backgroundColor: resolvedColors.muted,
                        borderRadius: 9999,
                        opacity:
                          routines.findIndex((r) => r.id === routine.id) === 0
                            ? 0.3
                            : 1,
                      }}
                    >
                      <ChevronUp
                        size={18}
                        color={resolvedColors.mutedForeground}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => moveDown(routine)}
                      disabled={
                        routines.findIndex((r) => r.id === routine.id) ===
                        routines.length - 1
                      }
                      accessibilityLabel={`Mover ${routine.name} para baixo`}
                      style={{
                        padding: resolvedSpacing.md - 2,
                        backgroundColor: resolvedColors.muted,
                        borderRadius: 9999,
                        opacity:
                          routines.findIndex((r) => r.id === routine.id) ===
                          routines.length - 1
                            ? 0.3
                            : 1,
                      }}
                    >
                      <ChevronDown
                        size={18}
                        color={resolvedColors.mutedForeground}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => handleStartEdit(routine)}
                      accessibilityLabel={`Editar ${routine.name}`}
                      style={{
                        padding: resolvedSpacing.md - 2,
                        backgroundColor: resolvedColors.muted,
                        borderRadius: 9999,
                      }}
                    >
                      <Pencil
                        size={18}
                        color={resolvedColors.mutedForeground}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => handleDelete(routine.id, routine.name)}
                      accessibilityLabel={`Excluir ${routine.name}`}
                      style={{
                        padding: resolvedSpacing.md - 2,
                        backgroundColor: resolvedColors.muted,
                        borderRadius: 9999,
                      }}
                    >
                      <Trash2 size={18} color={resolvedColors.destructive} />
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <ConfirmDeleteDialog
        open={confirmDeleteId !== null}
        title="Excluir Kanban?"
        description={`Tem certeza que deseja excluir "${confirmDeleteName}"? As tarefas da rotina serão mantidas.`}
        onConfirm={() => {
          if (confirmDeleteId) deleteRoutine(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </SafeAreaView>
  );
}
