import { z } from "zod";

export const alertPreferencesSchema = z.object({
  triggers: z
    .array(
      z.enum([
        "same-task-too-long",
        "task-switching",
        "inactivity",
        "time-overrun",
        "complex-task",
      ]),
    )
    .min(1, "Selecione pelo menos um gatilho"),
  tone: z.enum(["direto", "acolhedor", "reflexivo", "sugestao"]),
  intensity: z.enum(["discreto", "moderado", "ativo"]),
  sameTaskThresholdMin: z.number().int().min(5).max(120),
  taskSwitchThreshold: z.number().int().min(1).max(20),
  inactivityThresholdMin: z.number().int().min(1).max(60),
});

export type AlertPreferencesDTO = z.infer<typeof alertPreferencesSchema>;
