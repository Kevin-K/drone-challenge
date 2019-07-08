import { pythagorean } from "./pythagorean";

describe("pythagorean", () => {
  describe("error handling", () => {
    it("returns NaN if an input is not a number", () => {
      expect(pythagorean({} as any, 2)).toEqual(NaN);
    });
  });

  describe("with valid arguments", () => {
    it("returns the value of c", () => {
      expect(pythagorean(3, 3)).toBeCloseTo(Math.sqrt(18));
    });
  });
});
