import { Heap } from "heap-js";
import { Task, TaskResult } from "../Task/BaseTask";
import { formatTime } from "../util/formatTime";
export const ERR_BASESCHEDULER_NO_SORT =
  "BaseScheduler prioritySort is abstract. Please extend";

export interface Scheduler {
  minTime: Date;
  maxTime: Date;
  refTime: Date;
  runningTask?: Task;
  queuedTasks: Heap<Task>;
  nextDayTasks: Heap<Task>;
  finishedTasks: TaskResult[];
  prioritySort: (a: Task, b: Task) => number;
}

export class BaseScheduler implements Scheduler {
  minTime: Date;
  maxTime: Date;
  refTime: Date;
  runningTask?: Task;
  finishedTasks: TaskResult[] = [];
  queuedTasks: Heap<Task>;
  nextDayTasks: Heap<Task>;

  constructor(refTime: Date, minTime: Date, maxTime: Date) {
    this.minTime = minTime;
    this.maxTime = maxTime;
    this.refTime = refTime;
    this.queuedTasks = new Heap<Task>(this.prioritySort);
    this.nextDayTasks = new Heap<Task>(this.prioritySort);
  }

  prioritySort(a: Task, b: Task): number {
    throw new Error(ERR_BASESCHEDULER_NO_SORT);
  }

  addTask(refTime: Date, task: Task) {
    this.refTime = refTime;
    this.queuedTasks.add(task);
    console.log(
      `[${task.id}] added to schedule at ${refTime.toLocaleString()}`
    );
  }

  getNextTask(): Task | undefined {
    return this.queuedTasks.pop();
  }

  runNextTask(refTime: Date) {
    // restrict operation to after min time
    if (refTime.getTime() < this.minTime.getTime()) {
      console.log(`Can't operate before ${formatTime(this.minTime)}.`);
      return this.refTime;
    }

    // Popping a task off the heap resorts the heap
    // O(log n)
    const task = this.getNextTask();
    if (!task) {
      console.log(`No task found`);
      return this.refTime;
    }

    const taskCompleteAt = task.getCompleteTime(refTime);

    if (this.maxTime.getTime() < taskCompleteAt.getTime()) {
      console.log(`[${task.id}] Missed Delivery window.`);
      this.finishedTasks.push({
        task,
        score: -1,
        delivered: false
      });
      return refTime;
    } else {
      // Running the task is has no complexity, just moves
      // the simulation time.
      // O(1)
      const result = task.run(refTime);

      // Array push
      // O(1)
      this.finishedTasks.push(result);

      // forcing type to Date, as endTime is in TaskResult if delivered
      return result.endTime as Date;
    }
  }

  getFinalScore() {
    const scores = this.finishedTasks.map(ft => ft.score);
    const total = scores.length;
    const promoters = scores.filter(score => score === 1).length;
    const denoters = scores.filter(score => score === -1).length;
    return promoters / total - denoters / total || 0;
  }
}
