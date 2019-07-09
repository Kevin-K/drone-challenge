import { Task_2D } from "./Task_2D";

describe("Task_2D", () => {
  let task: Task_2D;
  let initTime: Date;

  beforeEach(() => {
    initTime = new Date();
    task = new Task_2D(initTime, "id_1", 1, 2);
  });

  it("has an x computation length", () => {
    expect(task.xCompLen).toEqual(1);
  });

  it("has a y computation length", () => {
    expect(task.yCompLen).toEqual(2);
  });

  describe("getComputeTimeSecs", () => {
    it("computes pythagorean with a = xLen * xSecPerLen, b = yLen * ySecPerlen", () => {
      task.xCompSecPerLen = 3;
      task.yCompSecPerLen = 5;
      // c = sqrt( (1*3)^2 + (2 * 5)^2) = ~10.44
      expect(task.getComputeTimeSecs()).toBeCloseTo(10.44);
    });
  });
});
