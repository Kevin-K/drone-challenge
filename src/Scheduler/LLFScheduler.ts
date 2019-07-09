import { BaseScheduler } from "./BaseScheduler";
import { Task } from "../Task/BaseTask";

/**
 * Least Laxity First Scheduler
 */
export class LLFScheduler extends BaseScheduler {
  constructor(refTime: Date) {
    super(refTime);
    this.queuedTasks.compare = (a: Task, b: Task) => this.prioritySort(a, b);
  }

  prioritySort(a: Task, b: Task): number {
    throw new Error("Not yet implemented.");
  }
}
