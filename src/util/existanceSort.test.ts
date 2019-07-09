import { formatTime } from "./formatTime";
import { existanceSort } from "./existanceSort";

describe("existanceSort", () => {
  it("1 if no a", () => {
    expect(existanceSort(undefined, 1)).toEqual(1);
  });
  it("-1 if no b", () => {
    expect(existanceSort(1, undefined)).toEqual(-1);
  });
  it("0 if both", () => {
    expect(existanceSort(1, 1)).toEqual(0);
  });
  it("0 if neither", () => {
    expect(existanceSort(undefined, undefined)).toEqual(0);
  });
});
