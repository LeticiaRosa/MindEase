import { useQuery } from "@tanstack/react-query";
import type { Task } from "@/domain/entities/Task";
import { taskRepository as repository } from "@/infrastructure/factories/repositories";
import { GetTasks } from "@/application/useCases/GetTasks";

const getTasks = new GetTasks(repository);

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: () => getTasks.execute(),
  });
}
