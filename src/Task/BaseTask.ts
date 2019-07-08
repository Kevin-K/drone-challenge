import moment = require("moment");

export const POSITIVE_DEADLINE_SECS = 2 * 60 * 60;
export const NEUTRAL_DEADLINE_SECS = 5 * 60 * 60;

export interface Task {
  id: string | number;
  initTime: Date;
  positiveDeadline: Date;
  neutralDeadline: Date;
  run(start: Date): Date;
  getPriority(): number;
  getComputeTimeSecs(): number;
  getSecsToPositiveDeadline(refTime: Date): number;
  getSecsToNeutralDeadline(refTime: Date): number;
  getScore(endTime: Date): -1 | 0 | 1;
}

export interface TaskResult {
  task: Task;
  startTime: Date;
  endTime: Date;
  score: number;
}

export class BaseTask implements Task {
  id: string | number;
  positiveDeadlineSecs: number = POSITIVE_DEADLINE_SECS;
  neutralDeadlineSecs: number = NEUTRAL_DEADLINE_SECS;
  initTime: Date;
  positiveDeadline: Date;
  neutralDeadline: Date;

  constructor(initTime: Date, id: string | number) {
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
    throw new Error("BaseTask is abstract, please extend.");
  }

  run(start: Date) {
    // Todo: if other constraints are needed we can add them here

    console.log(`[${this.id}] Started at: ${start.toLocaleString()}`);
    const end = moment(start)
      .add(this.getComputeTimeSecs(), "seconds")
      .toDate();
    console.log(`[${this.id}] Finished at: ${end.toLocaleString()}`);
    return end;
  }

  getPriority() {
    return 0;
  }

  setInitTime(initTime: Date) {
    this.initTime = initTime;
  }

  setPositiveDeadlineSecs(seconds: number) {
    this.positiveDeadlineSecs = seconds;
  }

  setNeutralDeadlineSecs(seconds: number) {
    this.neutralDeadlineSecs = seconds;
  }

  getSecsToPositiveDeadline(refTime: Date) {
    const refMoment = moment(refTime);
    const deadlineMoment = moment(this.positiveDeadline);
    return moment.duration(deadlineMoment.diff(refMoment)).asSeconds();
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
    if (end < positive) {
      return 1;
    } else if (end < neutral) {
      return 0;
    } else {
      return -1;
    }
  }
}
