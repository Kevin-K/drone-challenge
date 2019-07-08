import * as fs from "fs";
import { parseOrder, printHelp, parseTime, inputFileToArray } from "./util";
import { ELLFScheduler } from "./Scheduler/ELLFScheduler";
import { DeliveryTask } from "./Task/DeliveryTask";
import { OrderSimulator } from "./OrderSimulator";

const SIMULATION_START_DATE: Date = parseTime("06:00:00");
const SIMULATION_END_DATE: Date = parseTime("22:00:00");
/**
 * Read in arguments
 */
// Ensure arguments are correct
if (process.argv.length < 3) {
  console.error("Invalid arguments.");
  printHelp();
  process.exit(1);
}
const [_node, _program, inputFile] = process.argv;

/**
 * Read in the input file
 */
const orders = inputFileToArray(inputFile).map(parseOrder);

/**
 * Simulation starts at 6 am
 */
let refTime = SIMULATION_START_DATE;

/**
 * Generate resources: order simulator, and scheduler
 */

// OrderSimulator contains a MaxHeap of orders, sorted by orderTime
const orderSim = new OrderSimulator(orders);

// ELLFScheduler contains a MaxHeap of scheduledTasks, sorted by laxity
// also contains an array of finished tasks, sorted by completion time
const scheduler = new ELLFScheduler(refTime);

/**
 * There are 2 heaps of data to process:
 * 1. Orders, sorted by orderTime.
 * 2. Tasks, sorted by laxity to positive deadline
 *
 * For simplicity, running tasks are NOT preemtive, so once a task starts,
 * the clock moves to when the task finishes. Any orders placed during the
 * compute time of the task are "processed" at task completion before
 * next task begins.
 */

console.log("Starting simulation at", refTime.toLocaleString());
while (true) {
  // get any orders ready for the scheduler at the current time
  // heap search is O(log n), but this is a linear operation, removing
  // the top of the heap, causing O(n log n) to resort for each removal.
  const readyOrders = orderSim.getReadyOrders(refTime);

  // If no ready orders and the schedule is empty, fast forward to next order
  if (!readyOrders.length && scheduler.queuedTasks.isEmpty()) {
    // O(1) get max of the orders (doesn't remove)
    const nextOrder = orderSim.peek();
    if (nextOrder) {
      refTime = nextOrder.orderTime;
      continue;
    } else {
      break;
    }
  }

  // add all ready orders to the schedule
  // Each addition causes a resort of the scheduler's heap
  // O(n log n)
  readyOrders.forEach(order =>
    scheduler.addTask(refTime, new DeliveryTask(order))
  );

  if (!scheduler.queuedTasks.isEmpty()) {
    /**
     * The heart of this assignment.
     * The scheduler runNextTask removes the task
     * with least laxity, has its refTime set to the completion
     * of said task, then resorts the task heap based on
     * laxity.
     * O(n log n)
     */
    refTime = scheduler.runNextTask(refTime);
  }
}
console.log(`Final Score: ${scheduler.getFinalScore()}`);
