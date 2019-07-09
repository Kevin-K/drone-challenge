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
        task: baseTask,
        delivered: true
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

  describe("Compute logic", () => {
    beforeEach(() => {
      baseTask.getComputeTimeSecs = () => 2;
    });

    describe("getPositiveDeadlineSlack", () => {
      it("returns the number of seconds must start to meet positive deadline", () => {
        expect(baseTask.getPositiveDeadlineSlack(initTime)).toEqual(
          baseTask.positiveDeadlineSecs - 2
        );
      });
    });

    describe("getCompleteTime", () => {
      it("returns the date object for when the task would finish", () => {
        expect(baseTask.getCompleteTime(initTime).getTime()).toEqual(
          initTime.getTime() + 2000
        );
      });
    });

    describe("getNeutralDeadlineSlack", () => {
      it("returns the number of seconds must start to meet neutral deadline", () => {
        expect(baseTask.getNeutralDeadlineSlack(initTime)).toEqual(
          baseTask.neutralDeadlineSecs - 2
        );
      });
    });
    describe("canReachPositiveDeadline", () => {
      it("returns true if time at complete is LTE deadline", () => {
        expect(baseTask.canReachPositiveDeadline(initTime)).toEqual(true);
      });

      it("returns true if time at complete is GT deadline", () => {
        const tooLate =
          initTime.getTime() + baseTask.positiveDeadlineSecs * 1000;
        expect(baseTask.canReachPositiveDeadline(new Date(tooLate))).toEqual(
          false
        );
      });
    });
    describe("canReachNeutralDeadline", () => {
      it("returns true if time at complete is LTE deadline", () => {
        expect(baseTask.canReachNeutralDeadline(initTime)).toEqual(true);
      });

      it("returns true if time at complete is GT deadline", () => {
        const tooLate =
          initTime.getTime() + baseTask.neutralDeadlineSecs * 1000;
        expect(baseTask.canReachNeutralDeadline(new Date(tooLate))).toEqual(
          false
        );
      });
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
