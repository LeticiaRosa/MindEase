import type { Task } from "../entities/Task";

export interface ITaskRepository {
  getTasks(): Promise<Task[]>;
}
