import { parseCoordinates, ERR_INVAL_COORDS } from "./parseCoordinates";

describe("parseCoordinates", () => {
  describe("error handling", () => {
    it("throws an error on invalid argument type", () => {
      const invalidInput = 12 as any;
      expect(() => {
        parseCoordinates(invalidInput);
      }).toThrowError(ERR_INVAL_COORDS);
    });
    it("throws an error if input does not match format", () => {
      expect(() => {
        parseCoordinates("E20W20");
      }).toThrowError(ERR_INVAL_COORDS);
    });
  });
  describe("with valid arguments", () => {
    it("returns a Coordinate object for SE", () => {
      expect(parseCoordinates("S2E5")).toEqual({
        north: 0,
        south: 2,
        east: 5,
        west: 0
      });
    });
    it("returns a Coordinate object for SW", () => {
      expect(parseCoordinates("S2W5")).toEqual({
        north: 0,
        south: 2,
        east: 0,
        west: 5
      });
    });

    it("returns a Coordinate object for NE", () => {
      expect(parseCoordinates("N2E5")).toEqual({
        north: 2,
        south: 0,
        east: 5,
        west: 0
      });
    });
    it("returns a Coordinate object for NW", () => {
      expect(parseCoordinates("N2W5")).toEqual({
        north: 2,
        south: 0,
        east: 0,
        west: 5
      });
    });
  });
});
