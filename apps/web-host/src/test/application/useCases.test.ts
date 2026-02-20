import { describe, it, expect, vi } from "vitest";
import type { ITaskRepository } from "@/domain/interfaces/ITaskRepository";
import type { Task } from "@/domain/entities/Task";
import type { ChecklistStep } from "@/domain/entities/ChecklistStep";
import { TaskStatus } from "@/domain/valueObjects/TaskStatus";
import { CreateTask } from "@/application/useCases/CreateTask";
import { UpdateTaskStatus } from "@/application/useCases/UpdateTaskStatus";
import { ToggleChecklistStep } from "@/application/useCases/ToggleChecklistStep";
import { DeleteTask } from "@/application/useCases/DeleteTask";
import { CreateChecklistStep } from "@/application/useCases/CreateChecklistStep";

// Minimal stub repository
function makeRepo(overrides: Partial<ITaskRepository> = {}): ITaskRepository {
  return {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    reorderTasks: vi.fn(),
    getChecklistSteps: vi.fn(),
    createChecklistStep: vi.fn(),
    updateChecklistStep: vi.fn(),
    deleteChecklistStep: vi.fn(),
    getTimerPreferences: vi.fn(),
    updateTimerPreferences: vi.fn(),
    ...overrides,
  };
}

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: "task-1",
  userId: "user-1",
  title: "Test task",
  status: TaskStatus.TODO,
  position: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const makeStep = (overrides: Partial<ChecklistStep> = {}): ChecklistStep => ({
  id: "step-1",
  taskId: "task-1",
  title: "Test step",
  completed: false,
  position: 0,
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe("CreateTask use case", () => {
  it("calls repository with trimmed title", async () => {
    const task = makeTask({ title: "My task" });
    const repo = makeRepo({ createTask: vi.fn().mockResolvedValue(task) });
    const uc = new CreateTask(repo);

    await uc.execute("  My task  ");

    expect(repo.createTask).toHaveBeenCalledWith("My task", undefined);
  });

  it("throws when title is empty", async () => {
    const repo = makeRepo();
    const uc = new CreateTask(repo);

    await expect(uc.execute("   ")).rejects.toThrow(
      "Task title cannot be empty",
    );
    expect(repo.createTask).not.toHaveBeenCalled();
  });
});

describe("UpdateTaskStatus use case", () => {
  it("calls repository with correct id and status", async () => {
    const task = makeTask({ status: TaskStatus.IN_PROGRESS });
    const repo = makeRepo({ updateTask: vi.fn().mockResolvedValue(task) });
    const uc = new UpdateTaskStatus(repo);

    await uc.execute("task-1", TaskStatus.IN_PROGRESS);

    expect(repo.updateTask).toHaveBeenCalledWith("task-1", {
      status: TaskStatus.IN_PROGRESS,
    });
  });
});

describe("DeleteTask use case", () => {
  it("calls repository delete with the given id", async () => {
    const repo = makeRepo({ deleteTask: vi.fn().mockResolvedValue(undefined) });
    const uc = new DeleteTask(repo);

    await uc.execute("task-1");

    expect(repo.deleteTask).toHaveBeenCalledWith("task-1");
  });
});

describe("ToggleChecklistStep use case", () => {
  it("calls updateChecklistStep with the completed flag", async () => {
    const step = makeStep({ completed: true });
    const repo = makeRepo({
      updateChecklistStep: vi.fn().mockResolvedValue(step),
    });
    const uc = new ToggleChecklistStep(repo);

    await uc.execute("step-1", true);

    expect(repo.updateChecklistStep).toHaveBeenCalledWith("step-1", {
      completed: true,
    });
  });
});

describe("CreateChecklistStep use case", () => {
  it("trims the title and delegates to repository", async () => {
    const step = makeStep({ title: "Do this" });
    const repo = makeRepo({
      createChecklistStep: vi.fn().mockResolvedValue(step),
    });
    const uc = new CreateChecklistStep(repo);

    await uc.execute("task-1", "  Do this  ");

    expect(repo.createChecklistStep).toHaveBeenCalledWith("task-1", "Do this");
  });

  it("throws when title is empty", async () => {
    const repo = makeRepo();
    const uc = new CreateChecklistStep(repo);

    await expect(uc.execute("task-1", "")).rejects.toThrow(
      "Step title cannot be empty",
    );
  });
});
