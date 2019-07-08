import { BaseTask } from "./BaseTask";
import { pythagorean } from "../util";

export class Task_2D extends BaseTask {
  xCompLen: number;
  xCompSecPerLen: number = 60;
  yCompLen: number;
  yCompSecPerLen: number = 60;

  constructor(
    initTime: Date,
    id: string | number,
    xCompLen: number,
    yCompLen: number
  ) {
    super(initTime, id);
    this.xCompLen = xCompLen;
    this.yCompLen = yCompLen;
  }

  getComputeTimeSecs() {
    const xComputeCost = this.xCompLen * this.xCompSecPerLen;
    const yComputeCost = this.yCompLen * this.yCompSecPerLen;
    return pythagorean(xComputeCost, yComputeCost);
  }
}
