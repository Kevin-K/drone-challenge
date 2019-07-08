import { Task_2D } from "./Task_2D";
import { Order } from "../util";

export class DeliveryTask extends Task_2D {
  order: Order;

  constructor(order: Order) {
    const { north, south, east, west } = order.deliveryCoords;
    const latMag = Math.abs(north - south);
    const lonMag = Math.abs(east - west);
    super(order.orderTime, order.orderId, latMag, lonMag);
    this.order = order;
  }
  /**
   * A delivery task has double the compute time, as the drone has
   * to return to the warehouse when completed
   */
  getComputeTimeSecs() {
    return super.getComputeTimeSecs() * 2;
  }

  /**
   * The positive deadline is padded by the return trip.
   * The customer doesn't care that the drone flys home after the deadline.
   */
  getSecsToPositiveDeadline(refTime: Date) {
    return (
      super.getSecsToPositiveDeadline(refTime) + super.getComputeTimeSecs()
    );
  }

  /**
   * The neutral deadline is padded by the return trip.
   * The customer doesn't care that the drone flys home after the deadline.
   */
  getSecsToNeutralDeadline(refTime: Date) {
    return super.getSecsToNeutralDeadline(refTime) + super.getComputeTimeSecs();
  }
}
