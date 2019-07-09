import { BaseScheduler } from "./BaseScheduler";

import { Task } from "../Task/BaseTask";
import { existanceSort } from "../util/existanceSort";

/**
 * Enhanced Earliest Deadline First Scheduler
 * Task with potential for promote wins over neutral/detract
 * If promote ability is a tie, shorter compute time wins
 *
 */
export class EDFScheduler extends BaseScheduler {
  constructor(refTime: Date, minTime: Date, maxTime: Date) {
    super(refTime, minTime, maxTime);
    this.queuedTasks.compare = (a: Task, b: Task) => this.prioritySort(a, b);
  }

  /***
   * Rank each task by promotability.
   * 3 if promote (binary 11)
   * 1 if neutral (binary 01)
   * 0 if detract (binary 00)
   *
   * Higher promotability wins
   *
   * Break promotability ties with compute time
   *
   * Break compute time ties with earliest deadline
   *
   * Break earliest deadlines ties with earliest init time
   *
   * Break init time ties with id compare (for purety)
   *
   * return -1 = a is higher priority, 1 = b is higher priority
   */
  prioritySort(a: Task, b: Task): number {
    // heap has empty positions in last level, add general handler for no a / no b.
    if (!a || !b) {
      return existanceSort(a, b);
    }
    // optimally compute these when needed
    // for readability hoisted to top
    const aPos = a.canReachPositiveDeadline(this.refTime);
    const bPos = b.canReachPositiveDeadline(this.refTime);
    const aNeut = a.canReachNeutralDeadline(this.refTime);
    const bNeut = b.canReachNeutralDeadline(this.refTime);
    const aCS = a.getComputeTimeSecs();
    const bCS = b.getComputeTimeSecs();
    const aPosDl = a.getPositiveDeadlineSlack(this.refTime);
    const bPosDl = b.getPositiveDeadlineSlack(this.refTime);
    const aInitTime = a.initTime.getTime();
    const bInitTime = b.initTime.getTime();

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
    } else if (aPosDl < bPosDl) {
      // Future support, dynamic deadline
      return -1;
    } else if (bPosDl < aPosDl) {
      // Future support, dynamic deadline
      return 1;
    } else if (aInitTime < bInitTime) {
      return -1;
    } else if (bInitTime < aInitTime) {
      return 1;
    } else {
      return a.id.localeCompare(b.id);
    }
  }
}
