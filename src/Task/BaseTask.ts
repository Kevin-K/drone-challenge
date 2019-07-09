import moment = require("moment");

export const POSITIVE_DEADLINE_SECS = 2 * 60 * 60;
export const NEUTRAL_DEADLINE_SECS = 5 * 60 * 60;
export const ERR_BASETASK_ABSTRACT = "BaseTask is abstract, please extend.";

export interface Task {
  id: string;
  initTime: Date;
  positiveDeadline: Date;
  neutralDeadline: Date;
  run(start: Date): TaskResult;
  getCompleteTime(refTime: Date): Date;
  getComputeTimeSecs(): number;
  getPositiveDeadlineSlack(refTime: Date): number;
  getNeutralDeadlineSlack(refTime: Date): number;
  getSecsToPositiveDeadline(refTime: Date): number;
  getSecsToNeutralDeadline(refTime: Date): number;
  canReachPositiveDeadline(refTime: Date): boolean;
  canReachNeutralDeadline(refTime: Date): boolean;

  getScore(endTime: Date): -1 | 0 | 1;
}
export const heapBaseSort = (a: any, b: any) => {
  if (!a) {
    if (!b) {
      return 0;
    }
    return 1;
  } else if (!b) {
    return -1;
  } else {
    return 0;
  }
};

export interface TaskResult {
  task: Task;
  delivered: boolean;
  startTime?: Date;
  endTime?: Date;
  score: number;
}
export class BaseTask implements Task {
  id: string;
  positiveDeadlineSecs: number = POSITIVE_DEADLINE_SECS;
  neutralDeadlineSecs: number = NEUTRAL_DEADLINE_SECS;
  initTime: Date;
  positiveDeadline: Date;
  neutralDeadline: Date;

  constructor(initTime: Date, id: string) {
    this.id = id;
    this.initTime = initTime;
    this.positiveDeadline = moment(initTime)
      .add(this.positiveDeadlineSecs, "seconds")
      .toDate();
    this.neutralDeadline = moment(initTime)
      .add(this.neutralDeadlineSecs, "seconds")
      .toDate();
  }

  // return typed to number here, to inform typescript
  // that this does adhere to the interface,
  // (it throws an error because its abstract so no number returned)
  getComputeTimeSecs(): number {
    throw new Error(ERR_BASETASK_ABSTRACT);
  }

  run(start: Date) {
    // Todo: if other constraints are needed we can add them here

    console.log(`[${this.id}] Started at: ${start.toLocaleString()}`);
    const end = moment(start)
      .add(this.getComputeTimeSecs(), "seconds")
      .toDate();

    console.log(`[${this.id}] Finished at: ${end.toLocaleString()}`);
    return {
      startTime: start,
      endTime: end,
      score: this.getScore(end),
      task: this,
      delivered: true
    };
  }

  getCompleteTime(refTime: Date) {
    return new Date(refTime.getTime() + this.getComputeTimeSecs() * 1000);
  }
  getSecsToPositiveDeadline(refTime: Date) {
    const refMoment = moment(refTime);
    const deadlineMoment = moment(this.positiveDeadline);
    return moment.duration(deadlineMoment.diff(refMoment)).asSeconds();
  }

  getPositiveDeadlineSlack(refTime: Date) {
    return this.getSecsToPositiveDeadline(refTime) - this.getComputeTimeSecs();
  }

  getNeutralDeadlineSlack(refTime: Date) {
    return this.getSecsToNeutralDeadline(refTime) - this.getComputeTimeSecs();
  }

  canReachPositiveDeadline(refTime: Date) {
    return this.getPositiveDeadlineSlack(refTime) >= 0;
  }

  canReachNeutralDeadline(refTime: Date) {
    return Boolean(this.getNeutralDeadlineSlack(refTime));
  }

  getSecsToNeutralDeadline(refTime: Date) {
    const refMoment = moment(refTime);
    const deadlineMoment = moment(this.neutralDeadline);
    return moment.duration(deadlineMoment.diff(refMoment)).asSeconds();
  }

  getScore(endTime: Date) {
    const end = endTime.getTime();
    const positive = this.positiveDeadline.getTime();
    const neutral = this.neutralDeadline.getTime();
    if (end <= positive) {
      return 1;
    } else if (end <= neutral) {
      return 0;
    } else {
      return -1;
    }
  }
}
