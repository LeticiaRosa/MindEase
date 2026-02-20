import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Button, Input } from "@repo/ui";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(200),
});

type FormValues = z.infer<typeof schema>;

interface TaskCreateFormProps {
  onSubmit: (title: string) => void;
}

export function TaskCreateForm({ onSubmit }: TaskCreateFormProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const submit = (values: FormValues) => {
    onSubmit(values.title);
    reset();
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label="Add a task"
      >
        <Plus className="size-4" />
        Add task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-2">
      <Input
        {...register("title")}
        ref={(el) => {
          register("title").ref(el);
          (
            inputRef as React.MutableRefObject<HTMLInputElement | null>
          ).current = el;
        }}
        placeholder="Task title…"
        autoComplete="off"
        className="text-sm"
        aria-label="New task title"
      />
      {errors.title && (
        <p className="text-xs text-destructive" role="alert">
          {errors.title.message}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" size="sm" className="flex-1">
          Add
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            reset();
            setOpen(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
