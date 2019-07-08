import { Heap } from "heap-js";
import { Task, TaskResult } from "../Task/BaseTask";
export const ERR_BASESCHEDULER_NO_SORT =
  "BaseScheduler prioritySort is abstract. Please extend";

export interface Scheduler {
  runningTask?: Task;
  queuedTasks: Heap<Task>;
  finishedTasks: TaskResult[];
  prioritySort: (a: Task, b: Task) => number;
}

export class BaseScheduler implements Scheduler {
  runningTask?: Task;
  finishedTasks: TaskResult[] = [];
  queuedTasks: Heap<Task>;

  constructor() {
    this.queuedTasks = new Heap<Task>(this.prioritySort);
  }

  prioritySort(a: Task, b: Task): number {
    throw new Error(ERR_BASESCHEDULER_NO_SORT);
  }
}
