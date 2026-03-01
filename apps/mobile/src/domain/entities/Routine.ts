export interface RoutineStep {
  id: string;
  routineId: string;
  title: string;
  position: number;
  completed: boolean;
}

export interface Routine {
  id: string;
  userId: string;
  name: string;
  icon?: string;
  position: number;
  isActive: boolean;
  steps: RoutineStep[];
  createdAt: string;
  updatedAt: string;
}
