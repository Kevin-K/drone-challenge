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
});
