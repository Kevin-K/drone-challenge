import { BaseScheduler, ERR_BASESCHEDULER_NO_SORT } from "./BaseScheduler";
describe("BaseScheduler", () => {
  let scheduler: BaseScheduler;
  beforeEach(() => {
    scheduler = new BaseScheduler();
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
      endTime: new Date()
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
});
