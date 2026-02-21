export type AlertTone = "direto" | "acolhedor" | "reflexivo" | "sugestao";

export type AlertIntensity = "discreto" | "moderado" | "ativo";

export type AlertTrigger =
  | "same-task-too-long"
  | "task-switching"
  | "inactivity"
  | "time-overrun"
  | "complex-task";

export type AlertChannel = "icon" | "toast" | "modal";

export const ALERT_TONE_LABELS: Record<AlertTone, string> = {
  direto: "Texto curto e direto",
  acolhedor: "Mensagem acolhedora",
  reflexivo: "Pergunta reflexiva",
  sugestao: "Sugestão de ação",
};

export const ALERT_INTENSITY_LABELS: Record<AlertIntensity, string> = {
  discreto: "Discreto (apenas ícone piscando)",
  moderado: "Moderado (toast pequeno)",
  ativo: "Ativo (modal leve com sugestão)",
};

export const ALERT_TRIGGER_LABELS: Record<AlertTrigger, string> = {
  "same-task-too-long": "Muito tempo na mesma tarefa",
  "task-switching": "Troca de tarefa frequente",
  inactivity: "Inatividade prolongada",
  "time-overrun": "Ultrapassou o tempo planejado",
  "complex-task": "Ao iniciar uma tarefa complexa",
};
