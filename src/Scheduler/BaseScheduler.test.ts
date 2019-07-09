import { BaseScheduler, ERR_BASESCHEDULER_NO_SORT } from "./BaseScheduler";
import moment = require("moment");
import { Task } from "../Task/BaseTask";
import { DeliveryTask } from "../Task/DeliveryTask";
import { parseTime } from "../util";
describe("BaseScheduler", () => {
  let scheduler: BaseScheduler;
  let initTime: Date;
  let minTime: Date;
  let maxTime: Date;
  beforeEach(() => {
    initTime = moment("06:00:00", "HH:mm:ss").toDate();
    minTime = initTime;
    maxTime = moment("20:00:00", "HH:mm:ss").toDate();
    scheduler = new BaseScheduler(initTime, minTime, maxTime);
  });
  it("has queuedTasks", () => {
    expect(scheduler.queuedTasks).toBeDefined();
  });

  it("has no priortySort", () => {
    expect(() => {
      // prioritySort called when > 1 element
      scheduler.queuedTasks.add({} as any);
      scheduler.queuedTasks.add({} as any);
    }).toThrowError(ERR_BASESCHEDULER_NO_SORT);
  });

  describe("getNextTask", () => {
    it("returns undefined if no tasks", () => {
      expect(scheduler.getNextTask()).toBeUndefined();
    });
    it("returns the highest priority", () => {
      scheduler.queuedTasks.add(1 as any);
      expect(scheduler.getNextTask()).toEqual(1);
    });
  });

  describe("getFinalScore", () => {
    const FAKE_TEST_RESULT_PROMOTE = {
      task: {} as any,
      score: 1,
      startTime: new Date(),
      endTime: new Date(),
      delivered: true
    };
    const FAKE_TEST_RESULT_NEUTRAL = {
      ...FAKE_TEST_RESULT_PROMOTE,
      score: 0
    };
    const FAKE_TEST_RESULT_DETER = {
      ...FAKE_TEST_RESULT_PROMOTE,
      score: -1
    };

    it("returns 0 if no tasks finished", () => {
      expect(scheduler.getFinalScore()).toEqual(0);
    });
    it("returns 1 if all tasks promote", () => {
      scheduler.finishedTasks.push(FAKE_TEST_RESULT_PROMOTE);
      expect(scheduler.getFinalScore()).toEqual(1);
    });
    it("returns ~.3 if 1/3 tests promote and none detract", () => {
      scheduler.finishedTasks.push(FAKE_TEST_RESULT_PROMOTE);
      scheduler.finishedTasks.push(FAKE_TEST_RESULT_NEUTRAL);
      scheduler.finishedTasks.push(FAKE_TEST_RESULT_NEUTRAL);
      expect(scheduler.getFinalScore()).toBeCloseTo(0.333);
    });
    it("returns 0 if even amount of promote and none detract", () => {
      scheduler.finishedTasks.push(FAKE_TEST_RESULT_PROMOTE);
      scheduler.finishedTasks.push(FAKE_TEST_RESULT_DETER);
      scheduler.finishedTasks.push(FAKE_TEST_RESULT_NEUTRAL);
      scheduler.finishedTasks.push(FAKE_TEST_RESULT_NEUTRAL);
      expect(scheduler.getFinalScore()).toEqual(0);
    });
  });

  describe("addTask", () => {
    it("updates the sort refTime", () => {
      const time = parseTime("07:59:59");
      scheduler.addTask(time, {} as Task);
      expect(scheduler.refTime).toEqual(time);
    });
    it("adds the task to the heap", () => {
      const time = parseTime("07:59:59");
      expect(scheduler.queuedTasks.isEmpty()).toEqual(true);
      scheduler.addTask(time, {} as Task);
      expect(scheduler.queuedTasks.isEmpty()).toEqual(false);
    });
  });

  describe("runNextTask", () => {
    it("returns the refTime if no tasks", () => {
      const time = parseTime("07:59:59");
      expect(scheduler.runNextTask(time)).toEqual(time);
    });
    it("returns the refTime if less than minTime", () => {
      const tooEarly = parseTime("05:59:59");
      expect(scheduler.runNextTask(tooEarly)).toEqual(tooEarly);
    });
    it("pushes the task to finished, delivered false, and detract if can't deliver before maxTime", () => {
      const wontFit = new DeliveryTask({
        orderId: "Fake1",
        orderTime: parseTime("05:59:59"),
        deliveryCoords: {
          north: 100000,
          south: 0,
          east: 100000,
          west: 0
        }
      });
      scheduler.queuedTasks.add(wontFit);
      expect(scheduler.runNextTask(initTime)).toEqual(initTime);
      expect(scheduler.finishedTasks.length).toEqual(1);
      expect(scheduler.finishedTasks[0].delivered).toEqual(false);
      expect(scheduler.finishedTasks[0].score).toEqual(-1);
    });

    it("pushes the task to finished, delivered true returns the endTime on success", () => {
      const willFit = new DeliveryTask({
        orderId: "Fake1",
        orderTime: parseTime("05:59:59"),
        deliveryCoords: {
          north: 1,
          south: 0,
          east: 0,
          west: 0
        }
      });
      scheduler.queuedTasks.add(willFit);
      const result = scheduler.runNextTask(initTime);
      expect(scheduler.finishedTasks.length).toEqual(1);
      expect(scheduler.finishedTasks[0].delivered).toEqual(true);
      expect(result).toEqual(scheduler.finishedTasks[0].endTime);
    });
  });
});
