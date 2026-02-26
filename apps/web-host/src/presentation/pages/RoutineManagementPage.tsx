import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@repo/ui";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@repo/ui";
import { useRoutines } from "@/presentation/hooks/useRoutines";
import { IconPicker } from "@/presentation/components/IconPicker";
import { RoutineIcon } from "@/presentation/components/RoutineIcon";
import { Logo } from "@/presentation/components/Logo";
import { DEFAULT_ROUTINE_ICON } from "@/presentation/components/RoutineIcon";
import type { Routine } from "@/domain/entities/Routine";

// ─── Schema ───────────────────────────────────────────────────────────────────

const createSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(40, "Máximo de 40 caracteres"),
});

type CreateFormValues = z.infer<typeof createSchema>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RoutineManagementPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    routines,
    isLoading,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    reorderRoutines,
  } = useRoutines();

  // ── Creation form state ────────────────────────────────────────────────────

  const form = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: "" },
  });
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_ROUTINE_ICON);

  const handleCreate = (values: CreateFormValues) => {
    createRoutine({ name: values.name.trim(), icon: selectedIcon });
    form.reset();
    setSelectedIcon(DEFAULT_ROUTINE_ICON);
  };

  // ── Inline rename state ────────────────────────────────────────────────────

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (routine: Routine) => {
    setEditingId(routine.id);
    setEditingName(routine.name);
    setTimeout(() => editInputRef.current?.focus(), 50);
  };

  const confirmRename = () => {
    const trimmed = editingName.trim();
    if (!trimmed) {
      toast.error("Nome não pode estar vazio");
      return;
    }
    if (trimmed.length > 40) {
      toast.error("Máximo de 40 caracteres");
      return;
    }
    updateRoutine({ id: editingId!, updates: { name: trimmed } });
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  // ── Delete confirmation state ─────────────────────────────────────────────

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (routines.length <= 1) {
      toast.error("Você precisa ter pelo menos um Kanban");
      return;
    }
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (!confirmDeleteId) return;
    deleteRoutine(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  // ── Reorder ───────────────────────────────────────────────────────────────

  const moveUp = (routine: Routine) => {
    const idx = routines.findIndex((r) => r.id === routine.id);
    if (idx <= 0) return;
    const prev = routines[idx - 1];
    reorderRoutines([
      { id: routine.id, position: prev.position },
      { id: prev.id, position: routine.position },
    ]);
  };

  const moveDown = (routine: Routine) => {
    const idx = routines.findIndex((r) => r.id === routine.id);
    if (idx >= routines.length - 1) return;
    const next = routines[idx + 1];
    reorderRoutines([
      { id: routine.id, position: next.position },
      { id: next.id, position: routine.position },
    ]);
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="Voltar"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Gerenciar Kanbans
              </h1>
            </div>
          </div>
          <Logo />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* ── Creation form ─────────────────────────────────────────────── */}
        <section aria-labelledby="create-heading">
          <p className="text-xs text-muted-foreground mb-4">
            Personalize suas rotinas do jeito que quiser! Adicione quantos
            Kanbans precisar para organizar suas tarefas de forma eficiente.
          </p>
          <h2
            id="create-heading"
            className="text-base font-semibold mb-4 text-foreground"
          >
            Novo Kanban
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreate)}
              className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-card"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Estudos, Projetos pessoais…"
                        maxLength={40}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Ícone</span>
                <IconPicker value={selectedIcon} onChange={setSelectedIcon} />
              </div>

              <Button type="submit" className="self-end">
                Adicionar Kanban
              </Button>
            </form>
          </Form>
        </section>

        {/* ── Routine list ──────────────────────────────────────────────── */}
        <section aria-labelledby="list-heading">
          <h2
            id="list-heading"
            className="text-base font-semibold mb-4 text-foreground"
          >
            Seus Kanbans
          </h2>

          {isLoading && (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-muted/30 animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && routines.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              Nenhum Kanban encontrado
            </p>
          )}

          {!isLoading && routines.length > 0 && (
            <ol className="space-y-2" aria-label="Lista de Kanbans">
              {routines.map((routine, idx) => (
                <li
                  key={routine.id}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
                >
                  {/* Icon */}
                  <RoutineIcon
                    name={routine.icon}
                    className="size-5 text-muted-foreground shrink-0"
                  />

                  {/* Name / inline rename */}
                  {editingId === routine.id ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        ref={editInputRef}
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmRename();
                          if (e.key === "Escape") cancelEdit();
                        }}
                        maxLength={40}
                        className="flex-1 min-w-0 bg-background border border-border rounded-md px-2 py-1 text-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                        aria-label="Editar nome do Kanban"
                      />
                      <button
                        type="button"
                        onClick={confirmRename}
                        className="p-1 rounded text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                        aria-label="Confirmar renomeação"
                      >
                        <Check className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="p-1 rounded text-muted-foreground hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                        aria-label="Cancelar renomeação"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="flex-1 min-w-0 text-sm font-medium truncate">
                      {routine.name}
                    </span>
                  )}

                  {/* Action buttons */}
                  {editingId !== routine.id && (
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Move up */}
                      <button
                        type="button"
                        onClick={() => moveUp(routine)}
                        disabled={idx === 0}
                        className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                        aria-label={`Mover ${routine.name} para cima`}
                      >
                        <ChevronUp className="size-4" />
                      </button>

                      {/* Move down */}
                      <button
                        type="button"
                        onClick={() => moveDown(routine)}
                        disabled={idx === routines.length - 1}
                        className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                        aria-label={`Mover ${routine.name} para baixo`}
                      >
                        <ChevronDown className="size-4" />
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => startEdit(routine)}
                        className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                        aria-label={`Renomear ${routine.name}`}
                      >
                        <Pencil className="size-4" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(routine.id)}
                        disabled={routines.length <= 1}
                        className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
                        aria-label={`Excluir ${routine.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      {/* ── Delete confirmation dialog ────────────────────────────────────── */}
      {confirmDeleteId && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        >
          <div className="bg-card border border-border rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3
              id="confirm-delete-title"
              className="text-base font-semibold text-foreground"
            >
              Excluir Kanban?
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todas as tarefas deste Kanban serão removidas permanentemente.
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancelar
              </Button>
              <Button variant="destructive" size="sm" onClick={confirmDelete}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
