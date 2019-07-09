import { DeliveryTask } from "./DeliveryTask";
import { Order } from "../util";
describe("DeliveryTask", () => {
  let task: DeliveryTask;
  let initTime: Date;
  const order: Order = {
    deliveryCoords: {
      north: 1,
      south: 0,
      east: 0,
      west: 2
    },
    orderId: "fake_1",
    orderTime: new Date()
  };

  beforeEach(() => {
    initTime = new Date();
    task = new DeliveryTask(order);
  });

  describe("getComputeTimeSecs", () => {
    it("is double that of Task_2D because delivery requires return to warehouse", () => {
      task.xCompSecPerLen = 3;
      task.yCompSecPerLen = 5;
      // c = sqrt( (1*3)^2 + (2 * 5)^2) = ~10.44
      // Delivery task compute = 2c
      expect(task.getComputeTimeSecs()).toBeCloseTo(2 * 10.44);
    });
  });
  describe("getSecsToPositiveDeadline", () => {
    it("is shifted right by a factor of 1/2 the compute time", () => {
      const toPos = Math.floor(task.getSecsToPositiveDeadline(initTime));
      const compute = Math.floor(
        task.positiveDeadlineSecs + task.getComputeTimeSecs() / 2
      );
      expect(toPos).toEqual(compute);
    });
  });
  describe("getSecsToNeutralDeadline", () => {
    it("is shifted right by a factor of 1/2 the compute time", () => {
      const toNeut = Math.floor(task.getSecsToNeutralDeadline(initTime));
      const compute = Math.floor(
        task.neutralDeadlineSecs + task.getComputeTimeSecs() / 2
      );
      expect(toNeut).toEqual(compute);
    });
  });
});
