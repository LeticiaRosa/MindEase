import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { Pencil, Trash2 } from "lucide-react-native";
import { useRoutines } from "@/presentation/hooks/useRoutines";
import { RoutineIcon } from "@/presentation/components/RoutineIcon";
import { IconPicker } from "@/presentation/components/IconPicker";
import { useTheme } from "@/presentation/contexts/ThemePreferencesContext";

export default function ManageRoutinesScreen() {
  const { routines, isLoading, createRoutine, updateRoutine, deleteRoutine } =
    useRoutines();
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

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Excluir rotina",
      `Tem certeza que deseja excluir "${name}"? As tarefas da rotina serão mantidas.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteRoutine(id),
        },
      ],
    );
  };

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
          Gerenciar Rotinas
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

      {/* Create form */}
      <View
        style={{
          backgroundColor: resolvedColors.card,
          borderRadius: resolvedBorderRadius.lg,
          padding: resolvedSpacing.md,
          gap: resolvedSpacing.md,
        }}
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.lg,
            fontWeight: "600",
            color: resolvedColors.textPrimary,
          }}
        >
          Nova Rotina
        </Text>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          placeholder="Nome da rotina"
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
        <IconPicker selected={newIcon} onSelect={setNewIcon} />
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
            Criar Rotina
          </Text>
        </Pressable>
      </View>

      {/* Existing routines */}

      <View
        style={{
          gap: resolvedSpacing.xs,
          paddingHorizontal: resolvedSpacing.md,
        }}
      >
        <Text
          style={{
            fontSize: resolvedFontSizes.lg,
            fontWeight: "600",
            color: resolvedColors.textPrimary,
          }}
        >
          Suas Rotinas ({routines.length})
        </Text>
        <ScrollView
          contentContainerStyle={{
            padding: resolvedSpacing.md,
            gap: resolvedSpacing.md,
          }}
        >
          {routines.map((routine) => (
            <View
              key={routine.id}
              style={{
                backgroundColor: resolvedColors.card,
                borderRadius: resolvedBorderRadius.lg,
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
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: resolvedSpacing.sm,
                      flex: 1,
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
                  <View
                    style={{ flexDirection: "row", gap: resolvedSpacing.sm }}
                  >
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
