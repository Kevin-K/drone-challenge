import { BaseTask, ERR_BASETASK_ABSTRACT } from "./BaseTask";
describe("BaseTask", () => {
  let baseTask: BaseTask;
  let initTime: Date;
  beforeEach(() => {
    initTime = new Date();
    baseTask = new BaseTask(initTime, "id_1");
  });
  it("has an id", () => {
    expect(baseTask.id).toEqual("id_1");
  });
  it("has an init time", () => {
    expect(baseTask.initTime).toEqual(initTime);
  });
  it("has a positive deadline", () => {
    expect(baseTask.positiveDeadline.getTime()).toBeGreaterThanOrEqual(
      initTime.getTime()
    );
  });
  it("has a neutral deadline", () => {
    expect(baseTask.neutralDeadline.getTime()).toBeGreaterThanOrEqual(
      initTime.getTime()
    );
  });

  it("does not get compute time", () => {
    expect(() => {
      baseTask.getComputeTimeSecs();
    }).toThrowError(ERR_BASETASK_ABSTRACT);
  });

  it("does not get compute time", () => {
    expect(() => {
      baseTask.getComputeTimeSecs();
    }).toThrowError(ERR_BASETASK_ABSTRACT);
  });

  describe("run", () => {
    it("throws an error because abstract getComputeTime", () => {
      expect(() => {
        baseTask.run(initTime);
      }).toThrowError(ERR_BASETASK_ABSTRACT);
    });
    it("returns a TaskResult when getComputeTimeSecs implemented", () => {
      baseTask.getComputeTimeSecs = () => 2;
      expect(baseTask.run(initTime)).toEqual({
        startTime: initTime,
        endTime: new Date(initTime.getTime() + 2 * 1000),
        score: 1,
        task: baseTask
      });
    });
  });

  describe("getSecsToPositiveDeadline", () => {
    it("returns time to deadline in seconds", () => {
      // curr time = init
      expect(baseTask.getSecsToPositiveDeadline(initTime)).toEqual(
        baseTask.positiveDeadlineSecs
      );

      // curr time = init + 2 seconds
      const currTime = new Date(initTime.getTime() + 2 * 1000);
      expect(baseTask.getSecsToPositiveDeadline(currTime)).toEqual(
        baseTask.positiveDeadlineSecs - 2
      );
    });
  });

  describe("getSecsToNeutralDeadline", () => {
    it("returns time to deadline in seconds", () => {
      expect(baseTask.getSecsToNeutralDeadline(initTime)).toEqual(
        baseTask.neutralDeadlineSecs
      );

      // curr time = init + 2 seconds
      const currTime = new Date(initTime.getTime() + 2 * 1000);
      expect(baseTask.getSecsToNeutralDeadline(currTime)).toEqual(
        baseTask.neutralDeadlineSecs - 2
      );
    });
  });
  describe("getScore", () => {
    it("gets a 1 score if endTime <= positiveDeadline", () => {
      expect(baseTask.getScore(initTime)).toEqual(1);
    });
    it("gets a 0 score if positiveDeadline < endTime <= neutralDeadline", () => {
      const afterPositive =
        initTime.getTime() + (baseTask.positiveDeadlineSecs + 1) * 1000;
      expect(baseTask.getScore(new Date(afterPositive))).toEqual(0);
    });
    it("gets a -1 score if neutralDeadline < endTime", () => {
      const afterNeutral =
        initTime.getTime() + (baseTask.neutralDeadlineSecs + 1) * 1000;
      expect(baseTask.getScore(new Date(afterNeutral))).toEqual(-1);
    });
  });
});
