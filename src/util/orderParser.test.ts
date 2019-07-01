import { ERR_INVAL_COORDS } from "./parseCoordinates";
import { ERR_INVAL_ORDER, parseOrder } from "./orderParser";
import { ERR_INVAL_TIME } from "./parseTime";

describe("parseOrder", () => {
  describe("error handling", () => {
    it("throws an error on invalid argument type", () => {
      const invalidInput = 12 as any;
      expect(() => {
        parseOrder(invalidInput);
      }).toThrowError(ERR_INVAL_ORDER);
    });

    it("throws an error on time error", () => {
      expect(() => {
        parseOrder("WM001 N1E1 12-12-05");
      }).toThrowError(ERR_INVAL_TIME);
    });

    it("throws an error on Coordinate error", () => {
      expect(() => {
        parseOrder("WM001 E1E1 12:12:05");
      }).toThrowError(ERR_INVAL_COORDS);
    });
  });

  describe("with valid arguments", () => {
    const args = "WM001 N1E1 12:12:05";

    it("returns an order identifier", () => {
      expect(parseOrder(args).orderId).toEqual("WM001");
    });

    it("returns an delivery coordinate", () => {
      expect(parseOrder(args).deliveryCoords).toEqual({
        north: 1,
        east: 1,
        south: 0,
        west: 0
      });
    });

    it("returns an order time", () => {
      const orderTime = new Date();
      orderTime.setHours(12);
      orderTime.setMinutes(12);
      orderTime.setSeconds(5);
      orderTime.setMilliseconds(0);
      expect(parseOrder(args).orderTime).toEqual(orderTime);
    });
  });
});
