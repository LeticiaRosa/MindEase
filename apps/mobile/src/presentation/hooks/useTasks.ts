import { useQuery } from "@tanstack/react-query";
import type { Task } from "@/domain/entities/Task";
import { SupabaseTaskRepository } from "@/infrastructure/adapters/SupabaseTaskRepository";
import { GetTasks } from "@/application/useCases/GetTasks";

const repository = new SupabaseTaskRepository();
const getTasks = new GetTasks(repository);

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: () => getTasks.execute(),
  });
}
