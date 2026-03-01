import { useQuery } from "@tanstack/react-query";
import type { Task } from "@/domain/entities/Task";
import { SupabaseTaskRepository } from "@/infrastructure/adapters/SupabaseTaskRepository";

const repository = new SupabaseTaskRepository();

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: () => repository.getTasks(),
  });
}
