import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings } from "lucide-react";
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
import { useTimerPreferences } from "@/presentation/hooks/useTimerPreferences";

const schema = z.object({
  focusDuration: z.coerce.number().min(1).max(120),
  breakDuration: z.coerce.number().min(1).max(60),
  longBreakDuration: z.coerce.number().min(1).max(120),
  cyclesBeforeLongBreak: z.coerce.number().min(1).max(10),
});

type FormValues = z.infer<typeof schema>;

interface TimerPreferencesPanelProps {
  onClose?: () => void;
}

export function TimerPreferencesPanel({ onClose }: TimerPreferencesPanelProps) {
  const { preferences, updatePreferences, isUpdating } = useTimerPreferences();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      focusDuration: preferences.focusDuration,
      breakDuration: preferences.breakDuration,
      longBreakDuration: preferences.longBreakDuration,
      cyclesBeforeLongBreak: preferences.cyclesBeforeLongBreak,
    },
  });

  // Sync form when preferences load
  useEffect(() => {
    form.reset({
      focusDuration: preferences.focusDuration,
      breakDuration: preferences.breakDuration,
      longBreakDuration: preferences.longBreakDuration,
      cyclesBeforeLongBreak: preferences.cyclesBeforeLongBreak,
    });
    // form.reset is stable per react-hook-form docs; include all primitive preference values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    preferences.focusDuration,
    preferences.breakDuration,
    preferences.longBreakDuration,
    preferences.cyclesBeforeLongBreak,
  ]);

  const onSubmit = (values: FormValues) => {
    updatePreferences(values);
    onClose?.();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 w-72 shadow-md">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="focusDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground whitespace-nowrap">
                    Focus (minutes)
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={120}
                      className="h-8 text-sm text-muted-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breakDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground whitespace-nowrap">
                    Short break (minutes)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={60}
                      className="h-8 text-sm text-muted-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longBreakDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground whitespace-nowrap">
                    Long break (minutes)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={120}
                      className="h-8 text-sm text-muted-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cyclesBeforeLongBreak"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground whitespace-nowrap">
                    Cycles before long break
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      className="h-8 text-sm text-muted-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex place-content-end gap-2 pt-1">
            <Button
              type="submit"
              size="sm"
              disabled={isUpdating}
              className="flex w-20"
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
