import { Order } from "./util";
import { Heap } from "heap-js";
export class OrderSimulator {
  orders: Heap<Order>;

  static orderPriority = (a: Order, b: Order) => {
    if (a) {
      if (b) {
        return a.orderTime.getTime() - b.orderTime.getTime();
      } else {
        return a.orderTime.getTime();
      }
    } else if (b) {
      return b.orderTime.getTime();
    } else {
      return 0;
    }
  };

  constructor(orders: Order[] = []) {
    this.orders = new Heap<Order>(OrderSimulator.orderPriority);
    this.orders.init(orders);
  }

  getReadyOrders(refTime: Date): Order[] {
    let nextOrder: Order | undefined;
    const orders: Order[] = [];
    while ((nextOrder = this.orders.peek())) {
      if (nextOrder.orderTime.getTime() <= refTime.getTime()) {
        const readyOrder = this.orders.pop();
        if (readyOrder) {
          orders.push(readyOrder);
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return orders;
  }

  peek(): Order | undefined {
    return this.orders.peek();
  }
}
