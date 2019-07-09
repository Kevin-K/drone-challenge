import { parseOrder, printHelp, parseTime, inputFileToArray } from "./util";
import { DeliveryTask } from "./Task/DeliveryTask";
import { OrderSimulator } from "./OrderSimulator";
import { EDFScheduler } from "./Scheduler/EDFScheduler";
import { resultsToFile } from "./util/resultsToFile";

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
const [, , inputFile] = process.argv;

/**
 * Read in the input file
 */
const orders = inputFileToArray(inputFile).map(parseOrder);

/**
 * Simulation starts at 6 am
 */
let refTime = SIMULATION_START_DATE;

// OrderSimulator contains a MaxHeap of orders, sorted by orderTime
const orderSim = new OrderSimulator(orders);

// EDFScheduler contains a MaxHeap of delivery tasks, sorted by dynamic priority
const scheduler = new EDFScheduler(
  refTime,
  SIMULATION_START_DATE,
  SIMULATION_END_DATE
);

console.log("Starting simulation at", refTime.toLocaleString());
while (true) {
  // get any orders ready for the scheduler at the current time
  // heap search is O(log n), but this is a linear operation, removing
  // the top of the heap, causing O(n * log n) if all are removed.
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
  // O(n * log n)
  readyOrders.forEach(order =>
    scheduler.addTask(refTime, new DeliveryTask(order))
  );

  // O(1)
  if (!scheduler.queuedTasks.isEmpty()) {
    refTime = scheduler.runNextTask(refTime);
  }
}
console.log(`Final Score: ${scheduler.getFinalScore()}`);
console.log(`Utilization: ${scheduler.getUtilization()}`);

resultsToFile(
  Math.floor(scheduler.getFinalScore() * 100),
  scheduler.finishedTasks,
  `results_${inputFile}`
);
