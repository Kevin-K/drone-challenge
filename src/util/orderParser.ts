import { isString } from "util";
import { parseTime } from "./parseTime";
import { parseCoordinates, Coordinates } from "./parseCoordinates";

export interface Order {
  orderId: string;
  deliveryCoords: Coordinates;
  orderTime: Date;
}

export type OrderParser = (x: string) => Order;
export const ERR_INVAL_ORDER = "Order does not match specified format.";

export const parseOrder: OrderParser = orderStr => {
  if (!isString(orderStr)) {
    throw new Error(ERR_INVAL_ORDER);
  }
  const [orderIdStr, coordStr, timeStr] = orderStr
    // 1. trim out any leading or trailing spaces
    .trim()
    // 2. fix any extra spacing so only 1 space between arguments
    .replace(/\s+/g, " ")
    // 3. split the arguments by spaces
    .split(" ");

  return {
    orderId: orderIdStr.toUpperCase(),
    deliveryCoords: parseCoordinates(coordStr),
    orderTime: parseTime(timeStr)
  };
};
