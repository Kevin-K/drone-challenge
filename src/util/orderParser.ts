import { isString } from "lodash";
import { parseTime } from "./parseTime";

export interface Order {
  orderId: string;
  deliveryCoords: Coordinates;
  orderTime: Date;
}

export type CoordinateParser = (x: string) => Coordinates;
export type OrderParser = (x: string) => Order;

export const parseOrder: OrderParser = orderStr => {
  if (!isString(orderStr)) {
    throw new Error("Invalid order format.");
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
