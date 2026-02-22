import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@repo/ui";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button, Checkbox, RadioGroup, RadioGroupItem } from "@repo/ui";
import {
  alertPreferencesSchema,
  type AlertPreferencesDTO,
} from "@/application/dtos/AlertPreferencesDTO";
import { useAlertPreferences } from "@/presentation/contexts/AlertPreferencesContext";
import {
  ALERT_TRIGGER_LABELS,
  ALERT_TONE_LABELS,
  ALERT_INTENSITY_LABELS,
  type AlertTrigger,
  type AlertTone,
  type AlertIntensity,
} from "@/domain/valueObjects/AlertTypes";
import { Logo } from "../components/Logo";
const TRIGGERS = Object.keys(ALERT_TRIGGER_LABELS) as AlertTrigger[];
const TONES = Object.keys(ALERT_TONE_LABELS) as AlertTone[];
const INTENSITIES = Object.keys(ALERT_INTENSITY_LABELS) as AlertIntensity[];

const STEPS = [
  {
    id: "triggers",
    title: "Quando alertar",
    subtitle: "Escolha os momentos em que você quer receber suporte.",
  },
  {
    id: "tone",
    title: "Tom das mensagens",
    subtitle: "Como você prefere ser lembrado?",
  },
  {
    id: "intensity",
    title: "Intensidade",
    subtitle: "Quanto visível deve ser o alerta?",
  },
] as const;

export default function CognitiveAlertConfigPage() {
  const navigate = useNavigate();
  const { preferences, savePreferences } = useAlertPreferences();
  const toast = useToast();
  const [step, setStep] = useState<number>(0);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AlertPreferencesDTO>({
    resolver: zodResolver(alertPreferencesSchema),
    defaultValues: {
      triggers: preferences.triggers,
      tone: preferences.tone,
      intensity: preferences.intensity,
      sameTaskThresholdMin: preferences.sameTaskThresholdMin,
      taskSwitchThreshold: preferences.taskSwitchThreshold,
      inactivityThresholdMin: preferences.inactivityThresholdMin,
    },
  });

  const selectedTriggers = watch("triggers");
  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const onSubmit = (data: AlertPreferencesDTO) => {
    savePreferences(data);
    toast.success("Alertas cognitivos atualizados!", {
      description: "Suas preferências foram salvas.",
      duration: 4000,
    });
    navigate("/dashboard");
  };

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
                Alertas Cognitivos
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Personalize seus apoios executivos
              </p>
            </div>
          </div>
          <Logo />
        </div>
      </header>

      {/* Step indicator */}
      <div className="max-w-2xl mx-auto px-6 pt-4">
        <div
          className="flex items-center gap-2 mb-6"
          role="list"
          aria-label="Etapas"
        >
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2" role="listitem">
              <div
                className={`
                  flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold
                  transition-colors duration-150
                  ${
                    i < step
                      ? "bg-primary text-primary-foreground"
                      : i === step
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                  }
                `}
                aria-current={i === step ? "step" : undefined}
              >
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className={`h-px w-8 transition-colors ${i < step ? "bg-primary" : "bg-border"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step heading */}
        <h2 className="text-xl font-semibold mb-1">{currentStep.title}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {currentStep.subtitle}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="max-w-2xl mx-auto px-6 pb-24"
      >
        {/* Step 1 — Triggers */}
        <div hidden={step !== 0} aria-hidden={step !== 0}>
          <Controller
            name="triggers"
            control={control}
            render={({ field }) => (
              <div
                className="flex flex-col gap-2"
                role="group"
                aria-label="Gatilhos de alerta"
              >
                {TRIGGERS.map((trigger) => {
                  const checked = field.value.includes(trigger);
                  return (
                    <label
                      key={trigger}
                      className={`
                        flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer
                        transition-colors duration-150
                        focus-within:ring-2 focus-within:ring-amber-500
                        ${checked ? "border-primary bg-card" : "border-border bg-primary/5 hover:border-border/80"}
                      `}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(val) => {
                          if (val) {
                            field.onChange([...field.value, trigger]);
                          } else {
                            field.onChange(
                              field.value.filter((t) => t !== trigger),
                            );
                          }
                        }}
                        className="mt-0.5 shrink-0"
                        aria-label={ALERT_TRIGGER_LABELS[trigger]}
                      />
                      <span className="text-sm leading-relaxed">
                        {ALERT_TRIGGER_LABELS[trigger]}
                      </span>
                    </label>
                  );
                })}
                {errors.triggers && (
                  <p role="alert" className="text-sm text-destructive mt-1">
                    {errors.triggers.message as string}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Step 2 — Tone */}
        <div hidden={step !== 1} aria-hidden={step !== 1}>
          <Controller
            name="tone"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-col gap-2"
                aria-label="Tom das mensagens"
              >
                {TONES.map((tone) => (
                  <label
                    key={tone}
                    className={`
                      flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer
                      transition-colors duration-150
                      focus-within:ring-2 focus-within:ring-amber-500
                      ${field.value === tone ? "border-primary bg-card" : "border-border bg-primary/5 hover:border-border/80"}
                    `}
                  >
                    <RadioGroupItem value={tone} className="mt-0.5 shrink-0" />
                    <span className="text-sm leading-relaxed">
                      {ALERT_TONE_LABELS[tone]}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />
        </div>

        {/* Step 3 — Intensity */}
        <div hidden={step !== 2} aria-hidden={step !== 2}>
          <Controller
            name="intensity"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-col gap-2"
                aria-label="Intensidade dos alertas"
              >
                {INTENSITIES.map((intensity) => (
                  <label
                    key={intensity}
                    className={`
                      flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer
                      transition-colors duration-150
                      focus-within:ring-2 focus-within:ring-amber-500
                      ${field.value === intensity ? "border-primary bg-card" : "border-border bg-primary/5 hover:border-border/80"}
                    `}
                  >
                    <RadioGroupItem
                      value={intensity}
                      className="mt-0.5 shrink-0"
                    />
                    <span className="text-sm leading-relaxed">
                      {ALERT_INTENSITY_LABELS[intensity]}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />
        </div>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 border-t border-border/50 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0}
              className="gap-2"
            >
              <ChevronLeft className="size-4" />
              Anterior
            </Button>

            {isLastStep ? (
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Check className="size-4" />
                Salvar preferências
              </Button>
            ) : (
              <Button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  handleNext();
                }}
                disabled={step === 0 && selectedTriggers.length === 0}
                className="gap-2"
              >
                Próximo
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
