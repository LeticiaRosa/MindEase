import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@repo/ui";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface TaskEditFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  initialTitle: string;
  initialDescription?: string;
  onSubmit: (
    id: string,
    params: { title?: string; description?: string },
  ) => void;
}

export function TaskEditForm({
  open,
  onOpenChange,
  taskId,
  initialTitle,
  initialDescription,
  onSubmit,
}: TaskEditFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialTitle,
      description: initialDescription ?? "",
    },
  });

  // Reset form when dialog opens with new values
  useEffect(() => {
    if (open) {
      form.reset({
        title: initialTitle,
        description: initialDescription ?? "",
      });
    }
  }, [open, initialTitle, initialDescription, form]);

  const handleSubmit = (values: FormValues) => {
    const params: { title?: string; description?: string } = {};

    if (values.title !== initialTitle) {
      params.title = values.title;
    }

    if (values.description !== (initialDescription ?? "")) {
      params.description = values.description;
    }

    // Only submit if something changed
    if (Object.keys(params).length > 0) {
      onSubmit(taskId, params);
    }

    onOpenChange(false);
  };

  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the task title and description.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Task title…"
                      type="text"
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add more details…"
                      className="min-h-25"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
