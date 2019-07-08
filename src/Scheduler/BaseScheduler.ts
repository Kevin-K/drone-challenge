import { Heap } from "heap-js";
import { Task, TaskResult } from "../Task/BaseTask";

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
    this.queuedTasks = new Heap<Task>();
  }

  prioritySort(a: Task, b: Task): number {
    throw new Error("BaseScheduler prioritySort is abstract. Please extend");
  }

  getTasks() {
    return this.queuedTasks;
  }

  peekNextTask() {
    return this.queuedTasks.peek();
  }
}
