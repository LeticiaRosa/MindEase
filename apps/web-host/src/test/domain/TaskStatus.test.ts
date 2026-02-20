import { describe, it, expect } from "vitest";
import {
  TaskStatus,
  TASK_STATUS_LABELS,
} from "@/domain/valueObjects/TaskStatus";

describe("TaskStatus", () => {
  it("has the correct values", () => {
    expect(TaskStatus.TODO).toBe("todo");
    expect(TaskStatus.IN_PROGRESS).toBe("in_progress");
    expect(TaskStatus.DONE).toBe("done");
  });

  it("has human-readable labels for all statuses", () => {
    expect(TASK_STATUS_LABELS.todo).toBe("To Do");
    expect(TASK_STATUS_LABELS.in_progress).toBe("In Progress");
    expect(TASK_STATUS_LABELS.done).toBe("Done");
  });
});
