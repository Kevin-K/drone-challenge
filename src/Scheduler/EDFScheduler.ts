import { BaseScheduler } from "./BaseScheduler";

import { Task, heapBaseSort } from "../Task/BaseTask";
import { LLFScheduler } from "./LLFScheduler";

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
 * Enhanced Earliest Deadline First Scheduler
 *
 */
export class EDFScheduler extends BaseScheduler {
  constructor(refTime: Date, minTime: Date, maxTime: Date) {
    super(refTime, minTime, maxTime);
    this.queuedTasks.compare = (a: Task, b: Task) => this.prioritySort(a, b);
  }

  // -1 = a is higher priority, 1 = b is higher priority
  prioritySort(a: Task, b: Task): number {
    // heap has empty positions in last level, add general handler for no a / no b.
    if (!a || !b) {
      return heapBaseSort(a, b);
    }
    const aPos = a.canReachPositiveDeadline(this.refTime);
    const bPos = b.canReachPositiveDeadline(this.refTime);
    const aNeut = a.canReachNeutralDeadline(this.refTime);
    const bNeut = b.canReachNeutralDeadline(this.refTime);
    const aPosSlack = a.getPositiveDeadlineSlack(this.refTime);
    const aNuetSlack = a.getNeutralDeadlineSlack(this.refTime);
    const bPosSlack = b.getPositiveDeadlineSlack(this.refTime);
    const bNeutSlack = b.getNeutralDeadlineSlack(this.refTime);
    const aCS = a.getComputeTimeSecs();
    const bCS = b.getComputeTimeSecs();

    let aScore = 0;
    let bScore = 0;
    if (aPos) {
      aScore += 2;
    }
    if (aNeut) {
      aScore += 1;
    }
    if (bPos) {
      bScore += 2;
    }
    if (bNeut) {
      bScore += 1;
    }
    if (aScore > bScore) {
      return -1;
    } else if (bScore > aScore) {
      return 1;
    } else if (aCS < bCS) {
      return -1;
    } else if (bCS < aCS) {
      return 1;
    } else {
      return 0;
    }
  }
}
