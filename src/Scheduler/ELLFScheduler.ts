import { BaseScheduler } from "./BaseScheduler";

import { Task, TaskResult } from "../Task/BaseTask";

export const getSlackTime = (refTime: Date, task: Task) => {
  if (!task) {
    return 0;
  }
  // slack = Deadline - (currentTime + computationTime)
  return (
    task.positiveDeadline.getTime() -
    (refTime.getTime() + task.getComputeTimeSecs() * 1000)
  );
};

/**
 * Enhanced Least Laxity First Scheduler
 */
export class ELLFScheduler extends BaseScheduler {
  refTime: Date;

  constructor(refTime: Date) {
    super();
    this.refTime = refTime;
    this.queuedTasks.compare = (a: Task, b: Task) => this.prioritySort(a, b);
  }

  getRefTime() {
    return this.refTime;
  }

  prioritySort(a: Task, b: Task): number {
    return getSlackTime(this.refTime, a) - getSlackTime(this.refTime, b);
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
    // Popping a task off the heap resorts the heap
    // O(?)
    const task = this.queuedTasks.pop();
    if (!task) {
      return this.refTime;
    }

    // Running the task is has no complexity, just moves
    // the simulation time.
    // O(1)
    const endTime = task.run(refTime);
    const result: TaskResult = {
      task,
      startTime: refTime,
      endTime,
      score: task.getScore(endTime)
    };

    // Array push
    // O(1)
    this.finishedTasks.push(result);
    return endTime;
  }

  getFinalScore() {
    const scores = this.finishedTasks.map(ft => ft.score);
    const total = scores.length;
    const promoters = scores.filter(score => score === 1).length;
    const denoters = scores.filter(score => score === -1).length;
    return promoters / total - denoters / total;
  }
}
