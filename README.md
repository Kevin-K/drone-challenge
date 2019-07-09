# Drone Delivery Challenge

An implementation of the Walmart Labs Drone Delivery Challenge assignment.

## Assumptions

### Orders

- Orders cannot be scheduled until the order time arrives.
  - Scheduling can't see into the future in the real world.
- Orders are instantinously ready for delivery scheduling when placed.
- Orders that cannot be delivered by 10pm automatically are detractors, but delivered at some point in the future.
  - This is due to lack of days in input file, only current day
- Orders made before 6 am are still ranked based on order time.
  - Gives good metrics for user's desiring earlier deliveries.
- Orders are delivered one at a time, even if multiple orders to same location.
  - The drone has only enough room for one package. Future improvement.

### Drone Limitations

1. The drone must return to the its "home" (N0E0) by 20:00:00, as it charges overnight.
2. A drone is not restricted to traveling north, south, east, or west. It can travel northeast, northwest, southeast, southwest as well, while adhering to the ground speed of 1 vertical square per minute.
3. The drone is assumed to have enough battery to fly from 6:00:00 to 20:00:00 continuously.
4. The drone's software prevents canceling deliveries while in flight.

## Installation

```
npm install
```

## Running

```
npm start -- <input_file>
```

Output will be found in `results_<input_file>`

## Explanation

### Data Storage

To produce this scheduling simulation, 2 data stores are used.

1. [OrderSimulator](src/OrderSimulator.ts)

   - Stores all orders from the input file in a MaxHeap

     | Operation          | Time Complexity |     |     |     |
     | ------------------ | --------------- | --- | --- | --- |
     | Insert One         | O(log n)        |     |     |     |
     | Remove Max         | O(log n)        |     |     |     |
     | Populate from file | O(n)            |     |     |     |
     |                    |                 |     |     |     |

2. [EDFScheduler](src/Scheduler/EDFScheduler.ts)

   - Stores all scheduled tasks (order deliveries) in a MaxHeap

   | Operation                | Time Complexity |     |     |     |
   | ------------------------ | --------------- | --- | --- | --- |
   | Insert One               | O(log n)        |     |     |     |
   | Remove Max               | O(log n)        |     |     |     |
   | Populate from all orders | O(n)            |     |     |     |
   |                          |                 |     |     |     |

### Event loop

The simulation operates in an event loop, where the current event is
a point in time of which one of the following occurs:

1. Initial event: The drone is allowed to begin work (Scheduler's minTime)
2. A task is ready to be ran (drone make delivery).
   - next event will be drone delivery completes.

During the event loop 2 algorithmic operations occur:

1. Any ready orders are moved to the Scheduler.
2. The Scheduler processes the next task.

### No events to process in a loop

Should no task exist to be ran at an event time, the event time moves forward
to the nearest following Order to the given event time.

### Orders became available between task run start and end

It is possible for an order to be made while the drone is making a delivery.
This is normal, the drone has no control over users making orders. For this reason,
the first operation in the event loop is to check if any orders "came in".

This is done prior to operating on a task during the event, to allow the incoming orders
to impact the drones next delivery.

### Solution Design

This problem has many similarities to behaviors of existing systems. To better depict
the solution to this problem, we can compare it to an Operating Systems Scheduler.

Operating Systems (OS) are required to schedule tasks based on the various processes running
on a computer, and each process doesn't own its own CPU core so scheduling is needed
to order what process (task) gets to compute when (schedule).

An OS has the ability to freeze what a process is "doing", and give computation resources
to another process. This is a **preemptive** operation. There is overhead incurred
when doing so, but this bodes well for an OS to force processes to yield to more
important ones.

Unfortunetly due to assumption "Drone Limitation #4", our drone cannot yeild its current
delivery for a more important (higher scoring) one. A future software update may address this.
This means our scheduling involves **non-preemtive** operations. Once the drone leaves with
a delivery, that delivery is seen through.

To ensure the drone delivers to the most customers as soon as possible, the next delivery
task is determined **once the drone returns from its last delivery**. This allows orders
placed during the drones delivery to have importance, as aposed to using a
First-In-First-Out (FIFO) queue.

### Task ordering

Since tasks can be sorted at the moment in time that the drone will leave with them,
a **dynamic priority** is used to determine rank. This means an **online scheduler (dynamic)**
is used over an **offline scheduler(all tasks known befor starting, static priority)**.

A modified [Earliest Deadline First Scheduler](https://en.wikipedia.org/wiki/Earliest_deadline_first_scheduling)
(EDF Scheduler) is used to perform the task prioritization. It is modified because
EDF is typically applied to preemptive scheduling, allowing context switching
for more urgent tasks as they arrise.

#### Earliest Deadline First

EDF simply means given all tasks to compute, compare the tasks with such that the one with the soonest deadline
wins.

#### EDF Modification

The drone priority is to deliver packages in a manner that maximises promoters over neutrals over detractors.
Since there is no penalty for pushing a detractor later, priority is made to capitalize on more promoters
rather than the promoter that ends soonest.

Promoter status of delivery is ordered as follows:

    1. Promoter (highest)
    2. Neutral
    3. Detractor (lowest)

How long a delivery takes is known as its **compute time**. Since the drone has to travel round trip,
its compute time is:

```
computeTimeSeconds = 2 * deliveryDistance * deliverySecondsPerUnit
```

This means a delivery is a awarded a promoter if the drone reaches the delivery location by the deadline,
it can fly home after the deadline.

#### Sorting Algorithm

To accomplish this the following scoring algorithm is used when comparing 2 delivery tasks:
_Compare 2 delivery tasks A and B, the higher priority is delivered sooner_

    1. The task with the higher Promoter status wins. If tie continue.
        a. this is often a tie, so how can we be more granular?

    2. The task with the shortest compute time wins. If tie continue.
        a. shorter delivery means the drone may get back to find other short deliveries. More sorting events means more potential.

    3. The task with the earlier order time wins. If tie continue.
        a. low likelyhoood of tieing on compute time, but need to be deterministic.

    4. The task with the alphabetically lower  order ID wins
        a. again deterministic, IDs shall be unique and not reused.
