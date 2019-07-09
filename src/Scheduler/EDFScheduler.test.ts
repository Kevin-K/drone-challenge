import { EDFScheduler } from "./EDFScheduler";
import { parseTime } from "../util";
import { Task, BaseTask } from "../Task/BaseTask";

describe("EDFScheduler", () => {
  let scheduler: EDFScheduler;
  let initTime: Date;
  let minTime: Date;
  let maxTime: Date;

  beforeEach(() => {
    initTime = parseTime("06:00:00");
    minTime = initTime;
    maxTime = parseTime("20:00:00");
    scheduler = new EDFScheduler(initTime, minTime, maxTime);
  });
  describe("prioritySort", () => {
    let aTask: Task;
    let bTask: Task;
    beforeEach(() => {
      aTask = new BaseTask(initTime, "a'");
      bTask = new BaseTask(initTime, "b'");
    });
    it("returns 1 if a does not exist", () => {
      expect(scheduler.prioritySort(undefined as any, {} as Task)).toEqual(1);
    });
    it("returns -1 if b does not exist", () => {
      expect(scheduler.prioritySort({} as Task, undefined as any)).toEqual(-1);
    });
    it("returns 0 if neither exist", () => {
      expect(
        scheduler.prioritySort(undefined as any, undefined as any)
      ).toEqual(0);
    });

    it("picks a if a positive b less than positive", () => {
      aTask.getComputeTimeSecs = () => 2;
      bTask.getComputeTimeSecs = () => 3 * 60 * 60; // 3 hours = neutral;
      expect(scheduler.prioritySort(aTask, bTask)).toEqual(-1);
    });

    it("picks a if a positive b positive and a has less compute time", () => {
      aTask.getComputeTimeSecs = () => 2;
      bTask.getComputeTimeSecs = () => 3;
      expect(scheduler.prioritySort(aTask, bTask)).toEqual(-1);
      bTask.getComputeTimeSecs = () => 2 * 60 * 60;
      expect(scheduler.prioritySort(aTask, bTask)).toEqual(-1);
    });

    it("picks b if b positive a less than positive", () => {
      bTask.getComputeTimeSecs = () => 2;
      aTask.getComputeTimeSecs = () => 3 * 60 * 60; // 3 hours = neutral;
      expect(scheduler.prioritySort(aTask, bTask)).toEqual(1);
    });

    it("picks b if a positive b positive and b has less compute time", () => {
      bTask.getComputeTimeSecs = () => 2;
      aTask.getComputeTimeSecs = () => 3;
      expect(scheduler.prioritySort(aTask, bTask)).toEqual(1);
      aTask.getComputeTimeSecs = () => 2 * 60 * 60;
      expect(scheduler.prioritySort(aTask, bTask)).toEqual(1);
    });

    it("picks a if promote tie compute time tie and a has earlier deadline", () => {
      aTask.getComputeTimeSecs = () => 2;
      bTask.getComputeTimeSecs = () => 2;
      bTask.initTime = parseTime("06:10:00");
      expect(scheduler.prioritySort(aTask, bTask)).toEqual(-1);
    });
    it("picks b if promote tie compute time tie and b has earlier deadline", () => {
      aTask.getComputeTimeSecs = () => 2;
      bTask.getComputeTimeSecs = () => 2;
      aTask.initTime = parseTime("06:10:00");
      expect(scheduler.prioritySort(aTask, bTask)).toEqual(1);
    });

    it("picks based on id if promote and compute tie", () => {
      aTask.getComputeTimeSecs = () => 2;
      bTask.getComputeTimeSecs = () => 2;
      expect(scheduler.prioritySort(aTask, bTask)).toEqual(-1);
    });
  });
});
